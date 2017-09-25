import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_HISTORY = 'GET_HISTORY'
const ADD_HISTORY = 'ADD_HISTORY'



/**
 * INITIAL STATE
 */
const history = []

/**
 * ACTION CREATORS
 */
export const getHistory = () => ({type: GET_HISTORY})
export const addHistory = url => ({type: ADD_HISTORY, url})



/**
 * THUNK CREATORS
 */


export default function (state = history, action) {
	switch (action.type) {
	case GET_HISTORY:
		return state
	case ADD_HISTORY:
		return state.concat(action.url)
	default:
		return state
	}
}
