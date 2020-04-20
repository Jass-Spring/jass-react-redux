import { INCREMENT, DECREMENT, ADD_MSG } from './action-types'

export const increment = (number) => ({ type: INCREMENT, data: number })

export const decrement = (number) => ({ type: DECREMENT, data: number })

export const addMsg = (msg) => ({ type: ADD_MSG, data: msg })
