import React from 'react'
import {connect, Provider} from 'react-redux'
import store from '../../store'
import Chart from './Chart.js'
import {fetchFilterClicks, removeGraph, fetchClicks } from '../../store'
import {Popover, OverlayTrigger, Button, Checkbox} from 'react-bootstrap'
import PopoutWindow from 'react-popout'

class basicHeatmap extends React.Component {
	constructor (props){
		super(props)
		this.state = {
			topSites: []
		}
	}

	render(){
		console.log('HERE!!!')
		let topSites = this.props.clicks.top
		let data = this.props.clicks.all
		const popoverBottom = (<div></div>)
		// (
		// <Popover id="popover-positioned-bottom" title="Popover bottom">
		// 	{topSites.map((site,i) => {
		// 		return (
		// 			<Checkbox onChange = {(e) => {
		// 				if (e.target.checked){
		// 					this.setState({
		// 						topSites: this.state.topSites.concat(site.referrerSubstring)
		// 					}, () => {
		// 						this.props.handleFilter(this.state.topSites)
		// 					}) }
		// 				else {
		// 					this.setState({
		// 						topSites: this.state.topSites.filter((e) =>{
		// 							return e !== site.referrerSubstring
		// 						})
		// 					}, () => {
		// 						this.props.handleFilter(this.state.topSites) })
		// 				}
		// 			}}
		// 			 key = {i} validationState="success">
		// 				{site.referrerSubstring}
		// 			</Checkbox>
		// 		)})
		// 	}
		// </Popover>
		// )

		if(this.props.graph === 'Scatter'){
			return (
				<PopoutWindow title = "Scatter" url = "http://localhost:8080/home/graph" options = {{width: '1440px', height: '840px'}} onClosing = {this.props.history.push('/home')}>
					<Provider store = {store}>
						<div className = "basicHeatmap">
							<OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
								<Button>Holy guacamole!</Button>
							</OverlayTrigger>
							<Chart />
						</div>
					</Provider>
				</PopoutWindow>
			)
		} else {
			return (
				<PopoutWindow title='Window title1'>
  				<div>Popped out content!</div>
				</PopoutWindow>
				// <div className = "basicHeatmap">
				// 	<Chart  />
				// </div>
			)
		}

	}
}



const mapDispatchToProps = (dispatch) => {
	return {
		handleFilter(url) {
			dispatch(fetchFilterClicks(url))
		},
		handleClick(){
			dispatch(removeGraph())
		},
		handleUnclick(){
			dispatch(fetchClicks())
		}
	}
}


export default connect(state => state, mapDispatchToProps)(basicHeatmap)

