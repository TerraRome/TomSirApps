import AsyncStorage from '@react-native-async-storage/async-storage'
import {createStore, applyMiddleware} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import middlewares from './middleware'
import rootReducer from './reducers/index'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(...middlewares))

// Middleware: Redux Persist Persister
let persistor = persistStore(store)

// Exports
export {store, persistor}
export default store
