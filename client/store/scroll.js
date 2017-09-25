import axios from 'axios'

const GET_SCROLLS = 'GET_SCROLLS'
const INITIALIZE = 'INITIALIZE'
const ADD_SCROLL = 'ADD_SCROLL'

const scrollState = []


const getScrolls = scrolls => ({type: GET_SCROLLS, scrolls})
const addScroll = scroll => ({type: ADD_SCROLL, scroll})

export function postScrolls(reqbody) {
	return function thunk (dispatch) {
		return axios.post('/api/scroll', reqbody)
			.then(res => res.data)
			.then(scrolls => {
				dispatch(addScroll(scrolls))
			})
	}
}

export function fetchScrolls () {
	return function thunk (dispatch) {
		return axios.get('/api/scroll')
			.then(res => res.data)
			.then(scrolls => {
				dispatch(getScrolls(scrolls))
			})
	}
}


export default function (state = scrollState, action) {
	let newState  = [...state]
	switch (action.type) {
	case GET_SCROLLS:
		return action.scrolls
	case ADD_SCROLL:
		newState = state.concat(action.scroll)
		return newState
	default:
		return state
	}
}
