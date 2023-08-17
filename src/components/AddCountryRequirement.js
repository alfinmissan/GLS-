import React, { useContext, useEffect, useState } from 'react'
import PopupShowContext from '../context/Context'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const AddCountryRequirement = () => {

    const {show ,setShow } = useContext(PopupShowContext)
    const [requirement,setRequirement] = useState('')
    const [type,setType] = useState('')
    const [value,setValue] = useState('')
    const [image,setImage] = useState(false)
    const [id,setId] = useState('')
    const [dropdown,setDropdown] = useState([])
    const [error,setError] = useState({})
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    
    const  handleSelect = (req) => {
      setRequirement(req)
      setId(req.value.$oid)
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'req',
        params: {
              id:req.value.$oid
              }
    
    }).then(res=>{
      setType(res.data[0].type)
      setValue(res.data[0].value)
      setImage(res.data[0].photo)
      // console.log(res.data)
    })
    }
    const handleClose = () => setShow(false)
    const handleSubmit = (event) =>{
      event.preventDefault()
      axios.defaults.headers.common['Authorization'] = Token
      axios({
          method: 'post',
          url: Url+'country/requirement',
          data: {
              id:id,
              country:window.sessionStorage.getItem("country_code")
          }
      }).then(res=>{
            setMessage({
                         type:"success",
                          message:res.data.message
                            })
                      setSsShow(true)
           setId('')
           setRequirement('')
           setValue('')
           setImage('')
           setType('')
      }).catch(error=>{
       setError(error.response.data)
      })
  
    }
    
    useEffect(()=>{
        axios.get(Url+'country/requirement/dropdown',{
            'headers':{
              'Authorization': Token 
            }
            }).then((res)=>{
              setDropdown(res.data)
            })
    },[])


  return (
    <>
    <NotificationContainer/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
         <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>ADD REQUIREMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
         
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>requirement</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={dropdown}
                    placeholder="Select requirement"
                    value={requirement}
                    onChange={handleSelect}
                    isSearchable={true}
                    // isMulti
                  />
            {Object.keys(error).includes("id")?<label className='error'>*{error.id[0]}</label>:<></>}
          </div>
            </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Type :</Form.Label>
          <Form.Control type='text' value={type} readOnly/>
          </Form.Group>


          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Value</Form.Label>
            <Form.Control type='text' value={value} readOnly/>
            </Form.Group>
          
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
            { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
    
            </Form.Group>
          <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Add
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
    </>
  )
}

export default AddCountryRequirement