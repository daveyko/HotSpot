import React from 'react'

const ToolTip = (props) => {
	let ttx = parseInt(props.data.x)
	let tty = parseInt(props.data.y) + 30
	let tranformText = 'translate('+(ttx)+','+(tty)+')'
	return(
		<g>
      	<text is visibility = {props.data.visibility} transform = {tranformText} >
				<tspan is x="0" text-anchor="middle" font-size="20px" fill="#ffffff"> {props.data.percent}</tspan>
			</text>
		</g>
	)
}


export default ToolTip

