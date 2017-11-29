import React from 'react'
import {connect} from 'react-redux'
import Tooltip from './ScatterTool.jsx'
import {resizeClicks} from '../../store/clicks.js'
const d3  = require('d3')

class Scatterplot extends React.Component {
	constructor (props) {
		super(props)
		this.showToolTip = this.showToolTip.bind(this)
		this.hideToolTip = this.hideToolTip.bind(this)
		// this.hashCode = this.hashCode.bind(this)
		// this.repositionCoordinates = this.repositionCoordinates.bind(this)
		this.reposition = this.reposition.bind(this)
		this.state = {
			tooltip: {
				visibility: false,
				count: 0,
				url: '',
				x: 0,
				y: 0
			}
		}
	}

	componentDidMount(){
		// var prevWidth = 0
		// const onLoad = () => {
		// 	prevWidth = window.innerWidth
		// }
		// window.addEventListener('resize', () => {
		// 	var currWidth = window.innerWidth
		// 	prevWidth = currWidth
		// 	let topListItem = document.getElementsByTagName('li')[0].getBoundingClientRect()
		// 	console.log('TOPLISTITEMDELTA', topListItem.top, topListItem.left)
		// })
		// onLoad()
		this.reposition()
		// window.addEventListener('resize', this.repositionCoordinates)

	}

	reposition(){

		let elementsHashArr = this.props.clicks.all.map((click) => {
			return Number(click.element)
		})

		let filteredElementsHashArr = elementsHashArr.filter((item, pos) => elementsHashArr.indexOf(item) === pos)

		for (let i = 0; i < filteredElementsHashArr.length; i++){

			let clickedElementsArr = this.props.clicks.all.filter((click) => Number(click.element) === filteredElementsHashArr[i])

			let baselineClick = clickedElementsArr.filter((click) => click.clientwidth === 1440)[0]

			let baselineLeft = baselineClick.left

			let baselineTop = baselineClick.top

			let clicksToReposition = clickedElementsArr.filter((click) => click.clientwidth !== 1440).map((filteredClick) => {
				return {
					id: filteredClick.id,
					x: filteredClick.x + (baselineLeft - filteredClick.left),
					y: filteredClick.y - Math.abs(baselineTop - filteredClick.top),
					element: filteredClick.element,
					top: baselineTop,
					left: baselineLeft,
					clientwidth: filteredClick.clientwidth
				}
			})
			console.log('CLICKSTOREPO', clicksToReposition)
			if (clicksToReposition.length){
				this.props.handleResize(clicksToReposition)
			}
		}
	}

	// hashCode(str){
	// 	var hash = 0, i, chr
	// 	if (str.length === 0) return hash
	// 	for (i = 0; i < str.length; i++) {
	// 		chr   = str.charCodeAt(i)
	// 		hash  = ((hash << 5) - hash) + chr
	// 		hash |= 0 // Convert to 32bit integer
	// 	}
	// 	return hash
	// }

	// repositionCoordinates(){
	// 	let hash
	// 	let newClicksArr = []
	// 	let allEl = document.getElementsByTagName('*')
	// 	for (let i = 0; i < allEl.length; i++){
	// 		hash = this.hashCode(allEl[i].outerHTML)
	// 		let matchingArr = this.props.clicks.all.filter((obj) => Number(obj.element) === hash)
	// 		if (matchingArr.length){
	// 			matchingArr.forEach((obj) => {
	// 				if (allEl[i].getBoundingClientRect().left){
	// 					obj.x = obj.x*(allEl[i].getBoundingClientRect().left/obj.left)
	// 					obj.left = allEl[i].getBoundingClientRect().left
	// 				}
	// 				if (allEl[i].getBoundingClientRect().top){
	// 					obj.y = obj.y*(allEl[i].getBoundingClientRect().top/obj.top)
	// 					obj.top = allEl[i].getBoundingClientRect().top
	// 				}
	// 				newClicksArr.push(obj)
	// 			})
	// 		}
	// 	}
	// 	this.props.handleResize(newClicksArr)
	// }


	showToolTip(e){
		e.target.setAttribute('stroke', 'white')
		e.target.setAttribute('stroke-width', '4')
		this.setState({
			tooltip: {
				visibility: true,
				count: e.target.getAttribute('data-count'),
				url: e.target.getAttribute('data-url'),
				x: e.target.getAttribute('cx'),
				y: e.target.getAttribute('cy')
			}
		})
	}

	hideToolTip(e){
		e.target.setAttribute('stroke', '')
		this.setState({
			tooltip: false
		})
	}
	render(){
		let xScale = d3.scaleLinear()
			.range([0,window.innerWidth])
			.domain(d3.extent(this.props.clicks.all, function(d) { return d.x }))

		let yScale = d3.scaleLinear()
			.range([window.innerHeight, 0])
			.domain(d3.extent(this.props.clicks.all, function(d) { return d.y }))

		let top10 = []
		if (this.props.clicks.top.length >= 10){
			for (let i = 0; i<10; i++){
				top10.push(this.props.clicks.top[i].referrerSubstring)
			}
		}

		let color = d3.scaleOrdinal(d3.schemeCategory10)
		let circles = this.props.clicks.all.map((datapoint, i) => {

			return(
				<g key = {i}>
					<circle
						cx = {datapoint.x}
						cy = {datapoint.y}
						r = {5}
						fill = {top10.includes(datapoint.referrerSubstring) ? color(top10.indexOf(datapoint.referrerSubstring)) : 'black' }
						onMouseOver = {this.showToolTip}
						onMouseOut = {this.hideToolTip}
						data-count = {datapoint.count}
						data-url = {datapoint.referrerSubstring}
						data-id = {datapoint.id}
					/>
				</g>

			)

		} )
		return(
			<g className = "main-svg">
				{circles}
				<Tooltip data = {this.state.tooltip} />
			</g>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		handleResize(arr){
			dispatch(resizeClicks(arr))
		}
	}
}
export default connect(state => state, mapDispatchToProps)(Scatterplot)
