import Text from '@components/Text'
import { useIsFocused } from '@react-navigation/native'
import { formatDate } from '@utils/formatDate'
import { theme } from '@utils/theme'
import { showErrorToast } from 'components/Toast'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator, Alert, FlatList,
  Image, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View
} from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderList } from 'services/order'
import { setOrders } from 'store/actions/order'
import { convertToRupiah } from 'utils/convertRupiah'

let searchDebounce: any = null
const OrderList = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const { rows, page_size, current_page } = useSelector((state: any) => state.order)
  const cartsState = useSelector((state: any) => state.carts.data)
  const merchant = useSelector((state: any) => state.auth?.user?.merchant)

  const orderId = cartsState.find((e: any) => !!e.orderId)?.orderId

  const [isLoading, setLoading] = useState(false)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    order: 'ASC',
    status: 'hold',
    merchant_id: merchant.id,
    search: undefined,
  })

  const getData = useCallback(
    async (params?: any) => {
      console.log(merchant.id);

      setLoading(true)
      try {
        if (!queryParams?.search) {
          delete queryParams.search
        }
        if (!params?.search) {
          delete params.search
        }
        const {
          data: { data },
        } = await getOrderList({ ...queryParams, ...params })
        dispatch(setOrders(data))
      } catch (error: any) {
        showErrorToast(error.message)
      } finally {
        setLoading(false)
      }
    },
    [queryParams],
  )

  const getNextPage = () => {
    const hasNextPage = Boolean(page_size === queryParams.limit)
    const nextPage = current_page + 1
    if (isLoading || !hasNextPage) {
      return
    }
    getData({ page: nextPage })
  }

  const refreshData = (param?: any) => {
    getData({ page: 1, ...param })
  }

  const handleSearch = (search: any) => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      refreshData({ search })
    }, 400)
    setParams({ ...queryParams, search })
  }

  useEffect(() => {
    refreshData()
  }, [isFocused])

  const onPressItem = (item: any) => () => {
    if (cartsState?.length > 0) {
      const existingItem = rows.find((e: any) => e.id === orderId)
      return Alert.alert(
        'Simpan Pesanan',
        `Masih terdapat pesanan ${existingItem?.note || ''} di keranjang Anda. Simpan pesanan untuk melanjutkan.`,
        [
          {
            text: 'Simpan',
            onPress: () => {
              navigation.navigate('CheckOut', { item: existingItem })
            },
          },
          {
            text: 'Batal',
          },
        ],
      )
    }
    navigation.navigate('CheckOut', { item })
  }

  const renderItem = ({ item }: { item: any }) => {
    const createdAt = item?.createdAt && formatDate(item?.createdAt)
    return (
      <TouchableOpacity style={styles.listItem} activeOpacity={0.5} onPress={onPressItem(item)}>
        <View>
          <Text size={9} type="semibold">
            {item?.code} - {item?.note}
          </Text>
          <Text size={8} color="grey" type="regular">
            {createdAt?.date} {createdAt?.time}
          </Text>
        </View>
        <Text size={9} type="regular">
          {item?.total_price && convertToRupiah(item?.total_price)}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderDivider = () => <View style={styles.divider} />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.input}>
          <TextInput
            value={queryParams.search || ''}
            placeholder="Cari kode atau note pesanan..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          {!!queryParams?.search && (
            <TouchableOpacity
              style={styles.closeSearch}
              onPress={() => {
                handleSearch(undefined)
              }}>
              <AntDesign name="closecircle" color="darkgrey" size={18} />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={rows}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={getNextPage}
          onEndReachedThreshold={1}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={() => <Footer loading={false} />}
          ListEmptyComponent={EmptyList}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              refreshing={Boolean(isLoading && current_page === 1)}
              onRefresh={refreshData}
            />
          }
        />
      </View>
    </View>
  )
}
const EmptyList = () => (
  <View style={styles.center}>
    <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
    <Text style={styles.center} type="semibold">
      No Data
    </Text>
  </View>
)

const Footer = ({ loading }: { loading: boolean }) => (
  <View style={styles.footer}>
    <ActivityIndicator size="large" color={theme.colors.primary} animating={loading} />
  </View>
)

export default OrderList

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {},
  input: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey2,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  emptyImage: { width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain' },
  center: { alignSelf: 'center' },
  searchBar: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 50,
    borderWidth: 1,
    fontSize: 13,
    flex: 1,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
})
