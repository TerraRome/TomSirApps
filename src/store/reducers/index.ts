import {combineReducers} from 'redux'
// Imports: Reducers
import auth from './auth'
import apps from './apps'
import products from './products'
import category from './category'
import carts from './carts'
import addons from './addon'
import order from './order'
import ingredient from './ingredient'
import report from './report'

import merchants from './merchant'
import users from './user'
// Redux: Root Reducer
const rootReducer = combineReducers({
  auth,
  apps,
  products,
  category,
  carts,
  addons,
  order,
  ingredient,
  report,
  merchants,
  users,
})
// Exports
export default rootReducer
