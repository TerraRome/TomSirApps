import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Alert, FlatList, Image, Modal,
  TextInput as PureTextInput,
  ScrollView, StyleSheet,
  TouchableOpacity, View
} from 'react-native'

import { theme } from '@utils/theme'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'


import Button from '@components/Button'
import Loader from '@components/Loader'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import WrapFooterButton from '@components/WrapFooterButton'
//@ts-ignore
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { showErrorToast } from 'components/Toast'
import { Order, deleteOrder, getOrderById, order, updateOrder } from 'services/order'
import { setCarts } from 'store/actions/carts'
import calculateCart from 'utils/calculateCart'
import { convertToRupiah } from 'utils/convertRupiah'


import { printBill } from '@utils/print-bill'
import { printCheff } from '@utils/print-cheff'

import Modalize from '@components/Modalize'
//@ts-ignore
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer'
import { setPrinter } from 'store/actions/apps'
import { fetchBase64 } from 'utils/fetch-blob'

const PAYMENT_TYPE = [
  { label: 'Debit', icon: 'money-check', id: 1 },
  { label: 'Cash', icon: 'money-bill-wave', id: 2 },
  { label: 'E-Wallet', icon: 'wallet', id: 3 },
]

const TYPE_ORDER = [
  { label: 'Dine In', id: 'dine_in' },
  { label: 'Take away', id: 'take_away' },
]

export default function CheckOut() {
  const navigation = useNavigation()
  const route: any = useRoute()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const modalSelectPrinter: any = useRef()
  const modalSelectTypePrint: any = useRef()
  const modalFilterRef: any = useRef()

  const [item, setItem] = useState(route?.params?.item)
  const [isLoading, setLoading] = useState(false)
  const [typeOrder, setTypeOrder] = useState(item?.type || '')
  const [priceOrder, setPriceOrder] = useState(0)
  const [tax, setTax] = useState(item?.tax_percentage || '')
  const [noteDineIn, setNoteDineIn] = useState(item?.note || '')
  const [phone_number, setPhone_number] = useState(item?.whatsapp || '')
  const [showModalSave, setModalSave] = useState(false)
  const [listPrinter, setListPrinter] = useState([])
  const [typePrint, setTypePrint] = useState<'bill' | 'cheff'>('bill')

  const printer = useSelector((state: any) => state.apps.printer)
  const merchant = useSelector((state: any) => state.auth?.user?.merchant)
  const cartsState = useSelector((state: any) => state.carts.data)
  const typeOrderState = useSelector((state: any) => state.typeOrder.rows)


  const orderId = cartsState.find((e: any) => !!e.orderId)?.orderId || item?.id
  const isPendingOrder = Boolean(orderId)
  const isPendingOrderChange = Boolean(cartsState?.length > 0 && isPendingOrder)

  let carts =
    isPendingOrder && !isPendingOrderChange
      ? item?.transaction_product?.map((e: any) => ({
        orderId,
        cartId: e?.id,
        id: e.product_id,
        qty: e.qty,
        note: e.note,
        transaction_product_id: e?.id,
        addons: e?.addons || [],
        name: e.product.name,
        description: e.product.description,
        addon_category: e.product.addon_category,
        ingredient: e.product.ingredient,
        product: e.product,
        image: e.product.image,
        price: e.product.price,
        disc: e.product.disc,
        is_disc_percentage: e.product.is_disc_percentage,
      })) || []
      : cartsState || []

  // console.log(cartsState, 'cartsState')

  const calculate = calculateCart(carts)
  const subTotalMinusDiscount = calculate.subtotal - calculate.discount + priceOrder
  const subTotalPlusTax = (subTotalMinusDiscount * parseFloat(tax || '0')) / 100
  const total = subTotalMinusDiscount + subTotalPlusTax

  const parsePayload = (): Order => {
    return {
      id: orderId,
      type_order: typeOrder,
      note_order: noteDineIn,
      whatsapp: phone_number,
      products: carts.map((e: any) => ({
        id: e.id,
        qty: e.qty,
        price: parseFloat(e.price + priceOrder),
        note: e.note,
        addons: e?.addons?.length > 0 ? e.addons.map((a: any) => a.id) : [],
        transaction_product_id: e?.transaction_product_id,
      })),
      tax_order_percentage: parseFloat(tax || '0'),
      total_tax: subTotalPlusTax,
      total_price: total,
      payment_type: 'cash',
      total_pay: 0,
      payment_return: 0,
      status: 'hold',
    }
  }

  const handleHoldOrder = async () => {
    const param: Order = parsePayload()
    setLoading(true)
    try {
      await order(param)
      await dispatch(setCarts([]))
      setModalSave(false)
      //@ts-ignore
      navigation.replace('OrderList')
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrder = async () => {
    const param: Order = parsePayload()
    setLoading(true)
    try {
      await updateOrder(param)
      await getOrder()
      await dispatch(setCarts([]))
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getOrder = async () => {
    setLoading(true)
    try {
      const {
        data: { data },
      } = await getOrderById(orderId)
      setItem(data)
      setTypeOrder(data.type)
      setTax(data.tax_percentage)
      setNoteDineIn(data.note)
    } catch (error: any) {
      showErrorToast(error.message)
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const print = async (prnter: any, type: 'bill' | 'cheff') => {
    setLoading(true)
    try {
      const listString = await BluetoothManager.enableBluetooth()
      const data = listString.map((e: any) => JSON.parse(e))
      setListPrinter(data)
      if (!prnter) {
        modalSelectPrinter?.current?.open()
        return
      }
      await BluetoothManager.connect(prnter.address)
      if (type === 'bill') {
        item.logo = merchant?.image ? await fetchBase64(merchant.image) : undefined
        await printBill({ ...item, merchant })
      } else {
        await printCheff({ ...item, merchant })
      }
    } catch (error: any) {
      dispatch(setPrinter(null))
      showErrorToast(error?.message || 'Failed, please connect or turn on printer')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = () => {
    Alert.alert('Hapus Pesanan?', 'Pesanan akan hilang dan tidak bisa dikembalikan', [
      {
        text: 'Hapus',
        onPress: async () => {
          if (isPendingOrderChange || isPendingOrder) {
            try {
              const { status, data } = await deleteOrder(item.id)
              if (status === 200) {
                return navigation.goBack()
              }
              showErrorToast(data?.message)
            } catch (error: any) {
              showErrorToast(error.message)
            }
          } else {
            navigation.goBack()
            dispatch(setCarts([]))
          }
        },
      },
      {
        text: 'Batal',
      },
    ])
  }

  const handleChangeOrder = () => {
    if (isPendingOrder || isPendingOrderChange) {
      Alert.alert('Ubah Pesanan?', 'Pesanan akan masuk ke keranjang', [
        {
          text: 'Ubah',
          onPress: async () => {
            dispatch(setCarts(carts))
            navigation.navigate('ListProduct')
          },
        },
        {
          text: 'Batal',
        },
      ])
      return
    }
    navigation.navigate('ListProduct')
  }

  const handleSaveChange = () => {
    if (isPendingOrder) {
      if (isPendingOrderChange) {
        return handleUpdateOrder()
      }
      return handleHoldOrder()
    }
    handleHoldOrder()
  }

  useEffect(() => {
    if (isPendingOrder && isFocused) {
      getOrder()
      {
        typeOrderState.map((e: any) => {
          if (e.name == typeOrder) setPriceOrder(e.price)
        })
      }
    }
  }, [isFocused])

  useLayoutEffect(() => {
    if (isPendingOrder) {
      navigation.setOptions({
        headerTitle: isPendingOrder ? noteDineIn : 'Detail Pesanan',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => {
                modalSelectTypePrint?.current?.open()
              }}
              style={{ marginRight: 18, flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="printer" size={18} />
              <Text type="semibold" size={8} style={{ marginLeft: 4 }}>
                Cetak
              </Text>
            </TouchableOpacity>
          </View>
        ),
      })
    }
  }, [navigation, noteDineIn])

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <ScrollView style={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text type="semibold" size={10} style={{ marginBottom: 16 }}>
            Tipe Order
          </Text>
          {/* <View style={styles.wrapSelectTypeOrder}>
            {TYPE_ORDER.map((e: any) => (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setTypeOrder(e.id)
                }}
                // disabled={e.id === typeOrder || isPendingOrder}
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: e.id == typeOrder ? 'white' : 'rgba(148,152,159,0.1)',
                    borderColor: e.id == typeOrder ? theme.colors.primary : 'transparent',
                  },
                ]}>
                <Text color={e.id === typeOrder ? theme.colors.primary : theme.colors.grey}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View> */}
          <TouchableOpacity onPress={() => modalFilterRef?.current?.open()} style={styles.category}>
            {typeOrder ? (
              <Text>{typeOrder}</Text>
            ) : (
              <Text style={styles.placeholder}>Pilih Type Order</Text>
            )}
            <AntDesign name="right" size={20} color={theme.colors.blackSemiTransparent} />
          </TouchableOpacity>
          {/* { Text Pelanggan Dihapus } */}
          <View style={styles.wrapTitle}>
            <Text type="semibold" size={10}>
              Pelanggan
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <TextInput
              style={{ height: 45, width: "50%" }}
              placeholder="Nama Pelanggan"
              value={noteDineIn}
              onChangeText={val => setNoteDineIn(val)}
            />
            <TextInput
              isNumber={true}
              style={{ height: 45, width: "45%", fontSize: 10 }}
              placeholder="Nomor Whatsapp"
              value={phone_number}
              onChangeText={val => setPhone_number(val)}
            />
          </View>
        </View>
        <View style={styles.wrapTitle}>
          <Text type="semibold" size={10}>
            Tagihan
          </Text>
          {!isPendingOrderChange && (
            <TouchableOpacity onPress={handleChangeOrder}>
              <Text type="semibold" size={7} color="#31AAC3">
                {isPendingOrder ? 'Ubah' : 'Tambah'} pesanan
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {carts.map((e: any) => {
          const totalPriceAddons = e.addons.reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0)
          const totalRealPriceItem = (parseFloat(e.price + totalPriceAddons) * e?.qty) + priceOrder
          const nominalDiscount = e?.is_disc_percentage ? (parseFloat(e?.price) * e?.disc) / 100 : parseFloat(e?.disc)
          const discountPrice = totalRealPriceItem - nominalDiscount * e?.qty
          const disabled = Boolean(!isPendingOrderChange && isPendingOrder)
          return (
            <TouchableOpacity
              key={e?.cartId || e.id}
              activeOpacity={1}
              disabled={disabled}
              onPress={() => navigation.navigate('DetailProduct', { item: e, cart: e })}
              style={styles.item}>
              <Image source={{ uri: e.image }} style={styles.itemImage} />
              <View style={[styles.rowBetween, { flex: 1 }]}>
                <View style={{ flex: 0.8 }}>
                  <Text type="semibold" size={9}>
                    {e.name}
                  </Text>
                  <Text>
                    x <Text type="semibold">{e.qty}</Text>
                  </Text>
                  {e?.addons.length > 0 && e.addons.map((menu: any) => <Text size={7}>{menu.name}</Text>)}
                  {e?.note ? (
                    <Text size={7} color="grey">
                      {e.note}
                    </Text>
                  ) : null}
                  {!disabled && (
                    <Text size={7} type="semibold" color="#31AAC3">
                      Edit
                    </Text>
                  )}
                </View>
                <View>
                  <Text>{convertToRupiah(discountPrice)}</Text>
                  {nominalDiscount > 0 && (
                    <Text color="grey" style={{ textDecorationLine: 'line-through' }}>
                      {convertToRupiah(totalRealPriceItem)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
        <View>
          <View style={styles.wrapTotal}>
            <Text>Subtotal</Text>
            <Text>{convertToRupiah(subTotalMinusDiscount)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Pajak</Text>
            <View style={{ flexDirection: 'row' }}>
              <PureTextInput
                style={styles.taxInput}
                placeholder="0"
                keyboardType="numeric"
                maxLength={3}
                value={tax.toString()}

                onChangeText={text => {
                  let newText = text ? parseInt(text.replace(/[^0-9]/g, ''), 0).toString() : ''
                  setTax(newText)
                }}
              />
              <Text>% ({convertToRupiah(subTotalPlusTax)})</Text>
            </View>
          </View>
          <DashSeparator />
          <View style={styles.wrapTotal}>
            <Text>Total</Text>
            <Text>{convertToRupiah(total)}</Text>
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text type="semibold" size={10}>
            Cara Bayar
          </Text>
          <View style={styles.wrapSelectPayment}>
            {PAYMENT_TYPE.map((e: any) => (
              <TouchableOpacity
                activeOpacity={0.5}
                disabled={e.id === 1 || e.id === 3}
                style={[
                  styles.selectButton,
                  {
                    backgroundColor: e.id == 2 ? 'white' : 'rgba(148,152,159,0.1)',
                    borderColor: e.id == 2 ? theme.colors.primary : 'transparent',
                  },
                ]}>
                <FontAwesome5 name={e.icon} size={18} color={e.id === 2 ? theme.colors.primary : theme.colors.grey} />
                <Text style={{ marginTop: 4 }} color={e.id === 2 ? theme.colors.primary : theme.colors.grey}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 50, marginTop: 30 }}>
          <TouchableOpacity onPress={handleDeleteOrder}>
            <Text color="#EF6454">Hapus Pesanan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <WrapFooterButton>
        <View style={styles.rowBetween}>
          <Text size={8}>Total Harga</Text>
          <Text type="semibold" size={8}>
            {convertToRupiah(total)}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          {!isPendingOrder || isPendingOrderChange ? (
            <Button
              loading={noteDineIn == '' || phone_number == '' || typeOrder == '' || isLoading}
              style={{ flex: 1, marginRight: 18, paddingHorizontal: 0, alignItems: 'center' }}
              mode="outlined"
              onPress={handleSaveChange}>
              <Text type="bold" color={noteDineIn == '' || phone_number == '' || typeOrder == '' ? theme.colors.disabled : theme.colors.primary}>
                Simpan Pesanan
              </Text>
            </Button>
          ) : null}
          <Button
            loading={noteDineIn == '' || phone_number == '' || typeOrder == '' || isLoading}
            style={{ flex: 1, paddingHorizontal: 0, alignItems: 'center' }}
            onPress={async () => {
              if (isPendingOrderChange) {
                await handleUpdateOrder()
              }
              navigation.navigate('PaymentMethod', {
                item: {
                  carts,
                  typeOrder,
                  priceOrder,
                  tax,
                  noteDineIn,
                  subTotalMinusDiscount,
                  subTotalPlusTax,
                  total,
                  orderId,
                  phone_number
                },
              })
            }}>
            <Text type="bold" color="white">
              Bayar
            </Text>
          </Button>
        </View>
      </WrapFooterButton>
      <Modalize ref={modalFilterRef}>
        <View style={styles.modalContentWrapper}>
          {typeOrderState.map((e: any) => (
            e.status == 1 ? <TouchableOpacity
              key={e.id}
              style={styles.modalContent}
              onPress={() => {
                setTypeOrder(e.name)
                setPriceOrder(e.price)
                modalFilterRef?.current?.close()
              }}>
              <Text type="semibold">{e.name}</Text>
            </TouchableOpacity>
              :
              null
          ))}
        </View>
      </Modalize>
      <Modal visible={showModalSave} animationType="slide" transparent statusBarTranslucent>
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
            <Text type="semibold" size={9}>
              Simpan Pesanan
            </Text>
            <TextInput
              value={noteDineIn}
              placeholder="Nama Orang / Nomor Meja"
              onChangeText={text => setNoteDineIn(text)}
            />
            <View style={styles.rowBetween}>
              <Button
                style={{ flex: 1, marginRight: 8, paddingHorizontal: 0, alignItems: 'center' }}
                mode="outlined"
                onPress={() => setModalSave(false)}>
                <Text type="bold" color={theme.colors.primary}>
                  Batal
                </Text>
              </Button>
              <Button
                loading={noteDineIn?.length <= 0 || isLoading}
                style={{ flex: 1, paddingHorizontal: 0, alignItems: 'center' }}
                onPress={handleHoldOrder}>
                <Text type="bold" color="white">
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modalize ref={modalSelectPrinter}>
        <View style={{ padding: 16 }}>
          <Text type="semibold" size={10}>
            Pilih Printer
          </Text>
          <FlatList
            data={listPrinter}
            keyExtractor={(item: any) => item.name + item.id}
            renderItem={({ item: p }: any) => (
              <TouchableOpacity
                key={p.address}
                activeOpacity={0.5}
                style={styles.filterItem}
                onPress={async () => {
                  await dispatch(setPrinter(p))
                  print(p, typePrint)
                }}>
                <Text size={8} type="semibold">
                  {p.name}
                </Text>
                <Text size={8} color="grey">
                  {p.address}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modalize>
      <Modalize ref={modalSelectTypePrint}>
        <View style={{ padding: 16 }}>
          <Text type="semibold" size={10}>
            Pilih
          </Text>
          <FlatList
            data={[
              {
                label: 'Dapur',
                value: 'cheff',
              },
              {
                label: 'Tagihan',
                value: 'bill',
              },
            ]}
            keyExtractor={(item: any) => item.value}
            renderItem={({ item: e }: any) => (
              <TouchableOpacity
                key={e.value}
                activeOpacity={0.5}
                style={styles.filterItem}
                onPress={async () => {
                  setTypePrint(e.value)
                  print(printer, e.value)
                  await modalSelectTypePrint?.current?.close()
                }}>
                <Text size={8} type="semibold">
                  {e.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modalize>
    </View>
  )
}
const DashSeparator = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(parseInt(wp(12).toString(), 0))
      .fill(0)
      .map((e: any, i: any) => (
        <Text color="grey" key={i}>
          -{' '}
        </Text>
      ))}
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
  placeholder: {
    color: theme.colors.grey,
    fontSize: 12,
    paddingLeft: 8,
  },
  emptyImage: { width: wp(60), height: wp(50), marginTop: 32, resizeMode: 'contain' },
  checkoutButton: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  taxInput: {
    paddingVertical: 0,
    marginTop: -3,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'Jost-Regular',
    borderColor: theme.colors.defaultBorderColor,
    marginRight: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: theme.colors.defaultBorderColor,
    borderBottomWidth: 1,
  },
  itemImage: { width: 70, height: 60, marginRight: 10, borderRadius: 10 },
  selectButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapSelectTypeOrder: { flexDirection: 'row', marginHorizontal: -8, marginBottom: 6 },
  wrapTotal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  wrapSelectPayment: { flexDirection: 'row', marginHorizontal: -8, marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  wrapTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  filterItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
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
  modalContent: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  modalContentWrapper: {
    padding: 16,
  },
})
