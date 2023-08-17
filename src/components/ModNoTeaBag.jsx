import React, { useContext, useState } from 'react'
import {TeabagModShow} from '../context/Context';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { SuccessMessage } from './PopBoxes';

const ModNoTeaBag = ({prop}) => {
    const [number,setNumber] =useState(prop.no_of_teabags)
    const {modshow,setModShow} = useContext(TeabagModShow)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    axios.defaults.headers.common['Authorization'] = Token
    const handleMod = (event) =>{
        axios({
            method: 'put',
            url: Url+'tea.bag',
            params: {
                   id:prop._id.$oid,
                   no_of_teabags:number
                  }
          
          }).then(res=>{
          setMessage({
            type:"success",
            message:"Modified number of teabag"
          })
          setSsShow(true)
          setTimeout(()=>{setModShow(false)},5000)
          })
         
    }
    const handleClose = () => setModShow(false)
  return (
    <div>
 <Modal show={modshow} onHide={handleClose}>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY NO OF TEABAG</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>No of Teabag</Form.Label>
            <Form.Control type='text' value={number} autoComplete='off' style={{width:'300px'}} onChange={e =>setNumber(e.target.value)}/>
             </Form.Group>      
             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={e=>handleMod()}>
          Modify
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export default ModNoTeaBag