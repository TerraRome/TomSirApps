import Text from '@components/Text'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { getMerchantById } from '@store/actions/merchant'
import React from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DashboardReport from 'screens/dashboard-report'
import ListProduct from 'screens/list-product'
import ManageProductMenu from 'screens/manage-product-menu'
import ManageStore from 'screens/manage-store'
import { persistor } from 'store/store'
//@ts-ignore
import RNRestart from 'react-native-restart'
import { useDispatch, useSelector } from 'react-redux'
import { theme } from 'utils/theme'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  const { user } = useSelector((state: any) => state.auth)
  const isAdmin = user?.role === 'admin'
  const superAdmin = user?.role === 'superadmin'

  return (
    <Drawer.Navigator initialRouteName="ListProduct" drawerContent={props => <CustomDrawerContent {...props} />}>
      {!superAdmin && (
        <Drawer.Screen
          name="ListProduct"
          component={ListProduct}
          options={{
            drawerLabel: ({ focused, color }) => (
              <Text type={focused ? 'semibold' : 'regular'} style={[{ color: color }, styles.labelSpace]}>
                Katalog
              </Text>
            ),
            drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />,
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
      )}
      {isAdmin && (
        <Drawer.Screen
          name="DashboardReport"
          component={DashboardReport}
          options={{
            drawerLabel: ({ focused, color }) => (
              <Text type={focused ? 'semibold' : 'regular'} style={[{ color: color }, styles.labelSpace]}>
                Laporan
              </Text>
            ),
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-open-page-variant" color={color} size={size} />
            ),
          }}
        />
      )}
      {!superAdmin && (
        <Drawer.Screen
          name="ManageProductMenu"
          component={ManageProductMenu}
          options={{
            drawerLabel: ({ focused, color }) => (
              <Text type={focused ? 'semibold' : 'regular'} style={[{ color: color }, styles.labelSpace]}>
                Kelola Produk
              </Text>
            ),
            drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="basket-fill" color={color} size={size} />,
          }}
        />
      )}
      {superAdmin || isAdmin ? (
        <Drawer.Screen
          name="ManageStore"
          component={ManageStore}
          options={{
            drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="storefront" color={color} size={size} />,
            drawerLabel: ({ focused, color }) => (
              <Text type={focused ? 'semibold' : 'regular'} style={[{ color: color }, styles.labelSpace]}>
                Kelola Toko
              </Text>
            ),
          }}
        />
      ) : null}
    </Drawer.Navigator>
  )
}

function CustomDrawerContent(props: any) {
  const dispatch = useDispatch()
  const { user, merchant } = useSelector((state: any) => state.auth)
  const superAdmin = user?.role === 'superadmin'
  return (
    <DrawerContentScrollView {...props} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {superAdmin ? (
            <Text>SuperAdmin</Text>
          ) : (
            <>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Image source={{ uri: merchant.image }} style={styles.image} />
                  <View style={styles.infoPadding}>
                    <Text type="regular" size={8} maxLines={1}>
                      {user?.role}
                    </Text>
                    <Text type="semibold" size={13} maxLines={1}>
                      {merchant.name}
                    </Text>
                    <Text type="regular" size={7} style={styles.infoPaddingTop}>
                      {merchant.address}
                    </Text>
                    <Text type="regular" size={7} style={styles.infoPaddingTop}>
                      Telp: {merchant.phone_number}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => dispatch(getMerchantById())}>
                  <MaterialCommunityIcons name="restart" size={20} style={styles.iconEditPadding} />
                </TouchableOpacity>
              </View>
              <Text type="regular" size={6} style={styles.footerPadding}>
                Catatan kaki
              </Text>
              <Text type="regular" size={8}>
                {merchant.footer_note}
              </Text>
            </>
          )}
        </View>
        <DrawerItemList activeBackgroundColor={theme.colors.primary} activeTintColor={theme.colors.white} {...props} />
        <DrawerItem
          activeBackgroundColor={theme.colors.primary}
          activeTintColor={theme.colors.white}
          icon={({ color, size }) => <MaterialCommunityIcons name="logout" color={color} size={size} />}
          label={({ focused, color }) => (
            <Text type="regular" style={[{ color: color }, styles.labelSpace]}>
              Log out
            </Text>
          )}
          onPress={() => {
            logout()
            props.navigation.closeDrawer()
          }}
        />
      </View>
      <Text type="regular" size={6} style={styles.footerVersion}>
        V.1.0.4
      </Text>
    </DrawerContentScrollView>
  )
}

const logout = () => {
  Alert.alert(
    'Logout?',
    'You will back to login screen.',
    [
      {
        text: 'Cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await persistor.purge()
          await AsyncStorage.clear()
          RNRestart.Restart()
        },
      },
    ],
    {
      cancelable: true,
    },
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    margin: 16,
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  infoPadding: {
    paddingLeft: 8,
  },
  infoPaddingTop: {
    paddingTop: 4,
  },
  footerPadding: {
    paddingTop: 8,
  },
  iconEditPadding: {
    paddingTop: 14,
    paddingLeft: 6,
  },
  labelSpace: {
    marginLeft: -16,
  },
  footerVersion: {
    alignSelf: 'center',
    fontWeight: 'bold',
  }
})
