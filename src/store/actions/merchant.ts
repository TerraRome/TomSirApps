import {
  getMerchants as getMerchantList,
  getMerchantId,
} from '@services/merchant'
import store from '@store/store'

export const setMerchant = (data: any) => ({
  type: 'SET_MERCHANT',
  payload: data,
})

export const setMerchantById = (data: any) => ({
  type: 'SET_MERCHANT_BY_ID',
  payload: data,
})

export const getMerchant = () => async (dispatch: any) => {
  try {
    const {
      data: {data},
    } = await getMerchantList({page: 1, limit: 100})
    dispatch(setMerchant(data))
  } catch (error) {}
}

export const getMerchantById = () => async (dispatch: any) => {
  const {
    merchant: {id: merchant_id},
  } = await store.getState().auth
  try {
    const {
      data: {data},
    } = await getMerchantId(merchant_id)
    dispatch(setMerchantById(data))
  } catch (error) {
    // console.log(error)
  }
}
