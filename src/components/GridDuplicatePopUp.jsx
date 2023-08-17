import { event } from 'jquery';
import React, { useContext, useState } from 'react'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {DuplicatePopUpContext,MainGridShowContext,DuplicateGridInfos} from '../context/Context'
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
const GridDuplicatePopUp = ({prop}) => {
    const {duplicate,setDuplicate} =  useContext(DuplicatePopUpContext)
    const {maingrid,setMainGrid} =  useContext(MainGridShowContext)
    const {duplicateInfo,setDuplicateInfo} = useContext(DuplicateGridInfos)
    const [jobno,setJobNo] = useState('')
    const [varient,setVarient] = useState('')
    const [error,setError] = useState(false)
    axios.defaults.headers.common['Authorization'] = Token

    const handleDuplicate = (event)=>{
        event.preventDefault()
        axios({
          method: 'post',
          url: Url+'varient/check',
          params:{
              varient:duplicateInfo.varient
          },
        }).then((res)=>{
          if(res.status== 200){
             setError(true)
          }else if(res.status==203){
            setDuplicate(false)
            setMainGrid(false)
            window.localStorage.setItem("var",duplicateInfo.varient)
          }
            })
      
    }
    const handleClose = ()=> setDuplicate(false)
    const handleChange = (event) =>{
     setDuplicateInfo(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value
    }))
    }
  return (
    <div>
        <Modal show={duplicate} onHide={handleClose}>
        <Modal.Header closeButton>
       <Modal.Title>DUPLICATE GRID</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleDuplicate}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Job No :</Form.Label>
            <Form.Control type='text' name='jobno' value = {duplicateInfo.jobno} onChange={handleChange} autoComplete='off'/>
             </Form.Group>      

             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Varient Code :</Form.Label>
            <Form.Control  style={error ?{"border":"1px solid red"}:{}} name='varient' type='text' value = {duplicateInfo.varient} onChange={handleChange} autoComplete='off'/>
            <span style={{color:"red",fontWeight:350,fontSize:"13px"}}>{error && <>*Varient already exist</>}</span>
             </Form.Group>     

             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type='submit'>
         Duplicate
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export default GridDuplicatePopUp