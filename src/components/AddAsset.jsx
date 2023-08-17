import React,{useContext, useEffect, useState} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {AssetAddPopUPContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';

function AddAsset() {
  axios.defaults.headers.common['Authorization'] = Token
  const {show,setShow} = useContext(AssetAddPopUPContext)
  const [file,setFile] = useState()
  const [type,setType] = useState({"value":"Logo","label":"Logo"})
  const [types,setTypes] = useState([{"value":"Logo","label":"Logo"}])
  const [name,setName] = useState('')
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const [error,setError] = useState({})
  const handleClose = () => setShow(false)  
  const handleSelect = (data) => setType(data)
  const handleSubmit = (event) =>{
      event.preventDefault()
  

axios({
  method: 'post',
  url: Url+'url/ast/',
  headers: { "Content-Type": "multipart/form-data" },
  data: {
          name:name,
          type:type.value,
          photo:file
        }

}).then(res=>{
if(res.status == 200 ){
  setError(res.data)
}else{
  setMessage({
              type:"success",
              message:"Asset Added"
              })
  setSsShow(true)
  setFile('')
  setName('')
  setError({})
}
}).catch(error=>{
  setError(error.response.data)
})
}
useEffect(()=>{
  axios({
    method: 'get',
    url: Url+'/assettype'
  }).then(res=>{
    setTypes([...res.data])
  })
},[])
  
  return (
   <>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>ADD ASSET</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Asset Name</Form.Label>
           <Form.Control type='text' value = {name} onChange={e=>setName(e.target.value)} autoComplete='off'/>
           {Object.keys(error).includes("message")?<label className='error'>*{error.message}</label>:<></>}
           {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
             </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Asset Type</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={types}
                    placeholder="Select factory address"
                    value={type}
                    onChange={handleSelect}
                    isSearchable={true}
                    // isMulti
                  />

             </div>
          </Form.Group>
          <center>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control type='file'  onChange={e=>setFile(e.target.files[0])}/>
            {Object.keys(error).includes("photo")?<label className='error'>*{error.photo[0]}</label>:<></>}
            <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
              {file? <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} src={URL.createObjectURL(file)} alt='asset' height="80px" width="80px"/>:<></>}
             
            </div>
         
            </Form.Group>
         
         <Modal.Footer>
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
   </>
  )
}

export default AddAsset