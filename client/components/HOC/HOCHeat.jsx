import React from 'react'
const d3 = require('d3')
const _ = require('lodash')

class HOCHeat extends React.Component {
	constructor (props){
		super(props)
		this.onHover = this.onHover.bind(this)
		this.offHover = this.offHover.bind(this)
	}

	componentDidMount() {
		window.addEventListener('resize', ()=>{
			if (this.size){
				this.props.filterClicks(window.innerWidth, this.size.offsetHeight,
					this.size.offsetWidth  )
			}
		})
	}

	reduceClicks(clicks, componentWidth, componentHeight, numRect){

	}

	onHover(e){
		e.target.nextSibling.setAttribute('style', 'display: inline; stroke: white; fill: white; position: absolute; z-index: 5;')
		e.target.setAttribute('stroke', 'white')
		e.target.setAttribute('stroke-width', '3')
	}

	offHover(e){
		e.target.nextSibling.setAttribute('style', 'display: none')
		e.target.setAttribute('stroke-width', '1')
	}

	render(){

		let componentWidth = this.props.width || window.innerWidth
		let componentHeight = this.props.height || window.innerHeight
		let rectWidth = componentWidth / 30
		let rectHeight = rectWidth
		let aggregateClicks = []
		let x = 0
		let y = 0
		let row = 0
		let col = 0
		let reduced = {count: 0, x, y}
		while(y <= componentHeight){
			while(x <= componentWidth + 1){
				let square = this.props.clicks.filter((click) => {
					return (click.x >= x && click.x <= x + rectWidth) && (click.y >= y && click.y <= y + rectHeight)
				}).map((filteredClick) => {
					return Object.assign(filteredClick, {x, y})
				})

				if (square.length > 1){
					reduced = square.reduce((a,b) => {
						return {count: a.count + b.count, col, row}
					})
				} else if (square.length === 1){
					reduced = {count: square[0].count, col, row}
				} else {
					reduced = {count: 0, col, row}
				}
				aggregateClicks.push(reduced)
				x += rectWidth
				col++
			}
			x = 0
			col = 0
			y += rectHeight
			row++
		}



		let totalClicks = d3.sum(aggregateClicks, (c) => c.count)

		let xScale = d3.scaleLinear()
			.range([0, this.props.width || window.innerWidth])
			.domain(d3.extent(aggregateClicks, c => c.col))

		let domainY = d3.extent(aggregateClicks, c => c.row)
		domainY[1] = domainY[1] + 1
		let yScale = d3.scaleLinear()
			.range([0, this.props.height || window.innerHeight])
			.domain(domainY)

		let clicksMin = d3.min(aggregateClicks, (d) => d.count)
		let clicksMax = d3.max(aggregateClicks, (d) => d.count)
		let domainRange = _.range(clicksMin, clicksMax, (clicksMax - clicksMin) / 7 )

		let colorScale = d3.scaleThreshold()
			.domain(domainRange.length ? domainRange : [0])
			.range(['#66ff00', '#80d408', '#8cbf0d', '#a69515', '#b3801a', '#cc5522', '#e62b2b', '#ff0033'])

		let heatmap = aggregateClicks.map((click, i) => {
			return (
				<g key = {i}>
					<rect x = {xScale(click.col)}
						y = {yScale(click.row)}
						height = {rectHeight}
						width = {rectWidth}
						fill = {colorScale(click.count)}
						data-col = {click.col}
						stroke = "white"
						strokeWidth = "1"
						// onMouseOver = {this.onHover}
						// onMouseOut = {this.offHover}
					/>
					<text x = {xScale(click.col)} y = {yScale(click.row) + 20}>
						<tspan x = {xScale(click.col) + 30} y = {yScale(click.row) + 20} textAnchor = "end" fontSize = "20px" fill = "white">{totalClicks ? Number((click.count / totalClicks)*100) < 1 ? '<1%' : Number((click.count / totalClicks)*100).toFixed(1) + '%' : '0%'}</tspan>
					</text>
				</g>
			)
		})
		return(
			<div className = "HOCSvgWrapper" ref = {size => this.size = size}>
				<svg className = "HOCSvg">
					{heatmap}
				</svg>
			</div>
		)
	}
}



export default HOCHeat
