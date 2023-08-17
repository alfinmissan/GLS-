import React,{useContext, useState} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {UploadFontFileShowContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';

const UploadFont = ({prop}) => {
    console.log(prop)
    const {show,setShow} = useContext(UploadFontFileShowContext)
    const [file,setFile] = useState(false)
    const [name,setName] = useState('')
    const [error,setError] = useState({})
    const handleClose = () => setShow(false)  
    const handleSetFile = (event) =>{
      setFile(event.target.files[0])
      setName(event.target.files[0].name)
    }
    const handleSubmit = (event) =>{
        // event.preventDefault()
    
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'url/font/',
    headers: { "Content-Type": "multipart/form-data" },
    data: {
            name:name,
            language:prop,
            font:file
          }
  
  }).then(res=>{
  if(res.status == 200){
    // setMessage(res.data.message)
  }else{
    // window.location.reload()
  }
  }).catch(error=>{
    setError(error.response.data)
  })
  setShow(false)
  }
    
    return (
     <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Upload Font</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Font Name</Form.Label>
             <Form.Control type='text' value = {name} onChange={e=>setName(e.target.value)} autoComplete='off'/>
              {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
               </Form.Group>
            <center>
  
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control type='file'  onChange={e=>handleSetFile(e)}/>
               {Object.keys(error).includes("font")?<label className='error'>*{error.font[0]}</label>:<></>}
              </Form.Group>
           
           <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit'>
           Upload
          </Button>
        </Modal.Footer>
          </center>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default UploadFont