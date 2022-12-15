import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, RefreshControl, Image, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts } from 'services/products'
import { getAllKas } from 'services/kas'
import { setKas } from 'store/actions/kas'
import { setProducts } from 'store/actions/products'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { setIngredientItem } from 'store/actions/ingredient'
import { theme } from '@utils/theme'
import Text from '@components/Text'
import CustomButton from '@components/Button'
import { convertToRupiah } from '@utils/convertRupiah'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CalendarPicker from '@components/CalendarPicker'
import moment from 'moment'

interface Kas {
  tanggal: string
  type: String
  jumlah: number
  deskripsi: string
  createdAt: Date
  updatedAt: Date
}

let searchDebounce: any = null
const KasList: React.FC = () => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const navigation = useNavigation()
  const { user } = useSelector((state: any) => state.auth)
  const { rows, page_size, current_page } = useSelector((state: any) => state.kas)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'ASC',
    merchant_id: user.merchant.id,
    search: undefined,
    start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  })

  useEffect(() => {
    refreshData()
  }, [isFocused])

  const refreshData = (param?: any) => {
    getData({ page: 1, ...param })
  }

  const getData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        if (!queryParams?.search) {
          delete queryParams.search
        }
        const {
          data: { data },
        } = await getAllKas({ ...queryParams, ...params })
        // console.log(data);
        dispatch(setKas(data))
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [queryParams.search],
  )

  const getNextPage = () => {
    const hasNextPage = Boolean(page_size === queryParams.limit)
    const nextPage = current_page + 1
    if (isLoading || !hasNextPage) {
      return
    }
    getData({ page: nextPage })
  }

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  const onPressKas = (item: any) => () => {

    return navigation.navigate('AddKas', {
      id: item?.id,
      tanggal: item?.tanggal,
      type: item?.type,
      jumlah: item?.jumlah,
      deskripsi: item?.deskripsi,
      isEdit: true
    })
  }

  const renderItem = ({ item }: { item: Kas }) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPressKas(item)}>
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'flex-start' }}>{item?.deskripsi}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'center' }}>{item?.type}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'flex-end' }}>Rp {convertToRupiah(item?.jumlah)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Daftar kas kosong
      </Text>
    </View>
  )

  const renderDivider = () => <View style={styles.divider} />

  const renderListProduct = () => {
    return (
      <FlatList
        data={rows}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatlist}
        // onEndReached={getNextPage}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          queryParams.page === 1 ? (
            <RefreshControl colors={[theme.colors.primary]} refreshing={Boolean(isLoading)} onRefresh={refreshData} />
          ) : undefined
        }
        ItemSeparatorComponent={renderDivider}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.content1]}>
          {isSearching || queryParams.search ? (
            <View style={styles.rowCenter}>
              <TextInput
                style={{ flex: 1, marginVertical: 0 }}
                value={queryParams.search}
                placeholder="Cari id pesanan..."
                onChangeText={handleSearch}
              />
              <TouchableOpacity
                style={styles.closeSearch}
                onPress={() => {
                  handleSearch(undefined)
                  setIsSearching(false)
                }}>
                <AntDesign name="closecircle" color={theme.colors.blackSemiTransparent} size={18} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.rowCenter}>
              <View style={{ flex: 0.9 }}>
                <CalendarPicker
                  selectedStartDate={queryParams.start_date}
                  selectedEndDate={queryParams.end_date}
                  onChange={props => {
                    const params = { ...queryParams, start_date: props.selectedStartDate, end_date: props.selectedEndDate }
                    setParams(params)
                  }}
                />
              </View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => setIsSearching(true)} style={styles.searchToggle}>
                <FontAwesome name="search" size={18} color={theme.colors.greyBlack} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {renderListProduct()}
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          mode="default"
          onPress={() => {
            navigation.navigate('AddKas')
          }}
          style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH BARU</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default KasList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 130,
    paddingTop: 16,
  },
  content1: {
    paddingHorizontal: 10,
  },
  input: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  searchBar: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    fontSize: 13,
    flex: 1,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 11,
  },
  flatlist: {},
  productList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    //justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey2,
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  emptyImage: {
    width: 300,
    height: 300,
    marginTop: 32,
    resizeMode: 'contain',
  },
  center: {
    alignSelf: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  searchToggle: {
    marginLeft: 8,
    flex: 0.15,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.defaultBorderColor,
  },
})
