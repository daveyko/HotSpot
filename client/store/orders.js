import axios from 'axios'
import history from '../history'
import {createOrder, alertSuccessfulOrder, alertFailedOrder} from './orderStatus'

/**
 * ACTION TYPES
 */
const GET_ORDERS = 'GET_ORDERS'
const GET_SINGLE_ORDER = 'GET_SINGLE_ORDER'
const POST_ORDER = 'POST_ORDER'
const EDIT_ORDER = 'EDIT_ORDER'
const DELETE_ORDER = 'DELETE_ORDER'


/**
 * INITIAL STATE
 */
const orderState = []

/**
 * ACTION CREATORS
 */
const getOrders = orders => ({type: GET_ORDERS, orders})
const makeOrder = order => ({type: POST_ORDER, order})
const editOrderAction = order => ({type: EDIT_ORDER, order})
const deleteOrderAction = order => ({type: DELETE_ORDER, order})


/**
 * THUNK CREATORS
 */


export function fetchOrdersUser (userId) {

	return function thunk (dispatch) {
		return axios.get(`/api/orders/user/${userId}`)
			.then(res => res.data)
			.then(orders => {
				dispatch(getOrders(orders))
			})
	}
}

export function fetchSingleOrder (orderId) {

	return function thunk (dispatch) {
		return axios.get(`/api/orders/${orderId}`)
			.then(res => res.data)
			.then(order => {
				dispatch(getOrders(order))
			})
	}
}

export function fetchOrders () {

	return function thunk (dispatch) {
		return axios.get('/api/orders')
			.then(res => res.data)
			.then(orders => {
				dispatch(getOrders(orders))
			})
	}
}

//make a new function to send a req.body w/ order info to auto - emailing route

export function postOrderCheckout (order, productArray, reqBodyEmail) {
	return function thunk (dispatch) {
		return axios.post('/api/orders/admin', order)
			.then(res => res.data)
			.then(newOrder => {
				productArray.forEach(productIdAndQuantity => {
					let relationObject = {quantity: productIdAndQuantity.quantity, productId: productIdAndQuantity.id, orderId:newOrder.id}
					axios.post('/api/orderProducts', relationObject)
				})
				return newOrder
			})
			.then((newOrder) => {
				dispatch(makeOrder(newOrder))
			})
			.then(() => {
				axios.post('api/email', reqBodyEmail)
			})
	}
}

export function postOrder (order, productArray) {
	console.log('inside postorder', order, productArray)
	return function thunk (dispatch) {
		dispatch(createOrder())
		axios.post('/api/orders/admin', order)
			.then(res => res.data)
			.then(newOrder => {
				productArray.forEach(productIdAndQuantity => {
					let relationObject = {quantity: productIdAndQuantity.quantity, productId: productIdAndQuantity.id, orderId:newOrder.id}
					axios.post('/api/orderProducts', relationObject)
				})
				return newOrder
			})
			.then((newOrder) => {
				dispatch(alertSuccessfulOrder())
				dispatch(makeOrder(newOrder))
			})
			.catch((err) => {
				console.log(err)
				dispatch(alertFailedOrder())
			})
	}
}

export function editOrder (order) {
	return function thunk (dispatch) {
		return axios.put(`/api/orders/${order.id}`, order)
			.then(res => res.data)
			.then(targetOrder => {
				const action = editOrderAction(targetOrder)
				dispatch(action)
				history.push('/admin')
			})
	}
}

export function deleteOrder (order) {

	return function thunk (dispatch) {
		return axios.delete(`/api/orders/${order.id}`)
			.then(res => res.data)
			.then( () => {
				dispatch(deleteOrderAction(order))
				history.push('/admin')
			})
	}
}

/**
 * REDUCER
 */

export default function (state = orderState, action) {
	switch (action.type) {
	case GET_ORDERS:
		return action.orders
	case POST_ORDER:
		return state.concat(action.order)
	case EDIT_ORDER:
		return state.filter(order => Number(order.id) !== Number(action.order.id)).concat(action.order)
	case DELETE_ORDER:
		return state.filter(order => Number(order.id) !== Number(action.order.id))
	default:
		return state
	}
}
