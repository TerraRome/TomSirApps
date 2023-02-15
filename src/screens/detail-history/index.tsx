import React, { useEffect, useRef, useState } from 'react'
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { theme } from '@utils/theme'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '@components/Loader'
import Text from '@components/Text'
import AntDesign from 'react-native-vector-icons/AntDesign'
//@ts-ignore
import { showErrorToast } from '@components/Toast'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { getReportById } from '@services/report'
import calculateCart from '@utils/calculateCart'
import { convertToRupiah } from '@utils/convertRupiah'
import { printBill } from '@utils/print-bill'
import moment from 'moment'
import { useLayoutEffect } from 'react'
//@ts-ignore
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer'
import { Modalize } from 'react-native-modalize'
import { setPrinter } from 'store/actions/apps'
import { fetchBase64 } from 'utils/fetch-blob'
import { whatsappBill } from 'utils/whatsapp-bill'

export default function DetailHistory() {
  const navigation = useNavigation()
  const route: any = useRoute()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const modalSelectPrinter: any = useRef()
  const modalFilterRef: any = useRef()
  const [item, setItem] = useState(route?.params?.item)
  const [isLoading, setLoading] = useState(false)
  const [listPrinter, setListPrinter] = useState([])
  const printer = useSelector((state: any) => state.apps.printer)
  const merchant = useSelector((state: any) => state.auth?.user?.merchant)

  let carts =
    item?.transaction_product?.map((e: any) => ({
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

  const calculate = calculateCart(carts)
  const subTotalMinusDiscount = calculate.subtotal - calculate.discount
  const subTotalPlusTax = subTotalMinusDiscount + item.total_tax
  const total = subTotalMinusDiscount + subTotalPlusTax

  const getOrder = async () => {
    setLoading(true)
    try {
      const {
        data: { data },
      } = await getReportById(item.id)
      setItem(data)
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  const print = async (prnter: any) => {
    try {
      const listString = await BluetoothManager.enableBluetooth()
      const data = listString.map((e: any) => JSON.parse(e))
      setListPrinter(data)

      if (!prnter) {
        modalSelectPrinter?.current?.open()
        return
      }
      setLoading(true)
      await BluetoothManager.connect(prnter.address)
      item.logo = merchant?.image ? await fetchBase64(merchant.image) : undefined
      await printBill({ ...item, merchant })
    } catch (error: any) {
      showErrorToast(error?.message || 'Failed, please connect or turn on printer')
      dispatch(setPrinter(null))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrder()
  }, [isFocused])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: item.code,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              whatsappBill(item)
            }}
            style={{ marginRight: 18, flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="sharealt" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => print(printer)}
            style={{ marginRight: 18, flexDirection: 'row', alignItems: 'center' }}>
            <AntDesign name="printer" size={18} />
            <Text type="semibold" size={8} style={{ marginLeft: 4 }}>
              Cetak
            </Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation, item])

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <ScrollView style={{ padding: 16 }}>
        <View style={styles.wrapTitle}>
          <Text type="bold" size={10}>
            Detail
          </Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Tanggal</Text>
            <Text type="semibold">{moment(item?.createdAt).format('DD MMM YYYY HH:mm') || ' - '}</Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Catatan</Text>
            <Text type="semibold">{item?.note || ' - '}</Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Tipe Order</Text>
            <Text type="semibold">{item?.type === 'dine_in' ? 'Dine In' : 'Take Away'}</Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Metode Pembayaran</Text>
            <Text type="semibold">{item?.payment_type || ' - '}</Text>
          </View>
        </View>
        <View style={styles.wrapTitle}>
          <Text type="bold" size={10}>
            Pesanan
          </Text>
        </View>
        {carts.map((e: any) => {
          const totalPriceAddons = e.addons.reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0)
          const totalRealPriceItem = parseFloat(e.price + totalPriceAddons) * e?.qty
          const nominalDiscount = e?.is_disc_percentage ? (parseFloat(e?.price) * e?.disc) / 100 : parseFloat(e?.disc)
          const discountPrice = totalRealPriceItem - nominalDiscount * e?.qty
          return (
            <View key={e?.cartId || e.id} style={styles.item}>
              <View style={[styles.rowBetween, { flex: 1 }]}>
                <View style={{ flex: 0.8 }}>
                  <Text type="semibold" size={9}>
                    x{e.qty} {e.name}
                  </Text>
                  {e?.addons.length > 0 && e.addons.map((menu: any) => <Text size={7}>{menu.name}</Text>)}
                  {e?.note ? (
                    <Text size={7} color="grey">
                      {e.note}
                    </Text>
                  ) : null}
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
            </View>
          )
        })}
        <View>
          {calculate.discount > 0 && (
            <View style={styles.wrapTotal}>
              <Text>Diskon</Text>
              <Text>{convertToRupiah(calculate.discount)}</Text>
            </View>
          )}
          <View style={styles.wrapTotal}>
            <Text>Subtotal</Text>
            <Text>{convertToRupiah(subTotalMinusDiscount)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Pajak</Text>
            <View style={styles.rowBetween}>
              <Text>{convertToRupiah(item.total_tax)}</Text>
            </View>
          </View>
          <View style={styles.rowBetween}>
            <Text>Total</Text>
            <Text>{convertToRupiah(item.total_price)}</Text>
          </View>
          <DashSeparator />
          <View style={[styles.wrapTotal]}>
            <Text type="semibold">Uang Bayar</Text>
            <Text type="semibold">{convertToRupiah(item.total_pay)}</Text>
          </View>
          {item?.payment_return > 0 && (
            <View style={[styles.wrapTotal]}>
              <Text type="semibold">Kembalian</Text>
              <Text type="semibold">{convertToRupiah(item.payment_return)}</Text>
            </View>
          )}
        </View>
        <DashSeparator />
        <View style={{ marginVertical: 16 }}>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Total Modal</Text>
            <Text type="semibold">{convertToRupiah(item?.total_capital || '0')}</Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Total Laba</Text>
            <Text type="semibold">{convertToRupiah(item?.profit || '0')}</Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 3 }]}>
            <Text>Total Quantity</Text>
            <Text type="semibold">{item?.total_qty || ' - '}</Text>
          </View>
        </View>
      </ScrollView>
      {/* <WrapFooterButton>
        <Button mode="outlined" onPress={() => print(printer)}>
          <Text type="bold" color={theme.colors.primary}>
            CETAK STRUK
          </Text>
        </Button>
      </WrapFooterButton> */}
      <Modalize adjustToContentHeight rootStyle={{ elevation: 99 }} ref={modalSelectPrinter}>
        <View style={{ padding: 16 }}>
          <Text type="semibold" size={10}>
            Pilih Printer
          </Text>
          <FlatList
            data={listPrinter}
            keyExtractor={(item: any) => item.address}
            renderItem={({ item: p }: any) => (
              <TouchableOpacity
                key={p.address}
                activeOpacity={0.5}
                style={styles.filterItem}
                onPress={async () => {
                  modalSelectPrinter?.current?.close()
                  await dispatch(setPrinter(p))
                  print(p)
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
  wrapTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  filterItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
})
