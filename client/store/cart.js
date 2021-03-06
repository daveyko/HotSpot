import axios from 'axios'
/**
 * ACTION TYPES
 */
const ADD_TO_CART = 'ADD_TO_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const UPDATE_CART = 'UPDATE_CART'
const LOAD_CART_FROM_SESSION = 'LOAD_CART_FROM_SESSION'
const RESET_CART = 'RESET_CART'

/**
 * INITIAL STATE
 */

const cartState = {}

/**
 * ACTION CREATORS
 */

export const addToCart = (product, quantity) => ({type: ADD_TO_CART, product, quantity})
export const removeFromCart = (product) => ({type: REMOVE_FROM_CART, product})
export const updateCart = (product, quantity) => ({type: UPDATE_CART, product, quantity})
export const loadSessionCart = (cart) => ({type: LOAD_CART_FROM_SESSION, cart})
export const resetCart = () => ({type: RESET_CART})

/**
 * REDUCER
 */


export default function (state = cartState, action) {
	let newState = {...state}
	switch (action.type) {
	case ADD_TO_CART:
		const productKey = action.product.id
		var priorQuantity
		if (state.hasOwnProperty(productKey)) {
			priorQuantity = state[productKey].quantity
		} else {
			priorQuantity = 0
		}
		const cartObject =
			{
				name: action.product.name,
				quantity: priorQuantity + action.quantity,
				price: action.product.price,
				imageUrl: action.product.imageUrl,

			}
		newState[action.product.id] = cartObject
		return newState
		//return {...state, ...action.product, ...{quantity: action.quantity}}
	case REMOVE_FROM_CART:
		// TODO: return new state with deleted product without mutating
		delete newState[action.product.id]
		return newState
		// 	return {...state, ...action.product.id}
	case UPDATE_CART:
		newState[action.product.id].quantity = action.quantity
		return newState
	case LOAD_CART_FROM_SESSION:
		return action.cart
	case RESET_CART:
		return cartState
	default:
		return state
	}
}

// export const postCartSession = (cart) => {
// 	return function() {
// 		axios.post('/api/cart', cart)
// 			.catch(console.error)
// 	}
// }

export const fetchCartSession = () => {
	return function(dispatch) {
		axios.get('/api/cart')
			.then((response) => {
				dispatch(loadSessionCart(response.data))
			})
			.catch(console.error)
	}
}




