export const setOrders = (data: any) => ({
  type: 'SET_ORDERS',
  payload: data,
})
export const changeOrderCarts = (data: any) => ({
  type: 'CHANGE_ORDER_CARTS',
  payload: data,
})
export const removeOrderItem = (data: any) => ({
  type: 'REMOVE_ORDER',
  payload: data,
})
