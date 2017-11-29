import React from 'react'
import LogInModal from './HOCLoginModal.jsx'

const ModalConductor = props => {
	if (props.modal){
		return <LogInModal {...props} />
	} else {
		return null
	}
}

export default ModalConductor
