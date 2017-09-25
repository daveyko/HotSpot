import React from 'react'
import {connect} from 'react-redux'
import ResponsiveWrapper from './ChartContainer.jsx'
import Tooltip from './HeatTool.jsx'
const _ = require('lodash')
const d3 = require('d3')


class Heat extends React.Component {
	constructor (props){
		super(props)
		this.letsGo = this.letsGo.bind(this)
		this.showToolTip = this.showToolTip.bind(this)
		this.hideToolTip = this.hideToolTip.bind(this)
		this.state = {
			scaledData: [],
			tooltip: {
				visibility: false,
				percent: 0,
				x: 0,
				y: 0
			}
		}
	}


	componentWillReceiveProps(nextProps){

		if(nextProps.height === this.props.height){
			this.letsGo()
		}
	}

	showToolTip(e){
		e.target.setAttribute('stroke', 'white')
		e.target.setAttribute('stroke-width', '3')
		this.setState({
			tooltip: {
				visibility: true,
				percent: e.target.getAttribute('data-percent'),
				x: e.target.getAttribute('x'),
				y: e.target.getAttribute('y')
			}
		})
	}

	hideToolTip(e){
		e.target.setAttribute('stroke', 'white')
		e.target.setAttribute('stroke-width', '1')
		this.setState({
			tooltip: false
		})
	}

	letsGo (){
		let x = 0
		let y = 40
		let res = []
		let reduced = {count: 0}
		while (y < this.props.height) {
			while ( x < window.innerWidth) {
				let square1 = this.props.clicks.all.filter((click) => {
					return (click.x >= x && click.x <= x + 40) && (click.y >= y-40 && click.y <= y)
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
				x += 40
			}
			x = 0
			y += 40
		}
		this.setState({
			scaledData: res
		})
	}


	render(){



		// let xScale = d3.scaleLinear()
		// 	.range([0,window.innerWidth])
		// 	.domain(d3.extent(this.props.clicks.all, function(d) { return d.x }))

		let xScale = d3.scaleLinear()
			.range([0,window.innerWidth])
			.domain(d3.extent(this.props.clicks.all, function(d) { return d.x }))


		let yScale = d3.scaleLinear()
			.range([0,this.props.height])
			.domain(d3.extent(this.props.clicks.all, function(d) { return d.y }))

		// let rawData = this.props.clicks.all.map((click) => {
		// 	click.x = Math.floor(xScale(click.x))
		// 	click.y = Math.floor(yScale(click.y))
		// 	return click
		// })

		let min = d3.min(this.state.scaledData, (d) => {
			return d.count})
		let max = d3.max(this.state.scaledData, (d) =>
		{return d.count})
		let domainRange = _.range(min, max, (max - min) / 7)

		let colorScale = d3.scaleThreshold()
			.domain(domainRange)
			.range(['#66ff00', '#80d408', '#8cbf0d', '#a69515', '#b3801a', '#cc5522', '#e62b2b', '#ff0033'])

		// let grid = this.props.data.map((click, i) =>{
		// 	let x = xScale(click.x)
		// 	let y = click.y
		// 	let width = 60
		// 	let height = 60
		// 	return (
		// 		<g key = {i}>
		// 			<rect
		// 				x = {x}
		// 				y = {y}
		// 				width = {40}
		// 				height = {40}
		// 				fill = {colorScale(click.count)}
		// 			/>
		// 		</g>
		// 	)
		// })

		// let groupedDataX = d3.nest()
		// 	.key((d) => {
		// 		return d.x
		// 	})
		// 	.entries(rawData)


		// let groupedDataY = d3.nest()
		// 	.key((d) => {
		// 		return d.y
		// 	})
		// 	.entries(rawData)

		// let groupedData = rawData.filter((click) => {
		// 	let xRange = _.range(click.x - 2, click.x + 2)
		// 	let yRange = _.range(click.y - 2, click.y + 2)
		// 	let found = xRange.some(i=>yRange.includes(i))
		// 	return found

		// x = {x*(window.innerWidth / 36)}
		// 						y = {y*(window.innerWidth / 36)}
		// 						width = {window.innerWidth / 36}
		// 						height = {window.innerWidth / 36}

		// })
		let sum = d3.sum(this.state.scaledData, (d) => {return d.count})
		console.log('SUM', sum)
		let gridArr = []
		if(this.state.scaledData.length){
			let counter = 0
			for (let y = 0; y < Math.floor((this.props.height / 40)) ; y ++) {
				for (let x = 0; x < Math.floor((window.innerWidth / 40)) ; x ++ ){
					gridArr.push(
						<g key = {counter}>
							<rect
								x = {x*40}
								y = {y*40}
								width = {40}
								height = {40}
								data-percent = {Number(((this.state.scaledData[counter].count / sum) * 100).toFixed(5)) + '%'}
								fill = {colorScale(this.state.scaledData[counter].count)}
								stroke = "white"
								strokeWidth = "1"
								onMouseOver = {this.showToolTip}
								onMouseOut = {this.hideToolTip}
							/>
						</g>
					)
					counter ++
				}
			}
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
				<Tooltip data = {this.state.tooltip} />
		  </g>
		)

	}
}

export default connect(state => state)(Heat)

