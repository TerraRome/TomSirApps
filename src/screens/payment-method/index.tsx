import React, {useState} from 'react'
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native'
import Text from '@components/Text'
import Button from '@components/Button'
import WrapFooterButton from '@components/WrapFooterButton'
import {useDispatch} from 'react-redux'
import {theme} from '@utils/theme'
import {RFValue as fs} from 'react-native-responsive-fontsize'
import {convertToRupiah} from 'utils/convertRupiah'
import {useNavigation, useRoute} from '@react-navigation/native'
import {IResOrder, Order, order, OrderPay, payOrder} from 'services/order'
import {showErrorToast} from 'components/Toast'
import Loader from 'components/Loader'
import {setCarts} from 'store/actions/carts'
import FakeCurrencyInput from './fake-currency-input'

const {width} = Dimensions.get('window')

export default function PaymentMethod() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const {carts, typeOrder, tax, noteDineIn, subTotalPlusTax, total, orderId} = route?.params?.item
  const [totalPay, setTotalPay] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (total_pay: string) => {
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
    setLoading(true)
    try {
      const {
        data: {data},
      }: any = orderId ? await payOrder(payParam) : await order(param)
      navigation.navigate('PaymentSuccess', {item: data})
      dispatch(setCarts([]))
    } catch (error) {
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
