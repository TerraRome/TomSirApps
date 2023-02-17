import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  TextInput as PureTextInput,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { convertToRupiah } from '@utils/convertRupiah'
import { theme } from '@utils/theme'
import moment from 'moment'
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
import TextInput from '@components/TextInput'
import { showErrorToast, showSuccessToast } from '@components/Toast'
import WrapFooterButton from '@components/WrapFooterButton'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { addProduct, getProducts } from '@services/products'
import { getRegistrationList } from '@services/registration'
import { getTypeOrders } from '@services/typeorder'
import { getCategory } from '@store/actions/category'
import { getMerchantById } from '@store/actions/merchant'
import { setProducts } from '@store/actions/products'
import { setTypeOrder } from '@store/actions/typeorder'
import { convertToAngka, moneyFormat } from '@utils/convertRupiah'
import { SafeAreaView } from 'react-native-safe-area-context'
import { changeCartItem } from 'store/actions/carts'
import calculateCart from 'utils/calculateCart'
import Card from './product-card'

let searchDebounce: any = null
export default function Home() {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const navigation = useNavigation()
  const modalFilterRef: any = useRef()
  const modalFilterCategoryRef: any = useRef()
  const { user } = useSelector((state: any) => state.auth)
  const carts = useSelector((state: any) => state.carts.data)
  const order = useSelector((state: any) => state.order.rows)
  const category = useSelector((state: any) => state.category.rows)
  const { rows, page_size, current_page } = useSelector((state: any) => state.products)

  const LIST_CATEGORY = [{ id: undefined, name: 'Semua Produk', icon: '🏳️' }, ...category]

  const [isLoading, setLoading] = useState(false)

  const [product, setProduct] = useState<any>({
    name: '',
    sell_type: false,
    modal: 0,
    stock: 1,
    price: '',
    category_id: '',
    categoryName: '',
  })

  const [state, setState] = useState({
    qty: 1,
    note: '',
    addons: [],
  })

  const [queryParams, setParams] = useState({
    page: 1,
    limit: 100,
    sortBy: 'name',
    order: 'ASC',
    merchant_id: user.merchant.id,
    category_id: undefined,
    search: undefined,
  })

  const [queryParam, setParam] = useState({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    order: 'ASC',
    merchant_id: user.merchant.id,
    search: undefined,
  })

  const [queryRegis, setRegis] = useState({
    tanggal: moment().format('YYYY-MM-DD'),
  })

  const [isSearching, setIsSearching] = useState(false)
  const [showModalTransaction, setModalTransaction] = useState(false)
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
      } catch (error) {
        showErrorToast(error.message)
      } finally {
        setLoading(false)
      }
    },
    [queryParams],
  )

  const getTypeOrder = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        if (!queryParams?.search) {
          delete queryParams.search
        }
        const {
          data: { data },
        } = await getTypeOrders({ ...queryParam, ...params })
        dispatch(setTypeOrder(data))
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [queryParams.search],
  )

  const onChange = (type: string) => (value: any) => {
    setProduct({
      ...product,
      [type]: value,
    })
  }

  const getRegis = async () => {
    setLoading(true)
    try {
      const data = await getRegistrationList({ ...queryRegis })
      if (data.status == 220) {
        navigation.navigate('ManageModal')
      }
    } catch (error) {
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'ManageModal' }],
      // });
    } finally {
      setLoading(false)
    }
  }

  const handleHoldProduct = async () => {
    const { name, stock, modal, price, category_id } = product
    const formData: any = new FormData()
    formData.append('name', name)
    formData.append('stock', Number(stock))
    formData.append('modal', convertToAngka(modal))
    formData.append('price', convertToAngka(price))
    formData.append('category_id', category_id)

    setLoading(true)
    try {
      const result = await addProduct(formData)
      if (result.status === 200) {
        const product = result.data.data;
        onPressAddToCart(product);
        showSuccessToast('Data produk berhasil ditambah')
        setModalTransaction(false)
      }
    } catch (error: any) {
      console.log(error);

      showErrorToast(error.message)
    } finally {
      setProduct({ ...product, name: '', price: 0, category_id: '', categoryName: '' })
      setLoading(false)
    }
  }

  const onPressAddToCart = (product: any) => {
    Object.assign(product, state)
    dispatch(changeCartItem(product))
  }

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
    getTypeOrder({ page: 1 })
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
    getRegis()
    refreshData()
  }, [isFocused])

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
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.wrapRightHeader]}
            onPress={() => {
              navigation.navigate('ScanBarcode')
            }}>
            <FontAwesome5 name="expand" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wrapRightHeader]}
            onPress={() => {
              setModalTransaction(true)
            }}>
            <FontAwesome5 name="plus" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
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
        renderItem={props => <Card {...props} key={props.id} numColumns={3} carts={carts} />}
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
      <Modal visible={showModalTransaction} animationType="slide" transparent statusBarTranslucent>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.blackSemiTransparent,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(90),
              margin: 18,
              backgroundColor: 'white',
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 10,
              borderRadius: 10,
            }}>
            <Text style={styles.inputTitle}>Nama Produk</Text>
            <TextInput
              value={product.name}
              placeholder="Masukkan nama produk"
              onChangeText={onChange('name')}
              type="default"
            />
            <Text style={styles.inputTitle}>Harga Jual</Text>
            <TextInput
              value={moneyFormat(product.price)}
              placeholder="Masukan harga produk"
              onChangeText={onChange('price')}
              type="default"
              isNumber
            />
            <Text style={styles.inputTitle}>Kategori Produk</Text>
            <TouchableOpacity onPress={() => modalFilterCategoryRef?.current?.open()} style={styles.category}>
              {product.categoryName ? (
                <Text>{product.categoryName}</Text>
              ) : (
                <Text style={styles.placeholder}>Pilih kategori produk</Text>
              )}
              <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginBottom: 15, justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.buttonQty}
                onPress={() => {
                  if (state?.qty === 0) {
                    return
                  }
                  setState({ ...state, qty: parseInt(state.qty) - 1 })
                }}>
                <Entypo color={theme.colors.primary} name="minus" size={28} />
              </TouchableOpacity>
              <View style={{ width: 60, justifyContent: 'center', alignItems: 'center' }}>
                <PureTextInput
                  value={state?.qty}
                  placeholder={state?.qty?.toString() || '0'}
                  placeholderTextColor={theme.colors.black}
                  selectionColor={theme.colors.primary}
                  style={styles.inputQty}
                  keyboardType="numeric"
                  onChangeText={text => {
                    let newText = text ? parseInt(text.replace(/[^0-9]/g, ''), 0).toString() : ''
                    setState({ ...state, qty: newText })
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setState({ ...state, qty: parseInt(state.qty) + 1 })
                }}
                style={styles.buttonQty}>
                <Entypo color={theme.colors.primary} name="plus" size={28} />
              </TouchableOpacity>
            </View>
            <View style={styles.rowBetween}>
              <Button
                style={{ flex: 1, marginRight: 8, paddingHorizontal: 0, alignItems: 'center' }}
                mode="outlined"
                onPress={() => {
                  setModalTransaction(false)
                  setProduct({ ...product, name: '', price: 0, category_id: '', categoryName: '' })
                }}>
                <Text type="bold" color={theme.colors.primary}>
                  Batal
                </Text>
              </Button>
              <Button
                loading={!product.name || !product.price || !product.category_id}
                style={{ flex: 1, paddingHorizontal: 0, alignItems: 'center' }}
                onPress={handleHoldProduct}>
                <Text type="bold" color="white">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modalize ref={modalFilterCategoryRef}>
        <FlatList
          data={category}
          style={{ padding: 16 }}
          keyExtractor={item => item.name + item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.name + item.id}
              style={styles.filterItem}
              onPress={async () => {
                setProduct({ ...product, category_id: item.id, categoryName: item.name })
                modalFilterCategoryRef?.current?.close()
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
  inputTitle: {
    color: 'grey',
    fontSize: 14,
    paddingLeft: 5,
  },
  searchBar: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    // paddingHorizontal: 16,
    alignItems: 'center',
    // paddingVertical: 3,
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
    top: 25,
  },

  buttonQty: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F2F2F2',
    borderRadius: 8,
  },
  inputQty: {
    width: 60,
    fontFamily: 'Jost-Bold',
    color: theme.colors.black,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  placeholder: {
    color: theme.colors.grey,
    fontSize: 12,
    paddingLeft: 8,
  },
  category: {
    width: '100%',
    borderColor: theme.colors.defaultBorderColor,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'space-between' },
  headerItem: { paddingHorizontal: 22, paddingVertical: 10 },
  badgeIcon: { position: 'absolute', backgroundColor: 'red', borderRadius: 50, paddingHorizontal: 5, right: 0 },
  wrapRightHeader: { flexDirection: 'row', marginRight: 18, padding: 3, paddingHorizontal: 6 },
})
