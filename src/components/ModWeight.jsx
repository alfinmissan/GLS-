import React, { useContext, useState } from 'react'
import {WeightModShow} from '../context/Context';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { SuccessMessage } from './PopBoxes';
const ModWeight = ({prop}) => {
    const [weight,setWeight] = useState(prop.weight)
    const {modshow,setModShow} = useContext(WeightModShow)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] =useState('')
    const handleMod = (event) =>{
        axios({
            method: 'put',
            url: Url+'weight',
            params: {
                  id:prop._id.$oid,
                  weight:weight
                  }
          
          }).then(res=>{
          setMessage({
            type:"success",
            message:"Modfied weight"
             })
             setSsShow(true)
             setTimeout(()=>{setModShow(false)},5000)
          }).catch(error=>{

          })
          setModShow(false)
    }
    const handleClose = () => setModShow(false)
  return (
    <div>
        <Modal show={modshow} onHide={handleClose}>
          <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY WEIGHT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
        <Button variant="primary"  onClick={e=>handleMod()}>
          Modify
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default ModWeight