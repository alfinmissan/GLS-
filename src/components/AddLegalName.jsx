import React,{useState,useContext} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {LegalNameAddPopUpContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import { useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const AddLegalName = () => {
    const {show,setShow} = useContext(LegalNameAddPopUpContext)
    const [name,setName] = useState('')
    const [dropdown,setDropDown] = useState(false)
    const [translation,setTranslation] = useState(false)
    const handleClose = () => setShow(false)
    const [error,setError] = useState({})
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const handleSelectTranslation = (data) => setTranslation(data)
    const countries = []
    const handleSubmit = (event) =>{
      event.preventDefault()
   
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'legalName',
        data: {
            name:name,
          translation: translation.value,
              }
      
      }).then(res=>{
            setMessage({
                         type:"success",
                          message:res.data.message
                            })
                      setSsShow(true)
        setTranslation('')
        setName('')
      }).catch(error=>{
        setError(error.response.data)
      })
    }
    
    useEffect(()=>{
      axios.get(Url+'req/dropdown',{
        'headers':{
          'Authorization': Token
        }
        }).then((res)=>{
          setDropDown(res.data.req_translation)
        })
    },[])
  return (
         <div>
    <Modal show={show} onHide={handleClose} >
          <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton style={{height:'10vh'}}>
      <Modal.Title>ADD LEGAL NAME</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Legal Name</Form.Label>
           <Form.Control type='text'  value={name} autoComplete='off' style={{width:'100%s'}} onChange={e =>setName(e.target.value)}/>
           {Object.keys(error).includes("message")?<label className='error'>*{error.message}</label>:<></>}
             {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
             </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Mater Code</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="select master code"
                    value={translation}
                    onChange={handleSelectTranslation }
                    isSearchable={true}
                    // isMulti
                  />   
             {Object.keys(error).includes("translation")?<label className='error'>*{error.translation[0]}</label>:<></>}
             </div>
             </Form.Group>
  
          <center>
         <Modal.Footer style={{height:'10vh'}}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Add
        </Button>
      </Modal.Footer>
        </center>
        </Form>
      </Modal.Body>
    </Modal>
    <NotificationContainer/>
   </div>
  )
}

export default AddLegalName