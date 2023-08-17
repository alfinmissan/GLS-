import React, { useContext, useState } from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {TeaFormAddShow} from '../context/Context';
import { SuccessMessage } from './PopBoxes';
const AddTeaForm = () => {
    const {show,setShow} = useContext(TeaFormAddShow)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    const [teaform,setTeaForm] = useState('')
    axios.defaults.headers.common['Authorization'] = Token
    const handleAdd = (event) =>{
        axios({
            method: 'post',
            url: Url+'teaform',
            params: {
                   tea_form:teaform
                  }
          
          }).then(res=>{
            if(res.data != 'exist'){
                setMessage({
                  type:"success",
                  message:"Teabag form " + res.data +" added "
                       })
            }else{
                setMessage({
                  type:"error",
                  message:"Teabag form already" + res.data 
                       })
            }
           setSsShow(true)
           setTimeout(function() {setShow(false)}, 5000)
          }).catch(error=>{

          })
          // setShow(false)
    }
    const handleClose = () =>setShow(false)
  return (
          <Modal show={show} onHide={handleClose}>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <Modal.Header closeButton>
                    <Modal.Title>ADD TEABAG FORM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label>Teabag Form</Form.Label>
                          <Form.Control type='text' value={teaform} autoComplete='off' style={{width:'100%'}} onChange={e =>setTeaForm(e.target.value)}/>
                        </Form.Group>      
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" type='submit' onClick={e=>handleAdd()}>Add</Button>
                </Modal.Footer>
          </Modal>
  
  )
}

export default AddTeaForm