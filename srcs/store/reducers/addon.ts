const initialState: any = {
  rows: [],
  rowsMenu: [],
}

const addons = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ADDON':
      return {
        ...state,
        rows: action.payload.rows,
      }
    case 'SET_ADDON_MENU':
      return {
        ...state,
        rowsMenu: action.payload.rows,
      }
    default:
      return state
  }
}

export default addons
