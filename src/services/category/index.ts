import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'
import store from '@store/store'

interface ICategory {
  name: string
  icon?: string
}

const getCategory = async (params: {
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
  return await Axios.get(`api/v1/category?${qs.stringify(params)}`)
}

const addCategory = async ({name, icon}: ICategory): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/category', {name, icon})
}

const editCategory = async ({name, icon}: ICategory, categoryId: string): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/category/${categoryId}`, {name, icon})
}

const deleteCategory = async (categoryId: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/category/${categoryId}`)
}

export {getCategory, addCategory, editCategory, deleteCategory}
