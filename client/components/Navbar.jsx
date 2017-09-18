import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import history from './../history'
import store from '../store/index.js'
import {setModal, removeModal, getMe, logout} from '../store'
import {connect} from 'react-redux'
import SearchQ from './Search.jsx'

function navbarInstance(props) {

	const {handleLogin} = props
	console.log(props.search)
	return (
		<Navbar inverse collapseOnSelect>
			<Navbar.Header>
				<Navbar.Brand>
					<NavLink to="/home">Developer Accessories</NavLink>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>
					<SearchQ />
				</Nav>
				<Nav pullRight>
					<NavItem eventKey={1} onClick={() => {history.push('/admin')}}>Admin View</NavItem>
					<NavDropdown eventKey={2} title="Options" id="basic-nav-dropdown">
						<MenuItem eventKey={3.1}>Settings</MenuItem>
						<MenuItem eventKey={3.2}>Orders</MenuItem>
						<MenuItem eventKey={3.3}>Reviews</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey={3.3}>Logout</MenuItem>
					</NavDropdown>

					{props.user.id ?
						<NavItem eventKey={3} onClick={() => {props.handleLogOut()}} href="#">Logout</NavItem>

						: <NavItem eventKey={3} onClick={() => handleLogin('SIGN_IN')} href="#">Login</NavItem>}
					<NavItem eventKey={4} onClick={() => handleLogin('SIGN_UP')} href="#">Sign-Up</NavItem>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}
//container
const mapStateToProps = (state) => {
	return {
		modals: state.modals,
		user: state.user
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		handleLogin (modalType) {
			dispatch(setModal(modalType))
		},
		checkAuth(){
			dispatch(getMe())
		},
		handleLogOut(){
			dispatch(logout())
		}
	}
}

const NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(navbarInstance)

export default NavBarContainer
