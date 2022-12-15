import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

import AddAddonCategory from '@screens/add-addon-category'
import AddAddonMenu from '@screens/add-addon-menu'
import AddCategory from '@screens/add-category'
import AddCustomer from '@screens/add-customer'
import AddIngredient from '@screens/add-ingredient'
import AddKas from '@screens/add-kas'
import AddProduct from '@screens/add-product'
import AddTypeOrder from '@screens/add-type-order'
import AddonCategory from '@screens/addon-category'
import AddonMenu from '@screens/addon-menu'
import { Login, Register, Splash } from '@screens/auth'
import CategoryList from '@screens/category-list'
import CheckOut from '@screens/checkout'
import ReportSummaryProduct from '@screens/dashboard-report/summary-product'
import DetailHistory from '@screens/detail-history'
import DetailProduct from '@screens/detail-product'
import IngredientList from '@screens/ingredient-list'
import ManageAdmin from '@screens/manage-admin'
import ManageAdminList from '@screens/manage-admin-list'
import ManageCustomer from '@screens/manage-customer'
import ManageKas from '@screens/manage-kas'
import ManageMerchant from '@screens/manage-merchant'
import ManageMerchantList from '@screens/manage-merchant-list'
import ManageModal from '@screens/manage-modal'
import ManageProductList from '@screens/manage-product-list'
import ManageTypeOrder from '@screens/manage-type-order'
import Midtrans from '@screens/midtrans-payment'
import WebviewMidtrans from '@screens/midtrans-payment/webview'
import OrderList from '@screens/order-list'
import PaymentMethod from '@screens/payment-method'
import PaymentSuccess from '@screens/payment-success'
import ScanBarcode from '@screens/qr-scan-product'
import SelectAddon from '@screens/select-addon'
import SelectIngredient from '@screens/select-ingredient'
import { useSelector } from 'react-redux'
import DrawerNavigator from './drawer-navigator'

function Routes() {
  const StackNav = createStackNavigator()
  const SplashStack = createStackNavigator()
  const AuthStack = createStackNavigator()

  const { user } = useSelector((state: any) => state.auth)
  const { isSplashing } = useSelector((state: any) => state.apps)

  const defaultStyle = {
    fontFamily: 'Jost-SemiBold',
    fontSize: 20,
  }

  const hideShadow = {
    backgroundColor: 'white',
    shadowColor: 'transparent',
    elevation: 0,
  }

  if (isSplashing) {
    return (
      <NavigationContainer>
        <SplashStack.Navigator initialRouteName="Splash" headerMode="none">
          <SplashStack.Screen name="Splash" component={Splash} />
        </SplashStack.Navigator>
      </NavigationContainer>
    )
  }

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator
          screenOptions={TransitionPresets.ScaleFromCenterAndroid}
          headerMode="none"
          initialRouteName="Login">
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="Register" component={Register} />
        </AuthStack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <StackNav.Navigator screenOptions={TransitionPresets.SlideFromRightIOS} initialRouteName="DrawerNavigator">
        <StackNav.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name="DetailProduct"
          component={DetailProduct}
          options={{ ...TransitionPresets.ModalSlideFromBottomIOS, headerShown: false }}
        />
        <StackNav.Screen
          name="CheckOut"
          component={CheckOut}
          options={{
            headerTitle: 'Detail Pesanan',
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={{
            headerTitle: 'Pembayaran',
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name="ManageProductList"
          component={ManageProductList}
          options={{
            headerTitle: 'Daftar Produk',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddProduct"
          component={AddProduct}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Ubah Produk' : 'Buat Produk Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="SelectAddon"
          component={SelectAddon}
          options={{
            headerTitle: 'Pilih Varian',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="CategoryList"
          component={CategoryList}
          options={{
            headerTitle: 'Daftar Kategori',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddCategory"
          component={AddCategory}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Kategori' : 'Buat Kategori Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="ManageAdmin"
          component={ManageAdmin}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit User' : 'Daftar User',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="OrderList"
          component={OrderList}
          options={{
            headerTitle: 'Pesanan',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddAddonCategory"
          component={AddAddonCategory}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Varian Kategori' : 'Buat Varian Kategori Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="AddonMenu"
          component={AddonMenu}
          options={({ route: { params } }: any) => ({
            headerTitle: `Varian Menu ${params.name}`,
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="AddAddonMenu"
          component={AddAddonMenu}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Varian Menu' : 'Buat Varian Menu Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="IngredientList"
          component={IngredientList}
          options={{
            headerTitle: 'Daftar Bahan Baku',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ManageMerchant"
          component={ManageMerchant}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Merchant' : 'Daftar Merchant',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="ManageAdminList"
          component={ManageAdminList}
          options={{
            headerTitle: 'Daftar User',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddIngredient"
          component={AddIngredient}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Bahan' : 'Tambah Bahan Baku',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="ManageMerchantList"
          component={ManageMerchantList}
          options={{
            headerTitle: 'Daftar Merchant',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="SelectIngredient"
          component={SelectIngredient}
          options={{
            headerTitle: 'Pilih Bahan Baku',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddonCategory"
          component={AddonCategory}
          options={{
            headerTitle: 'Varian Kategori',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ReportSummaryProduct"
          component={ReportSummaryProduct}
          options={{
            headerTitle: 'Total Produk Terjual',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="DetailHistory"
          component={DetailHistory}
          options={{
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ScanBarcode"
          component={ScanBarcode}
          options={{
            headerTitle: 'Scan Barcode',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ManageModal"
          component={ManageModal}
          options={{
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ManageKas"
          component={ManageKas}
          options={{
            headerTitle: 'Daftar Kas',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddKas"
          component={AddKas}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Kas' : 'Tambah Kas',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="ManageTypeOrder"
          component={ManageTypeOrder}
          options={{
            headerTitle: 'Daftar Tipe Order',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="ManageCustomer"
          component={ManageCustomer}
          options={{
            headerTitle: 'Daftar Pelanggan',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="AddCustomer"
          component={AddCustomer}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="AddTypeOrder"
          component={AddTypeOrder}
          options={({ route: { params } }: any) => ({
            headerTitle: params?.isEdit ? 'Edit Tipe Order' : 'Tambah Tipe Order',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="Midtrans"
          component={Midtrans}
          options={{
            headerTitle: 'Midtrans',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
        <StackNav.Screen
          name="WebviewMidtrans"
          component={WebviewMidtrans}
          options={{
            headerTitle: 'Midtrans Payment',
            // headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          }}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  )
}

export default Routes
