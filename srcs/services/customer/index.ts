import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

interface Customer {
  name: string
  email: string
  phone_number: number
}

export const addCustomer = async (data: Customer): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/customer', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getCustomer = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'createdAt'
  order?: 'ASC'
  name: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/customer?${qs.stringify(params)}`)
}