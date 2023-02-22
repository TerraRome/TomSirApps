import Axios from '@utils/Axios'
import {AxiosResponse} from 'axios'
import qs from 'query-string'

interface IAddUser {
  fullname: string
  email: string
  password: string
  role: string
  merchant_id: string
}

interface IEditUser {
  fullname: string
  email: string
  password: string
  role: string
  merchant_id: string
}

export const addUser = async (data: IAddUser): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/user', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const regisUser = async (data: IAddUser): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/user/regis', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getUsers = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'createdAt'
  order?: 'ASC'
  merchant_id: string | number
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/user?${qs.stringify(params)}`)
}

export const editUser = async (
  id: string,
  data: IEditUser,
): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/user/${id}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteUser = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/user/${id}`)
}
