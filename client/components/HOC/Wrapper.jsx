import React, {Component} from 'react'
import axios from 'axios'
import Chart from './HOCChart.jsx'
import ModalConductor from './HOCModalConductor.jsx'
import {DropdownButton, MenuItem } from 'react-bootstrap'

const HOCWrapper  = (apiRoute) => (WrappedComponent) => {
	return class HOC extends Component {
		constructor (props) {
			super(props)
			this.state = {
				graph: 'Hide',
				clicks: [],
				screenSize: 0,
				sessionStorageKey: 'session',
				compheight: 0,
				compwidth:0,
				modal: false,
				button: false
			}
			this.hashCode = this.hashCode.bind(this)
			this.getPosition = this.getPosition.bind(this)
			this.onClick = this.onClick.bind(this)
			this.toggleGraph = this.toggleGraph.bind(this)
			this.updateScreenSize = this.updateScreenSize.bind(this)
			this.closeGraph = this.closeGraph.bind(this)
			this.toggleModal = this.toggleModal.bind(this)
			this.toggleButton = this.toggleButton.bind(this)
		}

		toggleModal(){
			this.setState({
				modal: this.state.modal ? false : true
			})
		}

		toggleButton(){
			this.setState({
				button: this.state.button ? false: true
			})
		}


		updateScreenSize(width, compheight, compwidth){

			let cachedClicks = sessionStorage.getItem(this.state.sessionStorageKey)
			let parsedClicks = JSON.parse(cachedClicks)

			let filteredClicks = parsedClicks.filter((click) => click.clientwidth === width)
			this.setState({
				clicks: filteredClicks,
				compheight,
				compwidth,
				screenSize: width
			})

		}

		componentDidMount() {

			sessionStorage.clear()

			window.viewHeatMap = () => {
				this.setState({
					button: true
				})
			}

			axios.get(apiRoute)
				.then((clicks => {
					sessionStorage.setItem(this.state.sessionStorageKey, JSON.stringify(clicks.data))
					return clicks.data
				}))
				.then((clicksOnMount) => {
					this.setState({
						clicks: clicksOnMount,
					})
				})
				.catch(console.log)
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

		getPosition(element){

			var xPosition = 0
			var yPosition = 0

			while(element) {
				xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
				yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
				element = element.offsetParent
			}
			return { x: xPosition, y: yPosition }
		}


		onClick(e){

			let adjustedX = this.getPosition(e.target).x
			let adjustedY = this.getPosition(e.target).y

			let reqbody = {
				x: e.pageX + this.container.getBoundingClientRect().left,
				y: e.pageY - this.container.getBoundingClientRect().top,
				path: window.location.pathname,
				element: this.hashCode(e.target.outerHTML),
				top: adjustedY,
				left: adjustedX,
				clientwidth: window.innerWidth,
				clientheight: window.innerHeight,
				resized: false
			}
			this.postClick(reqbody)
		}

		postClick(body){

			axios.post(apiRoute, body)
				.then(() => {
					let currSession = JSON.parse(sessionStorage.getItem(this.state.sessionStorageKey))
					currSession.push(body)
					sessionStorage.setItem(this.state.sessionStorageKey, JSON.stringify(currSession))
				})
		}

		toggleGraph(e){
			if (e === 'exit'){
				this.setState({
					button: false
				})
			} else {
				axios.get(apiRoute)
					.then((clicks => {
						sessionStorage.setItem(this.state.sessionStorageKey, JSON.stringify(clicks.data))
						return clicks.data
					}))
					.then((clicksOnMount) => {
						let filteredClicks = clicksOnMount.filter(click => click.clientwidth === window.innerWidth && click.page === window.location.pathname)
						this.setState({
							clicks: filteredClicks,
							graph: e
						})
					})
					.catch(console.log)
			}
		}

		closeGraph(){
			this.setState({
				graph: 'Hide'
			})
		}

		render(){

			return(
				this.state.graph === 'Hide' ?
					<div onClick = {!this.state.button ? this.onClick : null} className = "flex-container" ref = {container => this.container = container}>
						<ModalConductor modal = {this.state.modal} toggleModal = {this.toggleModal} toggleButton = {this.toggleButton} />
						{this.state.button ? 	<DropdownButton id = "1" style = {{zIndex: '5', position: 'absolute', top: '0px', left: '0px'}} title = {this.state.graph === 'Hide' ? 'HS' : this.state.graph} onSelect = {this.toggleGraph}>
							<MenuItem eventKey = "Scatter">Scatter</MenuItem>
							<MenuItem eventKey = "HeatMap">HeatMap</MenuItem>
							<MenuItem eventKey = "exit">Exit</MenuItem>
						</DropdownButton> : null }
						<WrappedComponent {...this.props}/>
					</div> :
					<div className = "parent" onClick = {this.closeGraph}>
						<Chart height = {this.state.compheight} width = {this.state.compwidth} clicks = {this.state.clicks} filterClicks = {this.updateScreenSize} graph = {this.state.graph} />
						<WrappedComponent {...this.props} />
					</div>
			)
		}
	}
}

export default HOCWrapper







