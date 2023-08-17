import React,{useState,useContext} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {LegalNameModifyPopUpContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import { useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const ModifyLegalName= ({prop}) => {
    const [name,setName] = useState(prop.item.name)
    const {modifyshow,setModifyShow} = useContext(LegalNameModifyPopUpContext)
    const [dropdown,setDropDown] = useState(false)
    const [translation,setTranslation] = useState(prop.translation)
    const handleClose = () => setModifyShow(false)
    const handleSelectTranslation = (data) => setTranslation(data)
    const [error,setError] = useState({})
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const countries = []
    const handleSubmit = (event) =>{
      event.preventDefault()
     
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'put',
        url: Url+'legalName',
        data: {
            id:prop.item._id.$oid,
            name:name,
            translation: translation.value,
              }
      
      }).then(res=>{
            setMessage({
                         type:"success",
                          message:res.data.message
                      })
           setSsShow(true)
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
    <Modal show={modifyshow} onHide={handleClose} >
          <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton style={{height:'10vh'}}>
      <Modal.Title>MODIFY LEGAL NAME</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Legal Name</Form.Label>
           <Form.Control type='text' value={name} autoComplete='off' style={{width:'100%'}} onChange={e =>setName(e.target.value)}/>
           {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
             </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Master Code</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="select Master Code"
                    value={translation}
                    onChange={handleSelectTranslation}
                    isSearchable={true}
                    // isMulti
                  />   
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
   </div>
  )
}

export default ModifyLegalName