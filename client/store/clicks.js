import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CLICKS = 'GET_CLICKS'
const GET_TOP_CLICKS = 'GET_TOP_CLICKS'
const FILTER_CLICKS = 'FILTER_CLICKS'
const ADD_CLICK = 'ADD_CLICK'



/**
 * INITIAL STATE
 */
const clickState = {
	all: [],
	top: []
}

/**
 * ACTION CREATORS
 */
const getClicks = clicks => ({type: GET_CLICKS, clicks})
const getTopClicks = topClicks => ({type: GET_TOP_CLICKS, topClicks})
const filterClicks = filteredClicks => ({type: FILTER_CLICKS, filteredClicks})
const addClick = click => ({type: ADD_CLICK, click})



/**
 * THUNK CREATORS
 */

export function postClick (reqbody) {
	return function thunk (dispatch) {
		return axios.post('/api/clicks', reqbody)
			.then(res => res.data)
			.then(clicks => {
				dispatch(addClick(clicks))
			})
	}
}

export function fetchClicks (path) {

	return function thunk (dispatch) {
		return axios.get('/api/clicks')
			.then(res => res.data)
			.then(clicks => {
				let filtered = clicks.filter((click) => {
					return click.page === path
				})
				dispatch(getClicks(filtered))
			})
	}
}

export function fetchFilterClicks (urlArr) {

	return function thunk (dispatch) {
		return axios.get('/api/clicks')
			.then(res => res.data)
			.then(clicks => {
				let filtered = clicks.filter((click) => {
					return urlArr.includes(click.referrerSubstring)
				})
				dispatch(filterClicks(filtered))
			})
	}
}

export function fetchTopClicks () {

	return function thunk (dispatch) {
		return axios.get('/api/clicks/popularSites')
			.then(res => res.data)
			.then(clicks => {
				dispatch(getTopClicks(clicks))
			})
	}
}

export default function (state = clickState, action) {
	let newState = {...state}
	switch (action.type) {
	case GET_CLICKS:
		newState = {...state, all: action.clicks}
		return newState
	case GET_TOP_CLICKS:
		newState = {...state, top: action.topClicks}
		return newState
	case FILTER_CLICKS:
		newState = {...state, all: action.filteredClicks}
		return newState
	case ADD_CLICK:
		newState = {...state, all: state.all.concat(action.click)}
		return newState
	default:
		return state
	}
}
