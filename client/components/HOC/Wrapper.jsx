import React, {Component} from 'react'
import axios from 'axios'
import Chart from './HOCChart.jsx'
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
				button: false
			}

			this.onClick = this.onClick.bind(this)
			this.toggleGraph = this.toggleGraph.bind(this)
			this.updateScreenSize = this.updateScreenSize.bind(this)
			this.closeGraph = this.closeGraph.bind(this)
			this.toggleButton = this.toggleButton.bind(this)
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

		onClick(e){

			let reqbody = {
				x: e.pageX + this.container.getBoundingClientRect().left,
				y: e.pageY - this.container.getBoundingClientRect().top,
				clientwidth: window.innerWidth,
				clientheight: window.innerHeight,
				referrer: document.referrer,
				page: window.location.pathname,
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
				let clicks = JSON.parse(sessionStorage.getItem(this.state.sessionStorageKey))
				console.log('clicks!', clicks)
				let filteredClicks = clicks.filter(click => click.clientwidth === window.innerWidth && click.page === window.location.pathname)
				this.setState({
					clicks: filteredClicks,
					graph: e
				})
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
						{this.state.button ? 	<DropdownButton id = "1" style = {{zIndex: '5', position: 'absolute', top: '0px', left: '0px'}} title = {this.state.graph === 'Hide' ? 'HS' : this.state.graph} onSelect = {this.toggleGraph}>
							<MenuItem eventKey = "Scatter">Scatter</MenuItem>
							<MenuItem eventKey = "HeatMap">HeatMap</MenuItem>
							<MenuItem eventKey = "exit">Exit</MenuItem>
						</DropdownButton> : null }
						<WrappedComponent {...this.props}/>
					</div> :
					<div className = "parent" onClick = {this.closeGraph}>
						<Chart clicks = {this.state.clicks} filterClicks = {this.updateScreenSize} graph = {this.state.graph} />
						<WrappedComponent {...this.props} />
					</div>
			)
		}
	}
}

export default HOCWrapper







