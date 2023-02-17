import Axios from '@utils/Axios'
import {AxiosResponse} from 'axios'
import qs from 'query-string'

interface TypeOrder {
  name: string
  status: boolean
  price: number
  merchant_id: string
}

export const addTypeOrder = async (data: TypeOrder): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/type-order', data)
}

export const getTypeOrders = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'createdAt'
  order?: 'ASC'
  merchant_id: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/type-order?${qs.stringify(params)}`)
}

export const getStatusTypeOrders = async (params: {
  merchant_id: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/type-order/search?${qs.stringify(params)}`)
}

export const editTypeOrder = async (
  id: string,
  data: TypeOrder,
): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/type-order/${id}`, data)
}

export const deleteTypeOrder = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/type-order/${id}`)
}
