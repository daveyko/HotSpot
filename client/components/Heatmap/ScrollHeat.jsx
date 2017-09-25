import React from 'react'
import {connect} from 'react-redux'
import Chart from './Chart.js'
import {fetchFilterClicks} from '../../store'
const d3 = require('d3')


class Scroll extends React.Component {
	constructor (props){
		super(props)
		this.letsGo = this.letsGo.bind(this)
		this.state = {
			scaledData: []
		}
	}


	componentWillReceiveProps(nextProps){
		if (nextProps.height === this.props.height){
			this.letsGo()
		}
	}

	letsGo (){
		let y = 0
		let res = []
		let reduced = {count: 0}
		while (y < this.props.height) {
			let square1 = this.props.scrolls.filter((scroll) => {
				return (scroll.y >= y && scroll.y <= y + 200)
			})
			if (square1.length > 1){
				reduced = square1.reduce((a,b) => {
					return {count: a.count + b.count}
				})
			} else if (square1.length === 1){
				reduced = {count: square1[0].count}
			} else {
				reduced = {count: 0}
			}
			res.push(reduced)
			square1 = []
			reduced = {count: 0}
			y += 200
		}
		this.setState({
			scaledData: res
		})
	}


	render(){


		let yScale = d3.scaleLinear()
			.range([0,this.props.height])
			.domain(d3.extent(this.props.scrolls, function(d) { return d.y }))


		let min = d3.min(this.state.scaledData, (d) => {
			return d.count})
		let max = d3.max(this.state.scaledData, (d) =>
		{return d.count})
		let domainRange = _.range(min, max, (max - min) / 7)

		let colorScale = d3.scaleThreshold()
			.domain(domainRange)
			.range(['#66ff00', '#80d408', '#8cbf0d', '#a69515', '#b3801a', '#cc5522', '#e62b2b', '#ff0033'])

		let gridArr = []
		let counter = 0
		for (let y = 0; y < this.props.height / 200; y ++) {
			gridArr.push(
				<g key = {counter}>
					<rect
						x = {0}
						y = {y*200}
						width = {window.innerWidth}
						height = {200}
						fill = {colorScale(this.state.scaledData[counter].count)}
						stroke = "white"
						strokeWidth = "1"
					/>
				</g>
			)
			counter ++
		}


		// let grid = this.state.scaledData.map((square, i) => {
		// 	return (
		// 		<g key = {i}>
		// 			<rect
		// 				x = {i*40}
		// 				y = {0}
		// 				width = {40}
		// 				height = {40}
		// 				fill = {colorScale(square.count)}
		// 			/>
		// 		</g>
		// 	)
		// })


		return (
			<g className = "main-svg">
				{gridArr}
		  </g>
		)
	}
}

export default connect(state => state)(Scroll)

