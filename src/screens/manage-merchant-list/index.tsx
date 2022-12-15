import React, { useCallback, useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { theme } from '@utils/theme'
import Text from '@components/Text'
import { getMerchantById } from '@store/actions/merchant'
import CustomButton from '@components/Button'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { setMerchant } from '@store/actions/merchant'
import { getMerchants } from '@services/merchant'

interface Merchant {
  id: string
  name: string
}

let searchDebounce: any = null

const ManageMerchantList: React.FC = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const { rows, page_size, current_page } = useSelector((state: any) => state.merchants)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'name',
    order: 'ASC',
    search: undefined,
  })

  useEffect(() => {
    refreshData()
  }, [queryParams, isFocused])

  const refreshData = (params?: any) => {
    getData({ page: 1, ...params })
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
        } = await getMerchants({ ...queryParams, ...params })
        dispatch(setMerchant(data))
      } catch (error) {
        // console.log(error.response)
      } finally {
        setLoading(false)
      }
    },
    [queryParams.search],
  )

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  const onPressMerchant = (item: any) => () => {
    return navigation.navigate('ManageMerchant', {
      id: item?.id,
      name: item?.name,
      address: item?.address,
      phone: item?.phone_number,
      footer_note: item?.footer_note,
      server_key: item?.server_key,
      client_key: item?.client_key,
      image: item?.image,
      isEdit: true,
    })
  }

  const renderItem = ({ item }: { item: Merchant }) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPressMerchant(item)}>
        <Text size={9} type="regular">
          {item?.name}
        </Text>
        <AntDesign name="right" size={18} color={theme.colors.blackSemiTransparent} />
      </TouchableOpacity>
    )
  }

  const renderDivider = () => <View style={styles.divider} />

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.input}>
          <TextInput
            value={queryParams.search}
            placeholder="Cari nama merchant..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <View style={styles.closeSearch}>
            <AntDesign name="search1" color="darkgrey" size={18} />
          </View>
        </View>
        <FlatList
          data={rows}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={renderDivider}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              refreshing={Boolean(isLoading && current_page === 1)}
              onRefresh={refreshData}
            />
          }
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={() => navigation.navigate('ManageMerchant')} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>TAMBAH MERCHANT</Text>
        </CustomButton>
      </View>
    </SafeAreaView>
  )
}

export default ManageMerchantList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
    borderRadius: 0,
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
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 13,
    flex: 1,
    borderRadius: 10,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
})
