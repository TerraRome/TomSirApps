import CustomButton from '@components/Button'
import Text from '@components/Text'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { theme } from '@utils/theme'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomers } from 'services/customer'
import { setCustomer } from 'store/actions/customer'

interface Customer {
  name: string
  email: string
  phone_number: string
  createdAt: Date
  updatedAt: Date
}

let searchDebounce: any = null
const CustomerList: React.FC = () => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const navigation = useNavigation()
  const { user } = useSelector((state: any) => state.auth)
  const { rows, page_size, current_page } = useSelector((state: any) => state.customer)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'ASC',
    merchant_id: user.merchant.id,
    search: undefined,
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
        } = await getCustomers({ ...queryParams, ...params })
        // console.log(data);
        dispatch(setCustomer(data))
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

  const onPressCustomer = (item: any) => () => {

    return navigation.navigate('AddCustomer', {
      id: item?.id,
      name: item?.name,
      email: item?.email,
      phone_number: item?.phone_number,
      isEdit: true
    })
  }

  const renderItem = ({ item }: { item: Customer }) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPressCustomer(item)}>
        <Text>{item?.name}</Text>
        <Text>{item?.phone_number}</Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Daftar customer kosong
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
        onEndReached={getNextPage}
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
        <View style={styles.input}>
          <TextInput
            value={queryParams.search}
            placeholder="Cari nama pelanggan..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <View style={styles.closeSearch}>
            <AntDesign name="search1" color="darkgrey" size={18} />
          </View>
        </View>
        {renderListProduct()}
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          mode="default"
          onPress={() => {
            navigation.navigate('AddCustomer')
          }}
          style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH BARU</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default CustomerList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 130,
    paddingTop: 16,
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
    justifyContent: 'space-between',
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
})
