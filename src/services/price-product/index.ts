import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

interface PriceProduct {
  price_info: string
}

export const addPriceProduct = async (
  data: PriceProduct,
): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/price-product', data)
}

export const getPriceProduct = async (id: string): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/price-product/${id}`)
}

export const editPriceProduct = async (
  id: string,
  data: PriceProduct,
): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/price-product/${id}`, data)
}

export const deletePriceProduct = async (
  id: string,
): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/price-product/${id}`)
}
