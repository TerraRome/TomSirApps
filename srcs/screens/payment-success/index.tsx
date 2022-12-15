import Button from '@components/Button'
import Text from '@components/Text'
import { useNavigation, useRoute } from '@react-navigation/native'
import { printBill } from '@utils/print-bill'
import { printCheff } from '@utils/print-cheff'
import { theme } from '@utils/theme'
import { showErrorToast } from 'components/Toast'
import { useBackButton } from 'hooks'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { convertToRupiah } from 'utils/convertRupiah'

//@ts-ignore
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer'
import { Modalize } from 'react-native-modalize'
import { useDispatch, useSelector } from 'react-redux'
import { setPrinter } from 'store/actions/apps'
import { fetchBase64 } from 'utils/fetch-blob'

export default function PaymenSuccess() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const item = route?.params?.item
  const insets = useSafeAreaInsets()
  const mounted: any = useRef()
  const modalFilterRef: any = useRef()
  const printer = useSelector((state: any) => state.apps.printer)
  const merchant = useSelector((state: any) => state.auth?.user?.merchant)

  const [isLoading, setLoading] = useState(false)

  const handleBack = () => {
    navigation.navigate('ListProduct')
    return true
  }

  const [listPrinter, setListPrinter] = useState([])
  const [type, setType] = useState<'bill' | 'cheff'>('bill')

  const print = async (prnter: any, type: 'bill' | 'cheff') => {
    setLoading(true)
    try {
      const listString = await BluetoothManager.enableBluetooth()
      const data = listString.map((e: any) => JSON.parse(e))
      setListPrinter(data)
      // console.log(prnter);

      if (!prnter) {
        modalFilterRef?.current?.open()
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

  useEffect(() => {
    if (!mounted.current) {
      print(printer, 'bill')
      mounted.current = true
    }
  }, [])

  useBackButton(handleBack)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[{ marginTop: insets.top + 32 }]}>
        <View style={styles.contentContainer}>
          <Image
            source={require('@assets/images/success.png')}
            style={{ width: wp(32), height: wp(32), marginBottom: 32 }}
          />
          <Text type="bold" size={13}>
            Transaksi Sukses!
          </Text>
          {item?.payment_return > 0 && (
            <Text type="bold" size={13}>
              Kembalian Rp{convertToRupiah(item.payment_return)}
            </Text>
          )}
          <Text>Metode Pembayaran: {item?.payment_type}</Text>
        </View>
      </ScrollView>
      <View style={{ flexDirection: 'row' }}>
        <Button
          style={{ flex: 1 }}
          loading={isLoading}
          onPress={() => {
            setType('bill')
            print(printer, 'bill')
          }}
          mode="outlined">
          <Text type="semibold" size={7}>
            {isLoading ? 'MENCETAK...' : 'CETAK TAGIHAN'}
          </Text>
        </Button>
        <Button
          style={{ flex: 1, marginLeft: 8 }}
          loading={isLoading}
          onPress={() => {
            setType('bill')
            print(printer, 'cheff')
          }}
          mode="outlined">
          <Text type="semibold" size={7}>
            {isLoading ? 'MENCETAK...' : 'CETAK U. CHEFF'}
          </Text>
        </Button>
      </View>
      <Button
        onPress={() => {
          navigation.navigate('ListProduct')
        }}>
        <Text type="semibold" size={7} color="white">
          BUAT PESANAN BARU
        </Text>
      </Button>
      <Modalize ref={modalFilterRef} adjustToContentHeight rootStyle={{ elevation: 99 }}>
        <View style={{ padding: 16 }}>
          <Text type="semibold" size={10}>
            Pilih Printer
          </Text>
          <FlatList
            data={listPrinter}
            keyExtractor={(item: any) => item.name + item.id}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                key={item.address}
                activeOpacity={0.5}
                style={styles.filterItem}
                onPress={async () => {
                  await modalFilterRef?.current?.close()
                  await dispatch(setPrinter(item))
                  print(item, type)
                }}>
                <Text size={8} type="semibold">
                  {item.name}
                </Text>
                <Text size={8} color="grey">
                  {item.address}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modalize>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  filterItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
})
