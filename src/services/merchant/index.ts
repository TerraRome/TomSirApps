import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from 'utils/Axios'
import {ImageSourcePropType} from 'react-native'
interface IAddMerchant {
  name: string
  address: string
  phone: string
  footer_note: string
  server_key: string
  client_key: string
  catalog: string
  image: ImageSourcePropType
}

interface IEditMerchant {
  name: string
  address: string
  phone: string
  footer_note: string
  server_key: string
  client_key: string
  catalog: string
  image: ImageSourcePropType
}

export const addMerchant = async (data: IAddMerchant): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/merchant', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getMerchants = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'name' | 'createdAt'
  order?: 'ASC'
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/merchant?${qs.stringify(params)}`)
}

export const editMerchants = async (id: string, data: IEditMerchant): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/merchant/${id}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getMerchantId = async (merchantId: string): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/merchant/${merchantId}`)
}
