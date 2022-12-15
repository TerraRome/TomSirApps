import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View
} from 'react-native'

import { convertToRupiah } from '@utils/convertRupiah'
import { theme } from '@utils/theme'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@components/Button'
import Modalize from '@components/Modalize'
import Text from '@components/Text'
import { showErrorToast } from '@components/Toast'
import WrapFooterButton from '@components/WrapFooterButton'
import { useNavigation } from '@react-navigation/native'
import { getProducts } from '@services/products'
import { getCategory } from '@store/actions/category'
import { getMerchantById } from '@store/actions/merchant'
import { setProducts } from '@store/actions/products'
import { SafeAreaView } from 'react-native-safe-area-context'
import calculateCart from 'utils/calculateCart'
import Card from './product-card'

let searchDebounce: any = null
export default function Home() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const modalFilterRef: any = useRef()
  const { user } = useSelector((state: any) => state.auth)
  const carts = useSelector((state: any) => state.carts.data)
  const order = useSelector((state: any) => state.order.rows)
  const category = useSelector((state: any) => state.category.rows)
  const { rows, page_size, current_page } = useSelector((state: any) => state.products)

  const LIST_CATEGORY = [{ id: undefined, name: 'Semua Produk', icon: '🏳️' }, ...category]

  const [isLoading, setLoading] = useState(false)

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 20,
    sortBy: 'name',
    order: 'ASC',
    merchant_id: user.merchant.id,
    category_id: undefined,
    search: undefined,
  })

  const [isSearching, setIsSearching] = useState(false)

  const calculate = calculateCart(carts)

  const subTotalMinusDiscount = calculate.subtotal - calculate.discount

  const selectedCategory = category.find((e: any) => e.id === queryParams.category_id)

  const getData = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        if (!queryParams?.category_id) {
          delete queryParams.category_id
        }
        if (!queryParams?.search) {
          delete queryParams.search
        }
        const {
          data: { data },
        } = await getProducts({ ...queryParams, ...params })
        dispatch(setProducts(data))
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
    dispatch(getCategory())
    dispatch(getMerchantById())
    refreshData()
  }, [])

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <View style={[styles.header, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity
            style={styles.headerItem}
            onPress={() => {
              //@ts-ignore
              navigation.openDrawer()
            }}>
            <Feather name="menu" size={20} />
          </TouchableOpacity>
          <Text type="semibold" style={{ fontSize: 18 }}>
            Katalog
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.wrapRightHeader]}
          onPress={() => {
            navigation.navigate('OrderList')
          }}>
          <FontAwesome5 name="concierge-bell" size={20} color={theme.colors.blackSemiTransparent} />
          {order?.length > 0 && (
            <View style={styles.badgeIcon}>
              <Text color="white" style={{ fontSize: 9 }} type="semibold">
                {order?.length > 9 ? '9+' : order?.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {isSearching ? (
        <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
          <TextInput
            value={queryParams.search}
            placeholder="Cari nama produk..."
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.closeSearch}
            onPress={() => {
              handleSearch(undefined)
              setIsSearching(false)
            }}>
            <AntDesign name="closecircle" color="darkgrey" size={18} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
          <TouchableOpacity
            onPress={() => modalFilterRef?.current?.open()}
            activeOpacity={0.5}
            style={[styles.filterButton]}>
            <Text type="semibold">{selectedCategory?.name || 'Semua Produk'}</Text>
            <Entypo name="chevron-down" size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setIsSearching(true)}
            style={[styles.filterButton, styles.searchButton]}>
            <FontAwesome name="search" size={14} />
            <Text type="semibold" style={{ marginLeft: 10 }}>
              Cari
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={rows}
        numColumns={3}
        style={{ marginTop: 16 }}
        keyExtractor={item => item.id}
        onEndReached={getNextPage}
        onEndReachedThreshold={1}
        renderItem={props => <Card {...props} numColumns={3} carts={carts} />}
        ListFooterComponent={() => <Footer loading={Boolean(rows?.length > 10 && isLoading)} />}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            refreshing={Boolean(isLoading && current_page === 1)}
            onRefresh={refreshData}
          />
        }
      />
      {carts.length > 0 && (
        <WrapFooterButton>
          <Button onPress={() => navigation.navigate('CheckOut')} style={styles.checkoutButton}>
            <Text type="bold" color="white">
              Keranjang • <Text color="white">{calculate.qty} items</Text>
            </Text>
            <Text color="white" type="semibold">
              {convertToRupiah(subTotalMinusDiscount)}
            </Text>
          </Button>
        </WrapFooterButton>
      )}
      <Modalize ref={modalFilterRef}>
        <FlatList
          data={LIST_CATEGORY}
          style={{ padding: 16 }}
          keyExtractor={item => item.name + item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.name + item.id}
              style={styles.filterItem}
              onPress={async () => {
                await setParams({ ...queryParams, category_id: item.id })
                refreshData({ category_id: item.id })
                modalFilterRef?.current?.close()
              }}>
              <Text type="semibold">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </Modalize>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
  },
  center: { alignSelf: 'center' },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  emptyImage: { width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain' },
  checkoutButton: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
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
  filterButton: {
    flex: 0.8,
    backgroundColor: '#F2F5FA',
    borderRadius: 40,
    padding: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  searchButton: {
    flex: 0.2,
    justifyContent: 'center',
    marginLeft: 10,
  },
  closeSearch: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  header: { flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' },
  headerItem: { paddingHorizontal: 22, paddingVertical: 10 },
  badgeIcon: { position: 'absolute', backgroundColor: 'red', borderRadius: 50, paddingHorizontal: 5, right: 0 },
  wrapRightHeader: { flexDirection: 'row', marginRight: 18, padding: 3, paddingHorizontal: 6 },
})
