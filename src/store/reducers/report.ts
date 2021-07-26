import uuid from 'react-native-uuid'

const initialState = {
  summary: {
    gross_income: 0,
    net_income: 0,
    total_qty: 0,
    total_order: 0,
  },
  history: {
    current_page: 1,
    page_size: 10,
    rows: [],
  },
}

const report = (state = initialState, action: any) => {
  const {payload, type} = action
  switch (type) {
    case 'SET_REPORT_SUMMARY':
      return {
        ...state,
        summary: payload,
      }
    case 'SET_REPORT_HISTORY':
      if (payload?.current_page > 1 && payload?.rows.length > 0) {
        const prevRows = state.history.rows || []
        return {
          ...state,
          history: {
            ...state.history,
            ...payload,
            rows: [...prevRows, ...payload.rows],
          },
        }
      }
      return {
        ...state,
        history: payload,
      }
    default:
      return state
  }
}

export default report
