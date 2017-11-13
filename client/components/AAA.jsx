import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class Wrapper extends Component{
	constructor (props) {
		super(props)
		this.hashCode = this.hashCode.bind(this)
		this.getPosition = this.getPosition.bind(this)
		this.onClick = this.onClick.bind(this)
	}

	componentDidMount(){
		console.log('REFS', this.props.children)
		console.log('mounted!', ReactDOM.findDOMNode(this.refs[1]))
	}

	hashCode(str){
		var hash = 0, i, chr
		if (str.length === 0) return hash
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i)
			hash  = ((hash << 5) - hash) + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}

	getPosition(element){

		var xPosition = 0
		var yPosition = 0

		while(element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
			element = element.offsetParent
		}

		return { x: xPosition, y: yPosition }
	}


	onClick(e){
		console.log('CLICKED!')
		let adjustedX = this.getPosition(e.target).x
		let adjustedY = this.getPosition(e.target).y
		let reqbody = {
			x: e.pageX,
			y: e.pageY,
			path: window.location.path,
			element: this.hashCode(e.target.outerHTML),
			top: adjustedY,
			left: adjustedX,
			clientwidth: window.innerWidth,
			clientheight: window.innerHeight,
			resized: false
		}

		localStorage.setItem(localStorage.length.toString(), reqbody)

	}

	render(){

		return(
			<div onClick = {this.onClick}>
				{React.Children.map(this.props.children, (element, idx) => {
					return React.cloneElement(element, {ref:idx})
				})}
		  </div>
		)
	}
}

export default Wrapper






