import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Router} from 'react-router'
import {Route, Switch, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Main, Login, Signup, UserHome} from './components'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Admin from './components/Admin.jsx'
import Modal from './components/ModalConductor.jsx'
import AdminAddUser from './components/AdminAddUser.jsx'
import AdminAddCategory from './components/AdminAddCategory.jsx'
import AdminAddProduct from './components/AdminAddProduct.jsx'
import AdminAddOrder from './components/AdminAddOrder.jsx'
import EditUser from './components/EditUser.jsx'
import EditCategory from './components/EditCategory.jsx'
import EditProduct from './components/EditProduct.jsx'
import EditOrder from './components/EditOrder.jsx'
import SingleCategory from './components/SingleCategory.jsx'
import SingleProductView from './components/SingleProductView.jsx'
import ReviewProduct from './components/ReviewProduct.jsx'
import UserOrders from './components/UserOrders.jsx'
import CheckoutView from './components/CheckoutView.jsx'
import HeatMapConductor from './components/Heatmap/HeatMapConductor.jsx'
import {getMe, fetchProducts, fetchCategories, fetchCartSession, fetchClicks, fetchTopClicks, getHistory, addHistory, postClick, postScrolls, fetchScrolls} from './store'
import ReactDOM from 'react-dom'


/**
 * COMPONENT
 */
class Routes extends Component {

	constructor (props) {
		super(props)
		this.handleScroll = this.handleScroll.bind(this)
		this.addScrollListener = this.addScrollListener.bind(this)
		this.hashCode = this.hashCode.bind(this)
		this.state = {
			anchor: 0
		}
	}

	hashCode(str){
		var hash = 0, i, chr
		if (str.length === 0) return hash
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i)
			hash  = ((hash << 5) - hash) + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}

	handleScroll(){
		if (this.props.graph === ''){
			let max = this.state.anchor
			let offset = window.pageYOffset
			if (offset - max >= 200) {
				this.setState({
					anchor: this.state.anchor + 200
				}, () => {
					this.props.postScrollsHandler({y: (this.state.anchor) + window.innerHeight})
				})
			} else if (max - offset >= 200){
				this.setState({
					anchor: this.state.anchor - 200
				}, () => {
					this.props.postScrollsHandler({y:this.state.anchor})
				})
			}
		}
	}

	componentDidMount () {

		this.props.loadInitialData()
		this.addScrollListener()
		let height = window.innerHeight
		let scrollBar = [Math.round(height), Math.round((height/4)*3), Math.round((height/4)*2), Math.round(height/4)]
		scrollBar.forEach((e) => {
			this.props.postScrollsHandler({y: e})
		})
	}

	addScrollListener(){
		window.addEventListener('scroll', () => {
			this.handleScroll()
		})
	}

	render () {
		const {isLoggedIn, currentModal, graph} = this.props

		return (
			<Router history={history}>
				<div>
					<div id = "parent" onClick = {(e) => {
						if(this.props.graph === ''){
							let domRect = e.target.getBoundingClientRect()
							this.props.clickHandler(window.location.pathname)
							console.log('HASH', this.hashCode(e.target.outerHTML))
							let reqbody = {
								x: e.pageX,
								y: e.pageY,
								path: this.props.history.pop(),
								element: this.hashCode(e.target.outerHTML),
								top: e.target.getBoundingClientRect().top,
								left: e.target.getBoundingClientRect().left
							}

							this.props.postClickHandler(reqbody)
						}

					}}>
						<Navbar cart={this.props.cart}/>
						<Modal currentModal = {currentModal} />
						<HeatMapConductor view = {graph} />
						<Switch>
							<Route exact path="/home" render={(props) => {
								this.props.routeHandler(window.location.pathname)
								return <Home {...props}/>
							}} />
							<Route exact path="/admin" component={Admin}  />
							<Route exact path="/admin/newUser" component={AdminAddUser} />
							<Route exact path="/admin/newCategory" component={AdminAddCategory} />
							<Route exact path="/admin/newProduct" component={AdminAddProduct} />
							<Route exact path="/admin/newOrder" component={AdminAddOrder} />
							<Route exact path="/products/:id" render={(props) => {
								this.props.routeHandler(window.location.pathname)
								return <SingleProductView {...props} />
							}} />
							<Route exact path="/products/review/:id" component={ReviewProduct} />
							<Route exact path="/orders" component={UserOrders} />
							<Route path="/admin/edit/user/:id" component={EditUser} />
							<Route path="/admin/edit/category/:id" component={EditCategory} />
							<Route path="/admin/edit/product/:id" component={EditProduct} />
							<Route path="/admin/edit/order/:id" component={EditOrder} />
							<Route path="/category/:id" component={SingleCategory} />
							<Route path="/checkout" component={CheckoutView} />
							<Redirect to="/home" />
						</Switch>
					</div>
				</div>
			</Router>
		)
	}
}

/**
 * CONTAINER
 */
const mapState = (state) => {
	return {
		// Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
		// Otherwise, state.user will be an empty object, and state.user.id will be falsey
		isLoggedIn: !!state.user.id,
		currentModal: state.modals,
		cart: state.cart,
		graph: state.graph,
		history: state.history

	}
}

const mapDispatch = (dispatch) => {
	return {
		loadInitialData () {
			dispatch(getMe())
			dispatch(fetchProducts())
			dispatch(fetchCategories())
			dispatch(fetchCartSession())
			dispatch(fetchClicks(window.location.pathname))
			dispatch(fetchTopClicks())
			dispatch(getHistory())
			dispatch(fetchScrolls())
		},
		routeHandler(path){
			dispatch(fetchClicks(path))
		},
		clickHandler (url) {
			dispatch(addHistory(url))
		},
		postClickHandler(reqbody){
			dispatch(postClick(reqbody))
		},
		postScrollsHandler(reqbody){
			dispatch(postScrolls(reqbody))
		}
	}
}

export default connect(mapState, mapDispatch)(Routes)

/**
 * PROP TYPES
 */
Routes.propTypes = {
	loadInitialData: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired
}
