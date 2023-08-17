import React,{useContext,useState,useEffect} from 'react'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import {ReqAddContext,ReqAddShowContext} from '../context/Context';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
  const GridAdditionalRequirement = ({prop}) => {

const {showreq,setShowReq} = useContext(ReqAddShowContext)
const {requirement,setRequirement} = useContext(ReqAddContext)
const handleClose = () => setShowReq(false)
const [type,setType] = useState('')
const [value,setValue] = useState('')
const [image,setImage] = useState(false)
const [dropdown,setDropdown] = useState([])
const  AddNewRequirement  = prop
const  handleSelect = (req) => {
    setRequirement(req)
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
  useEffect(()=>{
    axios.get(Url+'country/requirement/dropdown',{
        'headers':{
          'Authorization': Token 
        }
        }).then((res)=>{
          setDropdown(res.data)
        })
},[])
const handleAddReq=(event)=>{
  AddNewRequirement(event)
    setShowReq(false)
}
  return (
    <div>
         <Modal show={showreq} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>ADD REQUIREMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddReq}>
         
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
    </div>
  )
}

export default GridAdditionalRequirement