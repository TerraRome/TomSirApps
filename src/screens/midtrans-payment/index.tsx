import Button from '@components/Button'
import Text from '@components/Text'
import WrapFooterButton from '@components/WrapFooterButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { theme } from '@utils/theme'
import axios from 'axios'
import Loader from 'components/Loader'
import { showErrorToast } from 'components/Toast'
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { RFValue as fs } from 'react-native-responsive-fontsize'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import { Order, order, OrderPay, payOrder } from 'services/order'
import { setCarts } from 'store/actions/carts'
import { convertToRupiah } from 'utils/convertRupiah'
// import base64 from 'react-native-base64'

const { width } = Dimensions.get('window')

export default function MidtransPayment() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const { user, merchant } = useSelector((state: any) => state.auth)
  const { carts, typeOrder, tax, noteDineIn, subTotalPlusTax, total, orderId, payment, customers } = route?.params?.item
  const [totalPay, setTotalPay] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState("")
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState("")

  let date = new Date().getDate();
  let month = new Date().getMonth();
  let now = Date.now()

  let parameter = {
    "transaction_details": {
      "order_id": `Order-` + noteDineIn + `-` + now,
      "gross_amount": total
    },
    "credit_card": {
      "secure": true
    },
    "customer_details": {
      "first_name": customers.name,
      // "email": customers.email,
      // "phone": customers.phone_number
    }
  };

  useEffect(() => {
    getToken()
    getNotif()
  }, [])

  const getToken = async () => {
    const data = await axios({
      method: 'post', //you can set what request you want to be
      url: `https://app.midtrans.com/snap/v1/transactions`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Authorization: 'Basic ' + base64.encode(merchant.server_key + ':')
      },
      data: parameter
    })
    setUrl(data.data.redirect_url);
  }

  const getNotif = async () => {
    const orderId = parameter.transaction_details.order_id
    const data = await axios({
      method: 'get', //you can set what request you want to be
      url: `https://api.midtrans.com/v2/${orderId}/status`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Authorization: 'Basic ' + base64.encode(merchant.server_key + ':')
      }
    })
    var txt = ""
    if (data.data.transaction_status == "settlement") {
      txt = "Paid"
    } else if (data.data.transaction_status == "pending") {
      txt = "Pending"
    } else {
      txt = "Unpaid"
    }
    setStatus(txt)
  }

  const handleSubmit = async (total_pay: string) => {
    const payParam: OrderPay = {
      id: orderId,
      tax_order_percentage: parseFloat(tax || '0'),
      total_tax: parseFloat(subTotalPlusTax),
      total_price: parseFloat(total),
      payment_type: 'Midtrans',
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
    // console.log(orderId)
    setLoading(true)
    try {
      const {
        data: { data },
      }: any = orderId ? await payOrder(payParam) : await order(param)
      navigation.navigate('PaymentSuccess', { item: data })
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Total Tagihan</Text>
            <Text type="bold" size={14}>
              Rp {convertToRupiah(total)}
            </Text>
          </View>
          <View style={styles.status1}>
            <Text size={11}>{status}</Text>
            <TouchableOpacity
              onPress={() => getNotif}>
              <FontAwesome name="refresh" size={20} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <WrapFooterButton>
        {status == "Unpaid" ?
          <Button
            onPress={() => navigation.navigate('WebviewMidtrans', { urlMidtrans: url })}>
            <Text type="bold" color="white">
              Bayar
            </Text>
          </Button>
          :
          <Button
            onPress={() => {
              handleSubmit(total)
            }}>
            <Text type="bold" color="white">
              Lanjut
            </Text>
          </Button>}
      </WrapFooterButton>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  status: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  status1: { width: width * 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  button: { justifyContent: 'space-between' },
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
