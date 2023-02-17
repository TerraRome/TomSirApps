import Button from '@components/Button'
import Text from '@components/Text'
import WrapFooterButton from '@components/WrapFooterButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { theme } from '@utils/theme'
import Loader from 'components/Loader'
import { showErrorToast } from 'components/Toast'
import React, { useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { RFValue as fs } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { Customer, addCustomer } from 'services/customer'
import { Order, OrderPay, order, payOrder } from 'services/order'
import { setCarts } from 'store/actions/carts'
import { convertToRupiah } from 'utils/convertRupiah'
import FakeCurrencyInput from './fake-currency-input'

const { width } = Dimensions.get('window')

export default function PaymentMethod() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const merchant = useSelector((state: any) => state.auth?.user?.merchant)
  const { carts, typeOrder, priceOrder, tax, noteDineIn, subTotalPlusTax, total, orderId, phone_number } = route?.params?.item
  const [totalPay, setTotalPay] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [resMidtrans, setResMidtrans] = useState('')

  const handleSubmit = async (total_pay: string) => {
    // console.log(carts);

    const payParam: OrderPay = {
      id: orderId,
      tax_order_percentage: parseFloat(tax || '0'),
      total_tax: parseFloat(subTotalPlusTax),
      total_price: parseFloat(total),
      payment_type: 'cash',
      total_pay: parseFloat(total_pay),
      payment_return: parseFloat(total_pay) - parseFloat(total),
    }
    const param: Order = {
      type_order: typeOrder,
      note_order: noteDineIn,
      whatsapp: phone_number,
      products: carts.map((e: any) => ({
        id: e.id,
        qty: e.qty,
        price: parseFloat(e.price + priceOrder),
        note: e.note,
        addons: e?.addons?.length > 0 ? e.addons.map((a: any) => a.id) : [],
      })),
      status: 'paid',
      ...payParam,
      id: undefined,
    }

    const customerParam: Customer = {
      merchant_id: merchant.id,
      name: noteDineIn,
      // email: 'kosong',
      phone_number: phone_number,
    }
    // console.log(param)
    setLoading(true)
    try {
      await addCustomer(customerParam)
      const {
        data: { data },
      }: any = orderId ? await payOrder(payParam) : await order(param)
      dispatch(setCarts([]))
      navigation.navigate('PaymentSuccess', { item: data, priceOrder: priceOrder })
    } catch (error: any) {
      showErrorToast(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text>Total Tagihan</Text>
        <Text type="bold" size={14}>
          Rp {convertToRupiah(total)}
        </Text>
        <Button
          onPress={() => {
            handleSubmit(total)
          }}
          mode="outlined">
          <Text type="semibold">UANG PAS</Text>
        </Button>
        <Text>Uang Diterima</Text>
        <FakeCurrencyInput
          value={totalPay}
          onChangeText={value => {
            setTotalPay(value)
          }}
        />
        <View>
          <Text>{ }</Text>
        </View>
      </ScrollView>
      <WrapFooterButton>
        <Button
          loading={Boolean(parseFloat(totalPay || '0') < parseFloat(total))}
          onPress={() => {
            handleSubmit(totalPay)
          }}>
          <Text type="bold" color="white">
            Lanjut
          </Text>
        </Button>
      </WrapFooterButton>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Jost-Bold',
    fontSize: fs(14, width),
    paddingVertical: 0,
  },
})
