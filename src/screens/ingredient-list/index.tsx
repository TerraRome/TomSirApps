import React, {useEffect} from 'react'
import {View, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {getIngredient} from 'store/actions/ingredient'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import CustomButton from '@components/Button'

const IngredientList = ({navigation}: any) => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const {rows} = useSelector((state: any) => state.ingredient)

  useEffect(() => {
    dispatch(getIngredient())
  }, [isFocused])

  const onPressIngredient = (item: any) => () => {
    navigation.navigate('AddIngredient', {
      isEdit: true,
      id: item?.id,
      name: item?.name,
      price: item?.price,
      unit: item?.unit,
      stock: item?.stock,
      expDate: item?.exp_date,
    })
  }

  const renderItem = ({item}: {item: any}) => {
    return (
      <TouchableOpacity style={styles.ingredientList} onPress={onPressIngredient(item)}>
        <Text size={9} type="regular">
          {item?.name}
        </Text>
        <AntDesign name="right" size={18} color={theme.colors.blackSemiTransparent} />
      </TouchableOpacity>
    )
  }

  const renderDivider = () => <View style={styles.divider} />

  const renderEmptyList = () => (
    <View style={styles.center}>
      <Image source={require('@assets/images/undraw_empty.png')} style={styles.emptyImage} />
      <Text style={styles.center} type="semibold">
        Tidak ada bahan tersedia
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={rows}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={renderDivider}
          ListFooterComponent={rows.length ? renderDivider : null}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton mode="default" onPress={() => navigation.navigate('AddIngredient')} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>Tambah Bahan Baku</Text>
        </CustomButton>
      </View>
    </View>
  )
}

export default IngredientList

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
  ingredientList: {
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
