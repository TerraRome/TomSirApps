import React from 'react'

import Routes from './src/routes'

import { LogBox, StatusBar } from 'react-native'

import FlashMessage from 'react-native-flash-message'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '@store/store'

LogBox.ignoreAllLogs();

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="transparent" />
        <Routes />
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  )
}

export default App
