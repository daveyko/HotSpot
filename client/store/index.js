//index
import { composeWithDevTools } from 'redux-devtools-extension'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from './user'
import users from './users'
import products from './products'
import categories from './categories'
import modals from './modals'
import newUser from './newUser'
import newCategory from './newCategory'
import newProduct from './newProduct'
import cart from './cart'
import orders from './orders'
import searchProduct from './search'

const reducer = combineReducers({user, products, categories, users, newUser, newCategory, newProduct, searchProduct, modals, cart, orders})
const middleware = applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
const store = createStore(reducer, composeWithDevTools(middleware))

export default store
export * from './users'
export * from './search'
export * from './categories'
export * from './user'
export * from './products'
export * from './modals'
export * from './newUser'
export * from './newCategory'
export * from './newProduct'
export * from './cart'
export * from './orders'

