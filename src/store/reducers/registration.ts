const initialState: any = {
  rows: [],
  dataRegistration: [],
}

const registration = (state = initialState, action: any) => {
  const {payload} = action
  switch (action.type) {
    case 'SET_REGISTRATION':
      return {
        ...state,
        rows: payload.rows,
      }
    case 'ADD_REGISTRATION_ITEM': {
      return {
        ...state,
        dataRegistration: state.dataRegistration.concat(payload),
      }
    }
    default:
      return state
  }
}

export default registration
