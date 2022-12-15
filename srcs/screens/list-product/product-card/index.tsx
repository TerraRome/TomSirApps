import React, {useRef} from 'react'
import {TouchableOpacity, StyleSheet, Dimensions, View, Image} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import {convertToRupiah} from 'utils/convertRupiah'
import Modalize from 'components/Modalize'
import WrapFooterButton from '@components/WrapFooterButton'
import Button from '@components/Button'
import {useNavigation} from '@react-navigation/native'
import calculateCart from 'utils/calculateCart'
const {width: SCREEN_WIDTH} = Dimensions.get('window')

export default function Card({item, index, carts = [], onPress, numColumns = 3}: any) {
  const navigation = useNavigation()
  const modalRef: any = useRef()
  const cart = carts?.length > 0 && carts?.find((e: any) => e.id === item.id)
  const cartRelated = carts?.length > 0 && carts?.filter((e: any) => e.id === item.id)
  const discountNominal = item?.is_disc_percentage ? (parseFloat(item?.price) * item?.disc) / 100 : item?.disc
  const discountPrice = item.price - discountNominal
  const calculate = calculateCart(cartRelated)
  return (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.6}
        onPress={() => {
          if (cart?.addons?.length > 0) {
            modalRef?.current?.open()
            return
          }
          navigation.navigate('DetailProduct', {item, cart})
          // onPress()
        }}
        style={[
          styles.container,
          {
            paddingRight: (index + 1) % numColumns === 0 ? 12 : 0,
          },
        ]}>
        {!item.image ? (
          <View
            style={{
              maxWidth: SCREEN_WIDTH / (numColumns + 0.3),
              height: SCREEN_WIDTH / (numColumns + 0.3),
              backgroundColor: theme.colors.disabled,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}>
            <Ionicons name="ios-image-outline" size={25} color={theme.colors.grey} />
          </View>
        ) : (
          <Image
            source={{
              uri: item.image,
            }}
            style={[
              styles.image,
              {
                maxWidth: SCREEN_WIDTH / (numColumns + 0.3),
                height: SCREEN_WIDTH / (numColumns + 0.3),
              },
            ]}
          />
        )}
        <View style={{flexDirection: 'row'}}>
          {cartRelated?.length > 0 && (
            <Text size={7} color={theme.colors.primary} style={{marginRight: 6}}>
              {calculate.qty}x
            </Text>
          )}
          <Text
            size={7}
            maxLines={2}
            style={{flex: 0.95}}
            color={cartRelated?.length > 0 ? theme.colors.primary : theme.colors.black}>
            {item.name}
          </Text>
        </View>
        <Text size={7} type="semibold">
          {convertToRupiah(discountPrice)}{' '}
        </Text>
        {discountNominal > 0 && (
          <Text size={6} type="regular" style={{textDecorationLine: 'line-through'}}>
            {convertToRupiah(item.price)}
          </Text>
        )}
      </TouchableOpacity>
      <Modalize style={{paddingBottom: 0}} ref={modalRef}>
        <View style={{paddingHorizontal: 16}}>
          <View style={styles.wrapHeaderDetail}>
            <Text type="semibold" size={10} style={{flex: 0.9}}>
              {item.name}
            </Text>
            <View style={{alignItems: 'flex-end'}}>
              <Text type="semibold" size={10}>
                {convertToRupiah(discountPrice)}
              </Text>
              <Text size={8} type="regular" style={{textDecorationLine: 'line-through'}}>
                {convertToRupiah(item.price)}
              </Text>
            </View>
          </View>
          {cartRelated && (
            <React.Fragment>
              {cartRelated.map((cart: any) => {
                const totalPriceAddons = cart.addons.reduce((acc: number, curr: any) => acc + parseFloat(curr.price), 0)
                const totalRealPriceItemRelated = parseFloat(cart.price + totalPriceAddons) * cart?.qty
                const nominalDiscount = cart?.is_disc_percentage
                  ? (parseFloat(cart?.price) * cart?.disc) / 100
                  : parseFloat(cart?.disc)
                const discountPriceRelated = totalRealPriceItemRelated - nominalDiscount * cart?.qty
                return (
                  <TouchableOpacity
                    onPress={() => {
                      modalRef?.current?.close()
                      navigation.navigate('DetailProduct', {item, cart})
                    }}
                    style={styles.cartItem}>
                    <View style={{flex: 0.9, flexDirection: 'row'}}>
                      <Text type="semibold">{cart.qty}x</Text>
                      <View style={{flexDirection: 'column', marginLeft: 20}}>
                        <Text>
                          {cart?.addons?.length > 0 ? cart.addons.map((e: any) => e.name).join(', ') : cart.name}
                        </Text>
                        <Text size={7} color="#31AAC3" type="semibold">
                          Edit
                        </Text>
                      </View>
                    </View>
                    <Text>{convertToRupiah(discountPriceRelated)}</Text>
                  </TouchableOpacity>
                )
              })}
            </React.Fragment>
          )}
        </View>
        <WrapFooterButton>
          <Button
            onPress={() => {
              modalRef?.current?.close()
              navigation.navigate('DetailProduct', {item})
            }}>
            <Text color="white" type="semibold">
              Satu Lagi
            </Text>
          </Button>
        </WrapFooterButton>
      </Modalize>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    paddingLeft: 12,
    marginBottom: 22,
  },
  image: {
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#f2f2f2',
  },
  wrapHeaderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 6,
    marginHorizontal: -16,
    borderBottomColor: '#F2F3F4',
  },
  cartItem: {
    padding: 10,
    marginBottom: 3,
    borderBottomColor: theme.colors.defaultBorderColor,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
