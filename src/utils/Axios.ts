import axios from 'axios'
import store, {persistor} from '../store/store'
// import constants from '@constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
//@ts-ignore
import RNRestart from 'react-native-restart'
import {refreshToken} from 'services/auth'
import {setTokens} from 'store/actions/auth'

const Axios = axios.create()
let user = store.getState().auth.user

Axios.interceptors.request.use(async config => {
  const token = await getToken()

  Object.assign(config, {
    // baseURL: constants.baseURL,
    baseURL: 'http://103.52.114.71',
    // baseURL: 'http://75d5-180-254-69-129.ngrok.io',
    timeout: 1000 * 30,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  })
  return config
})

Axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    const error = {
      ...err,
      message: err?.response?.data?.message || err?.message,
    }
    if (err?.response?.status === 401 && user != null) {
      logout()
    }
    return Promise.reject(error)
  },
)

const logout = async () => {
  await persistor.purge()
  await AsyncStorage.clear()
  RNRestart.Restart()
}

const getToken = () =>
  new Promise(async resolve => {
    const currentDate = Date.now()
    const {
      auth: {token, exp_token, refresh_token, exp_refresh_token},
    } = await store.getState()
    if (exp_token > currentDate && exp_refresh_token < currentDate) {
      const {
        data: {data},
      } = await refreshToken(refresh_token)
      if (data?.token) {
        store.dispatch(setTokens(data))
        return resolve(data.token)
      }
    }
    return resolve(token)
  })

export default Axios
