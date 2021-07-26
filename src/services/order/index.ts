import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

export interface Product {
  id: string
  qty: number
  price: number
  note: string
  addons: string[]
}

export interface OrderPay {
  id?: string
  tax_order_percentage: number
  total_price: number
  total_tax: number
  payment_type: string
  total_pay: number
  payment_return: number
}
export interface Order extends OrderPay {
  type_order: string
  note_order: string
  products: Product[]
  status: 'hold' | 'paid'
}
export interface IAddProductOrder {
  id: string
  products: Product[]
}

export interface TblProductIngredient {
  id: string
  product_id: string
  ingredient_id: string
  qty: number
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  unit: string
  stock: number
  price: number
  exp_date: string
  merchant_id: string
  createdAt: Date
  updatedAt: Date
  tbl_product_ingredient: TblProductIngredient
}

export interface TblProductAddon {
  id: string
  product_id: string
  addon_category_id: string
  createdAt: Date
  updatedAt: Date
}

export interface AddonMenu {
  id: string
  name: string
  price: number
  is_active: boolean
  addon_category_id: string
  createdAt: Date
  updatedAt: Date
}

export interface AddonCategory {
  id: string
  name: string
  is_required: boolean
  max_limit: number
  merchant_id: string
  createdAt: Date
  updatedAt: Date
  tbl_product_addon: TblProductAddon
  addon_menu: AddonMenu[]
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  stock: number
  price: number
  disc: number
  is_disc_percentage: boolean
  exp_date?: any
  category_id: string
  merchant_id: string
  createdAt: Date
  updatedAt: Date
  ingredient: Ingredient[]
  addon_category: AddonCategory[]
}

export interface Addon {
  id: string
  name: string
  price: number
  is_active: boolean
  addon_category_id: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionProduct {
  id: string
  qty: number
  sub_total: number
  note: string
  transaction_id: string
  product_id: string
  createdAt: Date
  updatedAt: Date
  product: Product
  addons: Addon[]
}

export interface IResOrder {
  id: string
  code: string
  type: string
  note: string
  tax_percentage: number
  total_price: number
  total_tax: number
  payment_type: string
  total_pay: number
  payment_return: number
  status: string
  merchant_id: string
  createdAt: Date
  updatedAt: Date
  transaction_product: TransactionProduct[]
}

export const getOrderList = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'type' | 'code' | 'createdAt'
  order?: 'ASC' | 'DESC'
  status?: 'hold' | 'paid'
  search?: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order?${qs.stringify(params)}`)
}

export const getOrderById = async (id: string): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/${id}`)
}

export const order = async (data: Order): Promise<AxiosResponse<IResOrder>> => {
  return await Axios.post('api/v1/order', data)
}

export const updateOrder = async (data: Order): Promise<AxiosResponse<IResOrder>> => {
  return await Axios.put(`api/v1/order/${data.id}`, data)
}

export const addProductOrder = async (data: IAddProductOrder): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/order/product', data)
}

export const updateProductOrder = async (data: Product): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/order/product/${data.id}`, data)
}

export const deleteProductOrder = async (data: Product): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/order/product/${data.id}`)
}

export const deleteOrder = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/order/${id}`)
}

export const payOrder = async (data: OrderPay): Promise<AxiosResponse<IResOrder>> => {
  return await Axios.post('api/v1/order/pay', data)
}
