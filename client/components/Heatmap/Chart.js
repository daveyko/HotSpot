import React from 'react'
import ReactDOM from 'react-dom'
import ChartContainer from './ChartContainer.jsx'
import Scatter from './Scatterplot.jsx'
import {Popover, OverlayTrigger, Button} from 'react-bootstrap'
import {fetchFilterClicks, removeGraph } from '../../store'
import {connect} from 'react-redux'
import Heat from './Heat.jsx'
import ScrollHeat from './ScrollHeat.jsx'
const d3 = require('d3')


class Chart extends React.Component {
	constructor (props){
		super(props)
		// this.convertToSVG = this.convertToSVG.bind(this)
		this.onRender = this.onRender.bind(this)
		this.state = {
			height: 0
		}
	}

	componentDidMount(){
	// this.convertToSVG()
	// let node = ReactDOM.findDOMNode(this)
	// const size = node.getElementsByTagName('svg')[0].getBoundingClientRect()
		this.onRender()
	}

	onRender(){
		this.setState({
			height: document.getElementsByTagName('svg')[0].clientHeight
		})
	}

	// convertToSVG(){
	// 	let node = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0]
	// 	let newData = this.props.clicks.all.map((dataPoint) => {
	// 		let pt = node.createSVGPoint()
	// 		pt.x = dataPoint.x
	// 		pt.y = dataPoint.y
	// 		let svgP = pt.matrixTransform(node.getScreenCTM().inverse())
	// 		dataPoint.x = svgP.x
	// 		dataPoint.y = svgP.y
	// 		return dataPoint
	// 	})
	// 	this.setState({newData: newData})
	// }

	render(){
		// let svgHeight
		// if (document.getElementsByTagName('svg')[0]){
		// 	svgHeight = document.getElementsByTagName('svg')[0].clientHeight
		// 	this.setState({height: svgHeight})
		// }


		if (this.props.graph === 'Scatter') {
			return (

				<div className = "main-svg" onClick = {() => {
					this.props.handleClick()}}>
					{/* <svg preserveAspectRatio = "xMinYMin meet" viewBox = {`0 0 ${document.body.clientWidth} ${document.body.scrollHeight}`} className = "svg-content-responsive" > */}
					<svg width = {this.props.parentWidth || '100%'} height = '100%'>
						<Scatter width = {this.props.parentWidth || 1440} height = {this.state.height} />
					</svg>
					{/* </svg> */}
				</div>

			)
		} else {
			return (

				<div className = "svg-container" onClick = {() => {
					this.props.handleClick()}}>
					<svg className = "svg-content-responsive" width = {this.props.parentWidth || '100%'}
						height = '100%' >
						{this.props.graph === 'Heat' ? <Heat  height = {this.state.height} width = {this.props.parentWidth || 1440} /> : <ScrollHeat height = {this.state.height} width = {this.props.parentWidth || 1440} /> }
					</svg>
				</div>

			)

		}

	}

}

const mapDispatchToProps = (dispatch) => {
	return {
		handleClick(){
			dispatch(removeGraph())
		}
	}
}


export default connect(state => state, mapDispatchToProps)(Chart)

