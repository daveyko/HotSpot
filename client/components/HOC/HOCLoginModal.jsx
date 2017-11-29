import React from 'react'
import {Form, FormGroup, Col, FormControl, Button, Checkbox, ControlLabel, Modal} from 'react-bootstrap'

class LogIn extends React.Component {

	constructor (props){
		super(props)
		this.state = {
			password: null,
			createPw: false
		}
		this.onHandleChange = this.onHandleChange.bind(this)
		this.onHandleSubmit = this.onHandleSubmit.bind(this)
		this.onCreatePw = this.onCreatePw.bind(this)
	}


	onHandleChange(e){
		e.preventDefault()
		this.setState({
			password: e.target.value
		})
	}

	onHandleSubmit(e){
		e.preventDefault()

		if (sessionStorage.getItem('pw') === this.state.password){
			this.props.toggleButton()
		}
		this.props.toggleModal()
	}

	onCreatePw(){
		this.setState({
			createPw: true
		})
	}


	render(){

		return (
			<Modal bsSize = "small" show = {true} onHide = {this.props.toggleModal}>
				<Modal.Header>
					<Modal.Title>Sign Up</Modal.Title>
				</Modal.Header>
				<Form horizontal onSubmit = {this.onHandleSubmit}>
					<Modal.Body>
						<FormGroup controlId="formHorizontalPw">
							<Col componentClass={ControlLabel} sm={2}>
				Password
							</Col>
							<Col sm={10}>
								<FormControl type="password" placeholder="password" name = "password" onChange = {this.onHandleChange} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button type="submit">
					Submit
								</Button>
							</Col>
						</FormGroup>
					</Modal.Body>
				</Form>
			</Modal>
		)
	}
}

export default LogIn
