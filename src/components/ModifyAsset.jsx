import React,{useContext,useState,useEffect} from 'react'
import {AssetModifyPopUpContext} from '../context/Context'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const ModifyAsset = ({props}) => {
    const {modifyshow,setModifyShow} = useContext(AssetModifyPopUpContext)
    const [file,setFile] = useState(props.item.photo)
    const [preview,setPreview] = useState(props.item.photo)
    const [type,setType] = useState({"value":"Logo","label":"Logo"})
    const [types,setTypes] = useState([{"value":"Logo","label":"Logo"}])
    const [name,setName] = useState(props.item.name)
    const [message,setMessage] = useState('')
    const [error,setError] = useState({})
    const handleClose = () => setModifyShow(false)  
    const [ssShow,setSsShow] = useState(false)
    const [resp,setResponse] = useState('')
    const handleSelect = (data) => setType(data)
    const handlePreview = (data) => {setPreview(URL.createObjectURL(data))}
    const response =  axios.get(props.item.photo, { responseType: 'arraybuffer' });
    // setFile(response.data)
    // setFile(data)
    
    const handleSubmit = async (event) =>{ 
        event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    const AssetModifyApi =  await  axios({
            method: 'put',
            url: Url+`url/ast/${props.item.id}/`,
            headers: { "Content-Type": "multipart/form-data" },
            data: {
                    name:name,
                    type:type.value,
                    photo:file, 
                }
            
        }).then(res=>{
         setResponse(res.data)
         setMessage({
              type:"success",
              message:"Asset modified"
              })
          setSsShow(true)
          setError({})
          const Assetlog = axios({
            method: 'post',
            url: Url+'inputModule/log',
            data: {
                user:"testuser",
                action: `modified asset ${resp.name}`,
                module:"asset"
            }
        }).then(res=>{
          // console.log(res.data)
        })
        }).catch(error=>{
          setError(error.response.data)
        })
         
  }


  return (
   <>
   <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
   <NotificationContainer/>
       <Modal show={modifyshow} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY ASSET</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Asset Name</Form.Label>
           <Form.Control type='text' value = {name} onChange={e=>setName(e.target.value)} autoComplete='off'/>
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
            <Form.Control type='file'  onChange={e=>{setFile(e.target.files[0]);handlePreview(e.target.files[0])}}/>
            {Object.keys(error).includes("photo")?<label className='error'>*{error.photo[0]}</label>:<></>}
            <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
              {preview? <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={preview}height="80px" width="80px"/>:<></>}
            </div>
            </Form.Group>
         
         <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Modify
        </Button>
      </Modal.Footer>
        </center>
        </Form>
      </Modal.Body>
    </Modal>
   </>
  )
}

export default ModifyAsset