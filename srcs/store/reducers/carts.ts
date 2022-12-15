import uuid from 'react-native-uuid'

const initialState = {
  data: [],
}

const carts = (state = initialState, action: any) => {
  const {payload, type} = action
  const foundItem = state.data.find((e: any) => e?.cartId === payload?.cartId)
  switch (type) {
    case 'SET_CARTS':
      return {
        ...state,
        data: payload,
      }
    case 'ADD_ITEM':
      let newQty = payload?.newQty || 1
      delete payload?.newQty
      if (foundItem) {
        return {
          ...state,
          data: state.data.map((e: any) => (e.cartId === payload.cartId ? {...e, qty: e.qty + newQty} : e)),
        }
      }
      return {
        ...state,
        data: [...state.data, {...payload, cartId: uuid.v4(), qty: newQty}],
      }
    case 'DEC_ITEM_QTY':
      return {
        ...state,
        data: state.data.map((e: any) => (e.cartId === payload.cartId ? {...e, qty: e.qty - 1} : e)),
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        data: state.data.filter((e: any) => e.cartId !== payload.cartId),
      }

    case 'CHANGE_ITEM_QTY':
      return {
        ...state,
        data: state.data.map((e: any) => (e.cartId === payload.cartId ? {...e, qty: payload.qty} : e)),
      }
    case 'CHANGE_ITEM':
      if (foundItem) {
        return {
          ...state,
          data: state.data.map((e: any) => (e.cartId === payload.cartId ? payload : e)),
        }
      }

      return {
        ...state,
        data: [...state.data, {...payload, cartId: uuid.v4()}],
      }
    default:
      return state
  }
}

export default carts
