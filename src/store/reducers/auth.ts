const initialState = {
  user: null,
  token: null,
  refresh_token: null,
  merchant: null,
}

const auth = (state = initialState, {type, payload}: any) => {
  switch (type) {
    case 'SET_AUTH':
      return {
        ...state,
        ...payload,
        user: payload,
      }
    case 'SET_CURRENT_USER':
      return {
        ...state,
        user: payload,
      }
    case 'SET_MERCHANT_BY_ID':
      return {
        ...state,
        merchant: payload,
      }
    case 'SET_TOKENS':
      return {
        ...state,
        exp_refresh_token: payload.exp_refresh_token,
        refresh_token: payload.refresh_token,
        exp_token: payload.exp_token,
        token: payload.token,
      }
    default:
      return state
  }
}

export default auth
