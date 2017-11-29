import React from 'react'
import Scatterplot from './HOCScatter.jsx'
import HeatMap from './HOCHeat.jsx'


export default function HOCChart (props){
	return(
		props.graph === 'Scatter' ?
      	<div className = "HOCWrapper">
				<Scatterplot clicks = {props.clicks} filterClicks = {props.filterClicks} {...props} />
			</div>
			:
			<div className = "HOCWrapper">
				<HeatMap clicks = {props.clicks} filterClicks = {props.filterClicks} width = {props.width} height = {props.height} {...props}/>
			</div>
	)
}

