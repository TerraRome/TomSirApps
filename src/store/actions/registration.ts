import {getRegistrationList} from 'services/registration'

export const setRegistration = (data: any) => ({
  type: 'SET_REGISTRATION',
  payload: data,
})

export const addRegistrationItem = (data: any) => ({
  type: 'ADD_REGISTRATION_ITEM',
  payload: data,
})

export const getRegistration = () => async (dispatch: any) => {
  try {
    const {
      data: {data},
    } = await getRegistrationList({page: 1, limit: 100})
    dispatch(setRegistration(data))
  } catch (error) {}
}
