import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import {theme} from '@utils/theme'
import Text from '@components/Text'
import {useSelector} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import {useNavigation} from '@react-navigation/native'
import {SafeAreaView} from 'react-native-safe-area-context'

const ManageStore = () => {
  const navigation = useNavigation()
  const {user, merchant} = useSelector((state: any) => state.auth)
  const isAdmin = user?.role === 'admin'

  const onPressManageMerchant = () => {
    if (isAdmin) {
      navigation.navigate('ManageMerchant', {
        id: merchant?.id,
        name: merchant?.name,
        address: merchant?.address,
        phone: merchant?.phone_number,
        footer_note: merchant?.footer_note,
        image: merchant?.image,
        isEdit: true,
      })
    } else {
      navigation.navigate('ManageMerchantList')
    }
  }

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
          Kelola Toko
        </Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.productMenuList}
          onPress={() => {
            navigation.navigate('ManageAdminList')
          }}>
          <View style={styles.flexRow}>
            <Text type="default" style={styles.productMenuTitle}>
              Kelola User
            </Text>
            <Feather name="chevron-right" size={22} color={theme.colors.grey} />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.productMenuList} onPress={onPressManageMerchant}>
          <View style={styles.flexRow}>
            <Text type="default" style={styles.productMenuTitle}>
              Kelola Merchant
            </Text>
            <Feather name="chevron-right" size={22} color={theme.colors.grey} />
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    </SafeAreaView>
  )
}

export default ManageStore

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
    paddingVertical: 10,
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
    width: '100%',
  },
})
