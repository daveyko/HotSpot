import React from 'react'
import Scatterplot from './HOCScatter.jsx'
import HeatMap from './HOCHeat.jsx'


const HOCChart  = (props) => {
	return(
		props.graph === 'Scatter' ?
      	<div className = "HOCWrapper">
				<Scatterplot clicks = {props.clicks} filterClicks = {props.filterClicks} />
			</div>
			:
			<div className = "HOCWrapper">
				<HeatMap clicks = {props.clicks} filterClicks = {props.filterClicks}/>
			</div>
	)
}

export default HOCChart

