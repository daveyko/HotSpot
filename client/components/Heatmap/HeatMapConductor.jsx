import React from 'react'
import Scatter from './BasicHeatmap.jsx'
import {connect} from 'react-redux'


const HeatmapConductor = props => {
	switch (props.view) {
	case 'Scatter':
		return  <Scatter />
	case 'Heat':
		return <Scatter />
	case 'Scroll':
		return <Scatter />
	default:
		return null
	}
}

export default connect(state => state)(HeatmapConductor)
