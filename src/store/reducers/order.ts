import uuid from 'react-native-uuid'

const initialState = {
  current_page: 1,
  page_size: 10,
  rows: [],
}

const order = (state = initialState, action: any) => {
  const {payload, type} = action
  switch (type) {
    case 'SET_ORDERS':
      if (payload?.current_page > 1 && payload?.rows.length > 0) {
        const prevRows = state.rows || []
        return {
          ...state,
          ...payload,
          rows: [...prevRows, ...payload.rows],
        }
      }
      return {
        ...state,
        ...payload,
      }
    case 'CHANGE_ORDER_CARTS':
      const foundItem = state.rows.find((e: any) => e?.orderId === payload?.orderId)
      if (foundItem) {
        return {
          ...state,
          rows: state.rows.map((e: any) =>
            e.orderId === payload.orderId
              ? {
                  ...e,
                  ...payload,
                }
              : e,
          ),
        }
      }
      return {
        ...state,
        rows: [...state.rows, {...payload, orderId: uuid.v4()}],
      }
    case 'REMOVE_ORDER':
      return {
        ...state,
        rows: state.rows.filter((e: any) => e.orderId !== payload.orderId),
      }
    default:
      return state
  }
}

export default order
