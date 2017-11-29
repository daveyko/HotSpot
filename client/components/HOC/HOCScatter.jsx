import React from 'react'
const d3  = require('d3')


class Scatterplot extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			height: null,
			width: null
		}
	}

	componentDidMount(){
		window.addEventListener('resize', ()=>{
			if (this.size){
				this.props.filterClicks(window.innerWidth, this.size.offsetHeight,
					this.size.offsetWidth)
			}
		})
	}


	render(){

		let circles = this.props.clicks.map((datapoint, i) => {
			return(
				<g key = {i}>
					<circle
						cx = {datapoint.x}
						cy = {datapoint.y}
						r = {5}
						fill = "black"
						data-count = {datapoint.count}
						data-url = {datapoint.referrerSubstring}
						data-id = {datapoint.id}
					/>
				</g>
			)
		})
		return(
			<div className = "HOCSvgWrapper" ref = {size => this.size = size}>
				<svg className = "HOCSvg">
					<g className = "HOCSvg">
						{circles}
					</g>
				</svg>
			</div>
		)
	}
}

export default Scatterplot
