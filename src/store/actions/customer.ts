import {getCustomers as getCustomerList} from 'services/customer'
import store from '@store/store'

export const setCustomer = (data: any) => ({
  type: 'SET_CUSTOMER',
  payload: data,
})

export const getCustomer = () => async (dispatch: any) => {
  const {
    auth: {user},
  } = await store.getState()
  try {
    const {
      data: {data},
    } = await getCustomerList({page: 1, limit: 100, merchant_id: user.merchant.id})
    dispatch(setCustomer(data))
  } catch (error) {}
}
