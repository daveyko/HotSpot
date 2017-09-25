import axios from 'axios'

const SET_GRAPH = 'SET_GRAPH'
const REMOVE_GRAPH = 'REMOVE_GRAPH'

const currentGraph = ''

export const setGraph = graph => ({type: SET_GRAPH, graph})
export const removeGraph = () => ({type: REMOVE_GRAPH})


export default function (state = currentGraph, action) {
	switch (action.type) {
	case SET_GRAPH:
		return action.graph
	case REMOVE_GRAPH:
		return ''
	default:
		return state
	}
}





