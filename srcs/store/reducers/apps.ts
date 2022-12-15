const initialState = {
  isSplashing: true,
  printer: null,
}

const apps = (state = initialState, {type, payload}: any) => {
  switch (type) {
    case 'SET_DONE_SPLASH':
      return {
        ...state,
        isSplashing: false,
      }
    case 'SET_PRINTER':
      return {
        ...state,
        printer: payload,
      }
    default:
      return state
  }
}

export default apps
