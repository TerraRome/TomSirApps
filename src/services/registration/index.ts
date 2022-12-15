import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

interface Registration {
  tanggal: string
  jumlah: number
  status: string
  merchant_id: string
}

export const getRegistrationList = async (params: {
  tanggal: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/registration?${qs.stringify(params)}`)
}

export const getAllRegis = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'tanggal' | 'createdAt'
  order?: 'ASC' | 'DESC'
  merchant_id: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/registration/all?${qs.stringify(params)}`)
}

export const addRegistration = async (payload: Registration): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/registration', payload)
}