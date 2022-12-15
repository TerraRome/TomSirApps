import {getStatusTypeOrders} from 'services/typeorder'
import store from '@store/store'

export const setTypeOrder = (data: any) => ({
  type: 'SET_TYPE_ORDER',
  payload: data,
})

export const setStatusTypeOrder = (data: any) => ({
  type: 'SET_STATUS_TYPE_ORDER',
  payload: data,
})

export const getTypeOrder = () => async (dispatch: any) => {
  const {
    auth: {user},
  } = await store.getState()
  try {
    const {
      data: {data},
    } = await getStatusTypeOrders({merchant_id: user.merchant.id})
    dispatch(setStatusTypeOrder(data))
  } catch (error) {}
}
