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
import { useDispatch } from 'react-redux'
import { Order, order, OrderPay, payOrder } from 'services/order'
import { setCarts } from 'store/actions/carts'
import { convertToRupiah } from 'utils/convertRupiah'
import FakeCurrencyInput from './fake-currency-input'

const { width } = Dimensions.get('window')

export default function PaymentMethod() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const { carts, typeOrder, tax, noteDineIn, subTotalPlusTax, total, orderId, phone_number } = route?.params?.item
  const [totalPay, setTotalPay] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [resMidtrans, setResMidtrans] = useState('')

  const handleSubmit = async (total_pay: string) => {
    console.log(route?.params?.item);

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
        price: parseFloat(e.price),
        note: e.note,
        addons: e?.addons?.length > 0 ? e.addons.map((a: any) => a.id) : [],
      })),
      status: 'paid',
      ...payParam,
      id: undefined,
    }
    // console.log(param)
    setLoading(true)
    try {
      const {
        data: { data },
      }: any = orderId ? await payOrder(payParam) : await order(param)
      navigation.navigate('PaymentSuccess', { item: data })
      dispatch(setCarts([]))
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
