import {getIngredientList} from 'services/ingredient'

export const seIngredient = (data: any) => ({
  type: 'SET_INGREDIENT',
  payload: data,
})

export const setIngredientItem = (data: any) => ({
  type: 'SET_INGREDIENT_ITEM',
  payload: data,
})

export const addIngredientItem = (data: any) => ({
  type: 'ADD_INGREDIENT_ITEM',
  payload: data,
})

export const removeIngredientItem = (data: any) => ({
  type: 'REMOVE_INGREDIENT_ITEM',
  payload: data,
})

export const changeIngredientItem = (data: any) => ({
  type: 'CHANGE_INGREDIENT_ITEM',
  payload: data,
})

export const getIngredient = () => async (dispatch: any) => {
  try {
    const {
      data: {data},
    } = await getIngredientList({page: 1, limit: 100})
    dispatch(seIngredient(data))
  } catch (error) {}
}
