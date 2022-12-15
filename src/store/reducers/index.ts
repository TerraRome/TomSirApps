import {combineReducers} from 'redux'
// Imports: Reducers
import auth from './auth'
import apps from './apps'
import products from './products'
import category from './category'
import customer from './customer'
import carts from './carts'
import addons from './addon'
import order from './order'
import ingredient from './ingredient'
import registration from './registration'
import report from './report'
import kas from './kas'
import typeOrder from './typeorder'

import merchants from './merchant'
import users from './user'
// Redux: Root Reducer
const rootReducer = combineReducers({
  auth,
  apps,
  products,
  category,
  customer,
  carts,
  addons,
  order,
  ingredient,
  report,
  merchants,
  users,
  registration,
  kas,
  typeOrder
})
// Exports
export default rootReducer
