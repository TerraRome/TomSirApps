type Action = {
  type: string
  payload: any
}

export const setAuth = (payload: any): Action => ({type: 'SET_AUTH', payload})
export const setCurrentUser = (payload: any): Action => ({type: 'SET_CURRENT_USER', payload})
export const setTokens = (payload: any): Action => ({type: 'SET_TOKENS', payload})
