import Axios from '@utils/Axios'
import {AxiosResponse} from 'axios'

export const signin = async (params: {
  email: string
  password: string
}): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/auth/signin', params)
}

export const refreshToken = async (
  refresh_token: string,
): Promise<AxiosResponse> => {
  return await Axios.post('api/v1/auth/refresh-token', {refresh_token})
}
