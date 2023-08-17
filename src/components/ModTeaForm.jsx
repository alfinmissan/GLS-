import React, { useContext, useState } from 'react'
import {TeaFormModShow} from '../context/Context';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { SuccessMessage } from './PopBoxes';

const ModTeaForm = ({prop}) => {
    const {modshow,setModShow} = useContext(TeaFormModShow)
    const [teaform,setTeaForm] = useState(prop.tea_form)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    axios.defaults.headers.common['Authorization'] = Token
    const handleMod = (event) =>{
        axios({
            method: 'put',
            url: Url+'teaform',
            params: {
                   id:prop._id.$oid,
                   tea_form:teaform
                  }
          
          }).then(res=>{
          setMessage({
            type:"success",
            message:"Modified teaform"
          })
          setSsShow(true)
           setTimeout(function() {setModShow(false)}, 5000)
          }).catch(error=>{})
     
    }
    const handleClose = () => setModShow(false)
  return (
    <div>
<Modal show={modshow} onHide={handleClose}>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY TEABAG FORM</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Teabag Form</Form.Label>
            <Form.Control type='text' value={teaform} autoComplete='off' style={{width:'300px'}} onChange={e =>setTeaForm(e.target.value)}/>
             </Form.Group>    
               </Form>
      </Modal.Body>  
             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit' onClick={e=>handleMod()}>
          Modify
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default ModTeaForm