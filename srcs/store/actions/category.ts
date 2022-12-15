import {getCategory as getCategoryList} from 'services/category'
import store from '@store/store'

export const setCategory = (data: any) => ({
  type: 'SET_CATEGORY',
  payload: data,
})

export const getCategory = () => async (dispatch: any) => {
  const {
    auth: {user},
  } = await store.getState()
  try {
    const {
      data: {data},
    } = await getCategoryList({page: 1, limit: 100, merchant_id: user.merchant.id})
    dispatch(setCategory(data))
  } catch (error) {}
}
