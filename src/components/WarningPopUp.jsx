import React,{useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const ConfrimPopUp = (props) => {
    const {pop,setPop,message,handleConfirm,title} = props
    const handleClose = () =>setPop(false)
    const handleSubmit = () =>{
        setPop(false)
        handleConfirm()
      
    }
  return (
    <Modal
    show={pop}
    onHide={handleClose}
    size="sm"
    centered
    dialogClassName="confirmation-modal"
  >
    <Modal.Header closeButton className="modal-header">
      <Modal.Title style={{ fontSize: '1.2rem' }} >{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{message}</p>
    </Modal.Body>
    <Modal.Footer  className="modal-footer">
      <Button variant="secondary" onClick={handleClose} style={{ fontSize: '0.8rem',color: 'white' ,background:"red"}}>
        No
      </Button>
      <Button variant="primary" style={{ fontSize: '0.8rem' }} onClick={handleSubmit}>
        Yes
      </Button>
    </Modal.Footer>
  </Modal>
   )
}

export default ConfrimPopUp
