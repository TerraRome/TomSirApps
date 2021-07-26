const initialState: any = {
  rows: [],
  dataIngredient: [],
}

const ingredient = (state = initialState, action: any) => {
  const {payload} = action
  switch (action.type) {
    case 'SET_INGREDIENT':
      return {
        ...state,
        rows: payload.rows,
      }
    case 'SET_INGREDIENT_ITEM': {
      return {
        ...state,
        dataIngredient: action.payload,
      }
    }
    case 'ADD_INGREDIENT_ITEM': {
      return {
        ...state,
        dataIngredient: state.dataIngredient.concat(payload),
      }
    }
    case 'CHANGE_INGREDIENT_ITEM': {
      return {
        ...state,
        dataIngredient: state.dataIngredient.map((item: any) => (item.id === payload.id ? payload : item)),
      }
    }
    case 'REMOVE_INGREDIENT_ITEM': {
      return {
        ...state,
        dataIngredient: state.dataIngredient.filter((item: any) => item.id !== action.payload.id),
      }
    }
    default:
      return state
  }
}

export default ingredient
