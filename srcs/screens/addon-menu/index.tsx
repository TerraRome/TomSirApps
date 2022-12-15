import React, {useState, useEffect, useCallback} from 'react'
import {View, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'
import Text from '@components/Text'
import {theme} from '@utils/theme'
import {getAddonMenu} from '@services/addon'
import {setAddonsMenu} from '@store/actions/addon'
import CustomButton from '@components/Button'
import {convertToRupiah} from '@utils/convertRupiah'

const AddonMenu = ({navigation, route}: any) => {
  const id = route?.params?.id
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const {rowsMenu} = useSelector((state: any) => state.addons)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [isFocused])

  const getData = useCallback(async () => {
    setLoading(true)
    try {
      const {
        data: {data},
      } = await getAddonMenu({page: 1, limit: 100}, id)
      dispatch(setAddonsMenu(data))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  const onPress = (item: any) => () => {
    navigation.navigate('AddAddonMenu', {
      name: item?.name,
      price: item?.price,
      isActive: item?.is_active,
      addonCategoryId: item?.addon_category_id,
      isEdit: true,
      id: item?.id,
    })
  }

  const renderDivider = () => <View style={styles.divider} />

  const renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.productList} onPress={onPress(item)}>
        <Text size={9} type="regular">
          {item?.name}
        </Text>
        <Text size={9} type="regular">
          {`Rp ${convertToRupiah(item?.price)}`}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Tidak ada varian menu tersedia
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={rowsMenu}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={getData}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={rowsMenu.length ? renderDivider : null}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={() => navigation.navigate('AddAddonMenu', {id})} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>Tambah Varian Menu</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default AddonMenu

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  buttonAdd: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: 'Jost-SemiBold',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  productList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey2,
  },
  emptyImage: {
    width: 300,
    height: 300,
    marginTop: 32,
    resizeMode: 'contain',
  },
  center: {
    alignSelf: 'center',
  },
})
