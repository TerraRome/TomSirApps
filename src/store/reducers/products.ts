const initialState: any = {
  current_page: 1,
  page_size: 10,
  rows: [],
}

const products = (state = initialState, action: any) => {
  const {payload} = action
  switch (action.type) {
    case 'SET_PRODUCTS':
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
    default:
      return state
  }
}

export default products
