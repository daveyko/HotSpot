import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Router} from 'react-router'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Grid, Row} from 'react-bootstrap'
import PropTypes from 'prop-types'
import history from './history'
import {Main, Login, Signup, UserHome} from './components'
import Navbar from './components/Navbar.jsx'
import Categories from './components/Categories.jsx'
import Home from './components/Home.jsx'
import Admin from './components/Admin.jsx'
import store, {getMe, fetchProducts, fetchCategories} from './store'


/**
 * COMPONENT
 */
class Routes extends Component {
	componentDidMount () {
		this.props.loadInitialData()
	}

	render () {
		const {isLoggedIn} = this.props

		return (
			<Router history={history}>
				<div>
					<Navbar />

					<Switch>
						<Route exact path="/home" component={Home} />
						<Route exact path="/admin" component={Admin} />
						<Redirect to="/home" />
					</Switch>

					<Row>
						<Categories />
						<Switch>
							<Route exact path="/home" component={Home} />
							<Route exact path="/admin" component={Admin} />
							<Redirect to="/home" />
						</Switch>
					</Row>
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
		isLoggedIn: !!state.user.id
	}
}

const mapDispatch = (dispatch) => {
	return {
		loadInitialData () {
			dispatch(getMe())
			dispatch(fetchProducts())
			dispatch(fetchCategories())
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
