import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TextInput as PureTextInput,
  Alert,
} from 'react-native'

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { useSelector, useDispatch } from 'react-redux'
import { theme } from '@utils/theme'

import WrapFooterButton from '@components/WrapFooterButton'
import BackButton from '@components/BackButton'
import Button from '@components/Button'
import Text from '@components/Text'
import { useNavigation, useRoute } from '@react-navigation/native'
import { changeCartItem, removeCartItem } from 'store/actions/carts'
import TextInput from 'components/TextInput'
import { convertToAngka, convertToRupiah } from 'utils/convertRupiah'
import { getProduct } from 'services/products'
import { getPriceProduct } from '@services/price-product'
import { showErrorToast } from 'components/Toast'
import CheckBox from '@react-native-community/checkbox'
//@ts-ignore
import { RadioButtonInput } from 'react-native-simple-radio-button'

export default function DetailProduct() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route: any = useRoute()
  const item = route?.params?.item
  const cart = route?.params?.cart

  const [state, setState] = useState({
    qty: cart?.qty || 1,
    note: cart?.note || '',
    addons: cart?.addons || [],
  })
  const [priceProduct, setPrice] = useState({})
  const [product, setProduct] = useState(item)

  const totalPriceAddons = state.addons.reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0)

  const nominalDiscount = product?.is_disc_percentage
    ? (parseFloat(product?.price) * product?.disc) / 100
    : product?.disc

  const checkStock = product?.ingredient?.map((e: any) => {
    const outOfStock = e.stock < e.tbl_product_ingredient.qty * parseInt(state.qty)
    return outOfStock
  })

  const expiredIngredient = product?.ingredient?.map((e: any) => {
    const expired = e.exp_date ? new Date() > new Date(e.exp_date) : false
    return expired
  })

  const discountPrice = parseFloat(item.price) - nominalDiscount

  const total = (discountPrice + totalPriceAddons) * state?.qty

  const getData = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await getProduct(item.id)
      setProduct(data)
    } catch (error) {
      showErrorToast(error.message)
    } finally {
    }
  }, [])

  const handleSelectMenu = (isSelected: boolean, paramItem: any) => {
    let addons = state?.addons || []
    const maxLimit = parseInt(paramItem?.max_limit)
    if (maxLimit === 1) {
      addons = addons.filter((an: any) => an.addon_category_id !== paramItem.addon_category_id)
    }
    if (isSelected) {
      addons = addons.filter((menu: any) => menu?.id !== paramItem.id)
    } else {
      addons.push(paramItem)
    }
    setState({ ...state, addons })
  }

  useEffect(() => {
    getData()
    getPrice()
  }, [])

  const getPrice = async () => {
    try {
      const { data: { data } } = await getPriceProduct(item.price_product_id)
      setPrice({
        priceInfo: JSON.parse(data.price_info)
      })
    } catch (error) {
      setPrice({
        priceInfo: null
      })
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: product.name,
      headerTitleStyle: {
        fontFamily: 'Jost-SemiBold',
        fontSize: 20,
      },
    })
  }, [navigation])

  const showAlert = ({ title, subtitle }: { title: string; subtitle: string }) => {
    return Alert.alert(
      title,
      subtitle,
      [
        {
          text: 'Batal',
        },
        {
          text: 'Ya',
          onPress: () => {
            let data = cart || item
            Object.assign(data, state)
            dispatch(changeCartItem(data))
            navigation.reset({
              index: 0,
              routes: [{ name: 'DrawerNavigator' }],
            });
          },
        },
      ],
      {
        cancelable: true,
      },
    )
  }

  const onPressAddToCart = () => {
    const containExpired = expiredIngredient.includes(true)
    const containOutStock = checkStock.includes(true)

    if (containExpired) {
      showAlert({
        title: 'Sebagian stok bahan Kedaluwarsa!',
        subtitle: 'Apakah kamu yakin tetap menambahkan pesanan?',
      })
    } else if (containOutStock) {
      showAlert({
        title: 'Sebagian stok bahan habis!',
        subtitle: 'Apakah kamu yakin tetap menambahkan pesanan?',
      })
    } else {
      let data = cart || item
      Object.assign(data, state, priceProduct)
      dispatch(changeCartItem(data))
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigator' }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <BackButton goBack={navigation.goBack} />
      <ScrollView keyboardShouldPersistTaps="handled">
        {!item?.image ? (
          <View
            style={{
              height: 250,
              width: wp(100),
              backgroundColor: theme.colors.disabled,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}>
            <Ionicons name="ios-image-outline" size={50} color={theme.colors.grey} />
          </View>
        ) : (
          <Image source={{ uri: item?.image }} style={{ width: wp(100), height: 250 }} />
        )}
        <View style={{ padding: 16, backgroundColor: '#F2F3F4' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text type="semibold" style={{ flex: 0.9 }} size={10}>
              {product?.name}
            </Text>
            <Text type="semibold" size={10}>
              {convertToRupiah(discountPrice)}
            </Text>
          </View>
          {product?.disc > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text size={7}>
                Diskon {product?.is_disc_percentage ? `${product?.disc}%` : `Rp ${convertToRupiah(product?.disc)}`}
              </Text>
              <Text style={{ textDecorationLine: 'line-through' }} color="#A0A0A0" size={8}>
                {convertToRupiah(product?.price)}
              </Text>
            </View>
          )}
          <Text color="#A0A0A0">{product?.description}</Text>
        </View>
        <View style={{ padding: 16 }}>
          <View>
            {product?.addon_category?.map((e: any) => {
              const maxLimit = e?.max_limit
              return (
                <View>
                  <Text type="semibold" size={9}>
                    {e.name}
                  </Text>
                  <Text color="#A0A0A0" size={7}>
                    {e?.isRequired ? 'Wajib' : 'Tidak wajib'}, {maxLimit > 1 ? `Max ${maxLimit}` : `Pilih ${maxLimit}`}
                  </Text>
                  <View style={{ marginVertical: 8 }}>
                    {e.addon_menu.map((a: any, i: any) => {
                      const selected = !!state?.addons?.find((m: any) => m.id === a.id)
                      const disabled = Boolean(
                        !selected &&
                        parseInt(e?.max_limit) ===
                        state?.addons.filter((an: any) => an.addon_category_id === e.id)?.length,
                      )
                      a.max_limit = maxLimit
                      return (
                        <TouchableOpacity
                          activeOpacity={1}
                          disabled={maxLimit > 1 ? disabled : false}
                          onPress={() => {
                            handleSelectMenu(selected, a)
                          }}
                          style={styles.itemSelectVariant}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {maxLimit > 1 ? (
                              <CheckBox
                                disabled={disabled}
                                style={{ marginRight: 8 }}
                                tintColors={{ true: theme.colors.primary }}
                                onTintColor={theme.colors.grey2}
                                onFillColor={theme.colors.grey2}
                                onCheckColor={theme.colors.white}
                                animationDuration={0.2}
                                lineWidth={1.5}
                                boxType={'square'}
                                value={Boolean(selected)}
                                onValueChange={(selected: boolean) => {
                                  handleSelectMenu(!selected, a)
                                }}
                              />
                            ) : (
                              <RadioButtonInput
                                index={i}
                                obj={{ value: a }}
                                isSelected={selected}
                                onPress={() => {
                                  handleSelectMenu(selected, a)
                                }}
                                borderWidth={selected ? 2 : 1}
                                buttonInnerColor={theme.colors.primary}
                                buttonOuterColor={selected ? theme.colors.primary : theme.colors.grey2}
                                buttonSize={12}
                                buttonOuterSize={22}
                                buttonWrapStyle={{ marginHorizontal: 12, marginVertical: 4, marginLeft: 5 }}
                              />
                            )}
                            <Text
                              color={selected ? 'gray' : '#aeaeae'}
                              size={8}
                              type={selected ? 'semibold' : 'regular'}>
                              {a.name}
                            </Text>
                          </View>
                          <Text color={selected ? 'gray' : '#aeaeae'} size={8} type={selected ? 'semibold' : 'regular'}>
                            {parseFloat(a.price) > 0 ? `+${convertToRupiah(a.price)}` : ''}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </View>
          <Text type="semibold" size={9}>
            Catatan
          </Text>
          <Text color="#A0A0A0" size={7}>
            Tidak wajib
          </Text>
          <TextInput
            style={{ marginTop: 6 }}
            value={state?.note}
            placeholder="Mis. Gulanya jangan banyak2 yaa.."
            onChangeText={note => {
              setState({ ...state, note })
            }}
          />
          {!!product?.ingredient.length && (
            <Text type="semibold" size={9} style={{ paddingTop: 16, paddingBottom: 6 }}>
              Bahan Tersedia
            </Text>
          )}
          {product?.ingredient.map((e: any, i: number) => {
            const outOfStock = e.stock < e.tbl_product_ingredient.qty * parseInt(state.qty)
            const expired = e.exp_date ? new Date() > new Date(e.exp_date) : false
            return (
              <View style={{ flexDirection: 'row', paddingVertical: 6 }}>
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 25 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: expired
                      ? theme.colors.error
                      : outOfStock
                        ? theme.colors.warning
                        : theme.colors.primary,
                  }}>
                  <FontAwesome
                    name={expired ? 'close' : outOfStock ? 'exclamation' : 'check'}
                    size={12}
                    color={expired ? theme.colors.error : outOfStock ? theme.colors.warning : theme.colors.primary}
                  />
                </View>
                <Text
                  size={8}
                  style={{ paddingLeft: 8, alignSelf: 'center', textDecorationLine: expired ? 'line-through' : 'none' }}>
                  {e.name}
                </Text>
              </View>
            )
          })}
        </View>
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <View style={{ flexDirection: 'row', marginBottom: 64 }}>
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
          {cart && (
            <TouchableOpacity
              onPress={() => {
                dispatch(removeCartItem(cart))
                navigation.navigate('DrawerNavigator')
              }}>
              <Text color="#EF6454">Hapus Produk</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <WrapFooterButton>
        {state?.qty > 0 ? (
          <Button onPress={onPressAddToCart}>
            <Text color="white" type="semibold">
              {cart ? 'Perbarui isi' : 'Tambah ke'} Keranjang - {total && convertToRupiah(total)}
            </Text>
          </Button>
        ) : (
          <Button
            style={{ backgroundColor: cart ? '#EF6454' : theme.colors.primary }}
            onPress={() => {
              if (cart) {
                dispatch(removeCartItem(cart))
              }
              navigation.goBack()
            }}>
            <Text color="white" type="semibold">
              {cart ? 'Hapus' : 'Balik ke menu'}
            </Text>
          </Button>
        )}
      </WrapFooterButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
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
  itemSelectVariant: {
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.defaultBorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
})
