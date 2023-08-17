import React, { useContext, useState } from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {WeightAddShow} from '../context/Context';
import { SuccessMessage } from './PopBoxes';

const AddWeight = () => {
    const {show,setShow} = useContext(WeightAddShow)
    const [weight,setWeight] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    const handleClose = () => setShow(false)
    axios.defaults.headers.common['Authorization'] = Token
    const handleAdd = (event) =>{
        axios({
            method: 'post',
            url: Url+'weight',
            params: {
                  weight:weight
                  }
          
          }).then(res=>{
                if(res.data != 'exist'){
                setMessage({
                  type:"success",
                  message:"Weight " + res.data +" added "
                       })
            }else{
                setMessage({
                  type:"error",
                  message:"Weight already" + res.data 
                       })
            }
           setSsShow(true)
           setTimeout(function() {setShow(false)}, 5000)
          }).catch(error=>{

          })
         }
  return (
    <div>
         <Modal show={show} onHide={handleClose}>
          <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>ADD WEIGHT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Weight</Form.Label>
            <Form.Control type='text' value={weight} autoComplete='off' style={{width:'100%'}} onChange={e =>setWeight(e.target.value)}/>
             </Form.Group>      
                 </Form>
      </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit' onClick={e=>handleAdd()}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default AddWeight