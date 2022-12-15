import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'
import {ImageSourcePropType} from 'react-native'
import store from '@store/store'

interface IAddProduct {
  name: string
  description: string
  price: number
  category_id: string
  image: ImageSourcePropType
  stock: string
  addon_categories: Array<string>
  ingredients: Array<string>
}

interface IEditProduct {
  name: string
  description: string
  price: number
  category_id: string
  image: ImageSourcePropType
  stock: string
  disc: number
  is_disc_percentage: boolean
  addon_categories: Array<string>
}

export const getProducts = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'name' | 'price' | 'createdAt'
  order?: 'ASC' | 'DESC'
  merchant_id: string
}): Promise<AxiosResponse> => {
  const {
    merchant: {id: merchant_id},
  } = await store.getState().auth
  Object.assign(params, {merchant_id})
  return await Axios.get(`api/v1/product?${qs.stringify(params)}`)
}

export const getProduct = async (id: string): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/product/${id}`)
}

export const addProduct = async (data: IAddProduct): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/product', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const editProduct = async (id: string, data: IEditProduct): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/product/${id}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteProduct = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/product/${id}`)
}
