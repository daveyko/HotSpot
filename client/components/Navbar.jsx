import React from 'react'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Label} from 'react-bootstrap'
import {NavLink, Link} from 'react-router-dom'
import history from './../history'
import {setModal, removeModal, getMe, logout, setGraph, fetchClicks} from '../store'
import {connect} from 'react-redux'
import SearchQ from './Search.jsx'
import {resizeClicks} from '../store/clicks.js'
import HOCWrapper from './HOC/Wrapper.jsx'

function navbarInstance(props) {
	const {handleLogin, cart} = props

	const getCartData = () => {

		const quantity = Object.keys(cart)
			.reduce((acc, curr) => acc + cart[curr].quantity, 0)

		const totalPrice = Object.keys(cart)
			.map((product) => cart[product].price * cart[product].quantity)
			.reduce((acc, curr) => acc + curr, 0)
		return {quantity, totalPrice}
	}

	const cartData = getCartData()

	// const reposition = () => {
	// 	console.log('CALLED!')
	// 	let elementsHashArr = props.clicks.all.map((click) => {
	// 		return Number(click.element)
	// 	})

	// 	let filteredElementsHashArr = elementsHashArr.filter((item, pos) => elementsHashArr.indexOf(item) === pos)

	// 	for (let i = 0; i < filteredElementsHashArr.length; i++){

	// 		let clickedElementsArr = props.clicks.all.filter((click) => Number(click.element) === filteredElementsHashArr[i])

	// 		console.log('clickedElementsARR!', clickedElementsArr)
	// 		let baselineClick = clickedElementsArr.filter((click) => click.clientwidth === 1440)[0]

	// 		let baselineLeft = baselineClick.left

	// 		let baselineTop = baselineClick.top

	// 		let clicksToReposition = clickedElementsArr.filter((click) => click.clientwidth !== 1440).map((filteredClick) => {
	// 			return {
	// 				id: filteredClick.id,
	// 				x: filteredClick.x + (baselineLeft - filteredClick.left),
	// 				y: filteredClick.y - Math.abs(baselineTop - filteredClick.top),
	// 				element: filteredClick.element,
	// 				top: baselineTop,
	// 				left: baselineLeft,
	// 				clientwidth: filteredClick.clientwidth,
	// 				clientheight: filteredClick.clientheight,
	// 				resized: true
	// 			}
	// 		})
	// 		console.log('CLICKSTOREPO', clicksToReposition)
	// 		if(clicksToReposition.length){
	// 			props.handleResize(clicksToReposition)
	// 		}
	// 	}
	// }

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
					{props.user.isAdmin ? <NavItem eventKey={1} onClick={() => {history.push('/admin')}}>Admin View</NavItem>
						: '' }
					<NavDropdown eventKey={2} title="Options" id="basic-nav-dropdown">
						<MenuItem eventKey={3.1}>Settings</MenuItem>
						{props.user.id ?
							<IndexLinkContainer to ="/orders">
								<MenuItem eventKey={3.2}>Orders</MenuItem>
							</IndexLinkContainer>
							: ''}
						<MenuItem eventKey={3.3}>Reviews</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey={3.3}>Logout</MenuItem>
					</NavDropdown>
					<NavDropdown eventKey={2} title="Hot-Spot" id="basic-nav-dropdown">
						<MenuItem onClick={() => {
							props.handleScatter('Scatter')
							props.getClicks()
							history.push(`${window.location.pathname}/graph`)
						}} eventKey={3.1}>Scatter
						</MenuItem>
						<MenuItem onClick={() => {props.handleScatter('Heat')}} eventKey={3.3}>HeatMap</MenuItem>
						<MenuItem onClick={() => {props.handleScatter('Scroll')}} eventKey={3.3}>Scroll HeatMap</MenuItem>
					</NavDropdown>
					{props.user.id ?
						<NavItem eventKey={3} onClick={() => {props.handleLogOut()}} href="#">Logout</NavItem>
						:
						<NavItem eventKey={3} onClick={() => handleLogin('SIGN_IN')} href="#">Login</NavItem>}

					{props.user.id ?
						''
						:<NavItem eventKey={4} onClick={() => handleLogin('SIGN_UP')} href="#">Sign-Up</NavItem>
					}
					{/*// TODO: Increase size of shopping cart*/}
					<NavItem onClick={() => handleLogin('CART')}><Label className="black-label"><i className="fa fa-shopping-cart"></i> {cartData.quantity} ITEMS - ${cartData.totalPrice.toFixed(2)}</Label></NavItem>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}
//container
const mapStateToProps = (state) => {
	return {
		modals: state.modals,
		user: state.user,
		cart: state.cart,
		clicks: state.clicks
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
		},
		handleCartModal(modalType) {
			dispatch(setModal(modalType))
		},
		handleScatter(graph){
			dispatch(setGraph(graph))
		},
		handleResize(arr){
			dispatch(resizeClicks(arr))
		},
		getClicks(){
			dispatch(fetchClicks((window.location.pathname)))
		}
	}
}


const NavBarContainer = connect(mapStateToProps, mapDispatchToProps)(navbarInstance)
const WrappedNav = HOCWrapper('/api/clicks', 'lakers')(NavBarContainer)


export default WrappedNav
