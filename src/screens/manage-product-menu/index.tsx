import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import Feather from 'react-native-vector-icons/Feather'
import {useNavigation} from '@react-navigation/native'
import {SafeAreaView} from 'react-native-safe-area-context'

const productMenu = [
  {
    key: 'ManageProductList',
    title: 'Daftar Produk',
  },
  {
    key: 'CategoryList',
    title: 'Kategori',
  },
  {
    key: 'AddonCategory',
    title: 'Varian',
  },
  {
    key: 'IngredientList',
    title: 'Bahan Baku',
  },
]

const ManageProductMenu = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerMenu}
          onPress={() => {
            //@ts-ignore
            navigation.openDrawer()
          }}>
          <Feather name="menu" size={20} />
        </TouchableOpacity>
        <Text type="semibold" style={styles.textMenu}>
          Kelola Produk
        </Text>
      </View>
      <View style={styles.content}>
        {productMenu.map((item, index) => (
          <>
            <TouchableOpacity
              style={styles.productMenuList}
              key={index}
              onPress={() => {
                navigation.navigate(item.key)
              }}>
              <View style={styles.flexRow}>
                <Text type="default" style={styles.productMenuTitle}>
                  {item.title}
                </Text>
                <Feather name="chevron-right" size={22} color={theme.colors.grey} />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        ))}
      </View>
    </SafeAreaView>
  )
}

export default ManageProductMenu

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  headerMenu: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  textMenu: {
    fontSize: 18,
  },
  content: {
    marginVertical: 10,
    marginHorizontal: 22,
  },
  productMenuList: {
    // flexDirection: 'row',
    paddingVertical: 15,
  },
  productMenuTitle: {
    fontSize: 18,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: theme.colors.disabled,
    height: 1,
    // marginTop: 10,
    width: '100%',
  },
})
