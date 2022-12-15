import {AxiosResponse} from 'axios'
import qs from 'query-string'
import Axios from '@utils/Axios'

export const getReportSummary = async (params: {start_date: string; end_date: string}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/report/summary?${qs.stringify(params)}`)
}

export const getReportSummaryProduct = async (params: {
  start_date: string
  end_date: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/report/summary/product?${qs.stringify(params)}`)
}

export const getReportExcel = async (params: {start_date: string; end_date: string}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/report/excel?${qs.stringify(params)}`)
}

export const getReportById = async (id: string): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/report/${id}`)
}

export const getReportList = async (params: {
  page: string | number
  limit: string | number
  sortBy?: 'type' | 'code' | 'createdAt'
  order?: 'ASC' | 'DESC'
  status?: 'hold' | 'paid'
  search?: string
}): Promise<AxiosResponse> => {
  return await Axios.get(`api/v1/order/report?${qs.stringify(params)}`)
}
