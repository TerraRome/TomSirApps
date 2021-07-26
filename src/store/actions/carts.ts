export const setCarts = (data: any) => ({
  type: 'SET_CARTS',
  payload: data,
})
export const addCartItem = (data: any) => ({
  type: 'ADD_ITEM',
  payload: data,
})
export const removeCartItem = (data: any) => ({
  type: 'REMOVE_ITEM',
  payload: data,
})
export const changeQTYCartItem = (data: any) => ({
  type: 'CHANGE_ITEM_QTY',
  payload: data,
})
export const changeCartItem = (data: any) => ({
  type: 'CHANGE_ITEM',
  payload: data,
})
export const deleteItem = (data: any) => ({
  type: 'DEC_ITEM_QTY',
  payload: data,
})
