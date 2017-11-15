import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import HeatMapConductor from '../Heatmap/HeatMapConductor.jsx'

const HOC = (apiRoute) => (WrappedComponent) => {
	return class HOC extends Component {
		constructor (props) {
			super(props)
			this.state = {
				graph: 'hide'
			}
			this.hashCode = this.hashCode.bind(this)
			this.getPosition = this.getPosition.bind(this)
			this.onClick = this.onClick.bind(this)
			this.showGraph = this.showGraph.bind(this)

			this.wrappedStyle = {
				position: 'relative'
			}
			this.wrapperStyle = {
				height: '100%',
				width: '100%',
				zIndex: '2',
				position: 'absolute',
				top: '0px',
				left: '0px'
			}
		}

		componentDidMount(){
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
				x: e.pageX,
				y: e.pageY,
				path: window.location.path,
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
		}

		showGraph(){
			this.setState({
				graph: 'Scatter'
			})
		}


		render(){

			return(
				this.state.graph === 'hide' ?
					<div onClick = {this.onClick}>
						<button onClick = {this.showGraph} style = {{zIndex: '5', position: 'absolute', float: 'right'}}>HotSpot</button>
						<WrappedComponent {...this.props}/>
					</div> :
					<div>
						<HeatMapConductor graphToShow = {this.state.graph} view = {this.state.graph} />
						<WrappedComponent {...this.props} />
					</div>
			)
		}
	}
}

export default HOC







