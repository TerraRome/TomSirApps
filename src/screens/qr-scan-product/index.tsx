import CustomButton from '@components/Button'
import { showErrorToast } from 'components/Toast'
import React, { useState } from 'react'
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
//import TextInput from '@components/TextInput'
import Text from '@components/Text'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getBarcodeProduct } from '@services/products'
import { theme } from '@utils/theme'
import { useBackButton } from 'hooks'
import BarcodeMask from 'react-native-barcode-mask'
import { RNCamera } from 'react-native-camera'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//@ts-ignore
import { useDispatch, useSelector } from 'react-redux'

let searchDebounce: any = null
export default function QrScan() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const route: any = useRoute()
  const { user } = useSelector((state: any) => state.auth)
  const carts = useSelector((state: any) => state.carts.data)
  const insets = useSafeAreaInsets()
  const [item, setItem] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [isReady, setReady] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // const getData = useCallback(
  //   async () => {
  //     try {
  //       if(barcode == ''){
  //         const {
  //           data: { data },
  //         } = await getBarcodeProduct(barcode)
  //         setItem(data.rows[0]);
  //         console.log(data)
  //       }
  //     } catch (error) {
  //       showErrorToast(error.message)
  //     } finally {
  //       console.log(barcode)
  //     }
  //   },
  //   [barcode],
  // )

  const handleBack = () => {
    navigation.navigate('ListProduct')
    return true
  }

  // const refreshData = (param?: any) => {
  //   getData({ page: 1, ...param })
  // }

  // const handleSearch = (search: any) => {
  //   setReady(!isReady)
  //   clearTimeout(searchDebounce)
  //   searchDebounce = setTimeout(() => {
  //     refreshData({ search })
  //   }, 400)
  //   set({ ...queryParams, search })
  // }

  const navgate = () => {
    const cart = carts?.length > 0 && carts?.find((e: any) => e.id === item.id)
    navigation.navigate('DetailProduct', { item, cart })
  }

  const onRead = async (e: any) => {
    if (isReady) {
      setBarcode(e.data);
      try {
        const {
          data: { data },
        } = await getBarcodeProduct({ barcode: e.data })
        if (data.stock <= 0) {
          Alert.alert(
            'Stok Produk Sudah Habis?',
            'Silahkan Pilih Produk lain.',
            [
              {
                text: 'Ok',
              },
            ],
            {
              cancelable: true,
            },
          )
        } else {
          setItem(data);
        }
      } catch (error) {
        showErrorToast(error.message);
        Alert.alert(
          'Produk tidak ada?',
          'Silahkan Scan ulang.',
          [
            {
              text: 'Ok',
            },
          ],
          {
            cancelable: true,
          },
        )
      } finally {
        // console.log(e.data)
        setReady(false);
      }
    }
  }

  // useEffect(() => {
  //   //getData();
  // }, [barcode])

  useBackButton(handleBack)

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        onBarCodeRead={onRead}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <BarcodeMask
          width={300}
          height={150}
        />
      </RNCamera>
      <View style={{ backgroundColor: 'white', padding: 10 }}>
        <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
          <TextInput
            value={barcode}
            editable={false}
            placeholder="Barcode Produk"
            //onChangeText={getData}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.closeSearch}
            onPress={() => {
              setBarcode('');
              setItem(null);
              setReady(true);
            }}>
            <AntDesign name="closecircle" color="darkgrey" size={18} />
          </TouchableOpacity>
        </View>
        <CustomButton mode="default" onPress={navgate} loading={!item}>
          <Text style={styles.buttonText}>LANJUT</Text>
        </CustomButton>
        {/* <Button onPress={navgate}>
          <Text>Get Item</Text>
        </Button> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  hideButton: { position: 'absolute', right: 18, top: 14 },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  searchBar: {
    borderColor: theme.colors.defaultBorderColor,
    backgroundColor: theme.colors.white,
    fontFamily: 'Jost-Regular',
    color: theme.colors.black,
    paddingHorizontal: 10,
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