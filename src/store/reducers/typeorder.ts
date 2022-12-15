const initialState: any = {
  current_page: 1,
  page_size: 10,
  rows: [],
  statusRows: [],
}

const typeOrder = (state = initialState, action: any) => {
  const {payload} = action
  switch (action.type) {
    case 'SET_TYPE_ORDER':
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
    case 'SET_STATUS_TYPE_ORDER':
      return {
        ...state,
        statusRows: payload,
      }
    default:
      return state
  }
}

export default typeOrder
