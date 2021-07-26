import 'react-native-gesture-handler'

import React from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'

import {Splash, Login, Register} from '@screens/auth'
import {useSelector} from 'react-redux'
import CheckOut from '@screens/checkout'
import DetailProduct from '@screens/detail-product'
import PaymentMethod from '@screens/payment-method'
import PaymentSuccess from '@screens/payment-success'
import SelectAddon from '@screens/select-addon'
import ManageProductList from '@screens/manage-product-list'
import AddProduct from '@screens/add-product'
import CategoryList from '@screens/category-list'
import AddCategory from '@screens/add-category'
import AddonCategory from '@screens/addon-category'
import AddonMenu from '@screens/addon-menu'
import AddAddonMenu from '@screens/add-addon-menu'
import AddAddonCategory from '@screens/add-addon-category'
import IngredientList from '@screens/ingredient-list'
import AddIngredient from '@screens/add-ingredient'
import SelectIngredient from '@screens/select-ingredient'
import ManageAdmin from '@screens/manage-admin'
import ManageMerchant from '@screens/manage-merchant'
import ManageAdminList from '@screens/manage-admin-list'
import ManageMerchantList from '@screens/manage-merchant-list'
import ReportSummaryProduct from '@screens/dashboard-report/summary-product'
import DrawerNavigator from './drawer-navigator'
import OrderList from '@screens/order-list'
import DetailHistory from '@screens/detail-history'

function Routes() {
  const StackNav = createStackNavigator()
  const SplashStack = createStackNavigator()
  const AuthStack = createStackNavigator()

  const {user} = useSelector((state: any) => state.auth)
  const {isSplashing} = useSelector((state: any) => state.apps)

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
          options={{...TransitionPresets.ModalSlideFromBottomIOS, headerShown: false}}
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
          options={({route: {params}}: any) => ({
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
          options={({route: {params}}: any) => ({
            headerTitle: params?.isEdit ? 'Edit Kategori' : 'Buat Kategori Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="ManageAdmin"
          component={ManageAdmin}
          options={({route: {params}}: any) => ({
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
          options={({route: {params}}: any) => ({
            headerTitle: params?.isEdit ? 'Edit Varian Kategori' : 'Buat Varian Kategori Baru',
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="AddonMenu"
          component={AddonMenu}
          options={({route: {params}}: any) => ({
            headerTitle: `Varian Menu ${params.name}`,
            headerStyle: hideShadow,
            headerTitleStyle: defaultStyle,
          })}
        />
        <StackNav.Screen
          name="AddAddonMenu"
          component={AddAddonMenu}
          options={({route: {params}}: any) => ({
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
          options={({route: {params}}: any) => ({
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
          options={({route: {params}}: any) => ({
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
      </StackNav.Navigator>
    </NavigationContainer>
  )
}

export default Routes
