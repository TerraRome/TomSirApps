import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

interface IIngredient {
  name: string
  unit: string
  stock: number
  price: number
  exp_date: string
}

export const getIngredientList = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'name' | 'price' | 'createdAt'
  order?: 'ASC' | 'DESC'
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/ingredient?${qs.stringify(params)}`)
}

export const addIngredient = async (payload: IIngredient): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/ingredient', payload)
}

export const deleteIngredient = async (ingredientId: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/ingredient/${ingredientId}`)
}

export const editIngredient = async (payload: IIngredient, ingredientId: string): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/ingredient/${ingredientId}`, payload)
}
