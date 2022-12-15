import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'
import store from '@store/store'

interface Kas {
  tanggal: string
  type: String
  jumlah: number
  deskripsi: string
  merchant_id: string
}

export const getAllKas = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'tanggal' | 'createdAt'
  order?: 'ASC' | 'DESC'
  merchant_id: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/kas?${qs.stringify(params)}`)
}

export const addKas = async (payload: Kas): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/kas', payload)
}

export const editKas = async (id: string, data: Kas): Promise<AxiosResponse> => {
  return await Axios.put(`api/v1/kas/${id}`, data)
}

export const deleteKas = async (id: string): Promise<AxiosResponse> => {
  return await Axios.delete(`api/v1/kas/${id}`)
}

export const getReportKas = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'createdAt'
  order?: 'ASC' | 'DESC'
  search?: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/kas/report?${qs.stringify(params)}`)
}