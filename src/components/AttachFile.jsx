import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AttachFileContext,AttachShowFileContext} from '../context/Context';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
const AttachFile = (props) => {
  const {handleSubmit} = props
  const {showattach,setShowAttach} = useContext( AttachFileContext)
  const {showattached,setShowAttached} = useContext(AttachShowFileContext)
  const [text,setTex] = useState()
  const [file,setFile] = useState()
  const handleClose = () =>{
    if(window.localStorage.getItem('userGroup')!=='Admin'){
      // navigate('/task')
      }
    setShowAttach(false)
    setTex('')
    setFile('')
    handleSubmit()
  }
  const handleSubmited = (event)=>{
      setShowAttach(false)
      setShowAttached(true)
  }
  return (
    <>
     <Modal
        size="sm"
        show={showattach} onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-sm"
      >

        <Modal.Body>Want to add comments?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-danger' onClick={handleClose}>
            No
          </button>
          <button className='btn btn-primary' onClick={handleSubmited}>
            yes
          </button>
        </Modal.Footer>
      </Modal>
  </>
  )
}

export default AttachFile