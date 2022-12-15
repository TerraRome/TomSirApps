import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

interface Customer {
  name: string
  email: string
  phone_number: string
  merchant_id: string
}

export const addCustomer = async (data: Customer): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/customer', data)
}

export const getCustomers = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'createdAt'
  order?: 'ASC'
  merchant_id: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/customer?${qs.stringify(params)}`)
}

export const editCustomer = async (id: string, data: Customer): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/customer/${id}`, data)
}

export const deleteCustomer = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/customer/${id}`)
}