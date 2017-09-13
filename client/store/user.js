import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultState = {
	users: []
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
export const getMe = () =>
	dispatch =>
		axios.get('/auth/me')
			.then(res =>
				dispatch(getUser(res.data || defaultState)))
			.catch(err => console.log(err))

export const auth = (email, password, method) =>
	dispatch =>
		axios.post(`/auth/${method}`, { email, password })
			.then(res => {
				dispatch(getUser(res.data))
				history.push('/home')
			})
			.catch(error =>
				dispatch(getUser({error})))

export const logout = () =>
	dispatch =>
		axios.post('/auth/logout')
			.then(res => {
				dispatch(removeUser())
				history.push('/login')
			})
			.catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = defaultState, action) {
	switch (action.type) {
	case GET_USER:
		return action.user
	case REMOVE_USER:
		return defaultUser
	default:
		return state
	}
}
