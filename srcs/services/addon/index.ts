import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

export const getAddonCategory = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'name' | 'price' | 'createdAt'
  order?: 'ASC' | 'DESC'
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/addon-category?${qs.stringify(params)}`)
}

export const addAddonCategory = async (data: {
  name: string
  is_required: boolean
  max_limit: number
}): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/addon-category', data)
}

export const deleteAddonCategory = async (addonCategoryId: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/addon-category/${addonCategoryId}`)
}

export const editAddonCategory = async (
  data: {
    name: string
    is_required: boolean
    max_limit: number
  },
  addonCategoryId: string,
): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/addon-category/${addonCategoryId}`, data)
}

export const getAddonMenu = async (
  params: {
    page: string | number
    limit: string | number
    sortBy?: 'name' | 'price' | 'createdAt'
    order?: 'ASC' | 'DESC'
  },
  categoryId: string,
): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/addon-menu/by-category/${categoryId}?${qs.stringify(params)}`)
}

export const addAddonMenu = async (params: {
  name: string
  price: number
  is_active: boolean
  addon_category_id: string
}): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/addon-menu', params)
}

export const deleteAddonMenu = async (addonMenuId: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/addon-menu/${addonMenuId}`)
}

export const editAddonMenu = async (
  data: {
    name: string
    price: number
    is_active: number
  },
  addonMenuId: string,
): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/addon-menu/${addonMenuId}`, data)
}
