import React, { useContext, useState } from 'react'
import { ArtWorkUploadContext } from '../context/Context'
import {Modal}from 'react-bootstrap'; 
import { Form } from 'react-bootstrap'
import {MdOutlineFileUpload} from 'react-icons/md';
import {RxCross2} from 'react-icons/rx';
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const ArtWorkAttach = (props) => {
    const {showart,setShowArt} = useContext(ArtWorkUploadContext)
    const {job,item,varient,handleArtworkUpload} = props
    const [file,setFile] = useState()
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [errors,setError] = useState({})
    const handleClose = () => setShowArt(false)

    function handleSubmit(){
      axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'url/artwork/',
      headers: { "Content-Type": "multipart/form-data" },
      data: {
              varient:varient,
              job:job,
              item:item,
              attachment:file,
            }
    
    }).then(res=>{
      setError({})
    if(res.status >200 && res.status < 300){
      setFile('')
      handleArtworkUpload()
      setTimeout(function() { setShowArt(false)}, 1000);
     
    }else{
          setMessage({
             type:"error",
             message:"Artwork upload failed"
       })
  setSsShow(true)
    }
    }).catch(error=>{
      setError(error.response.data)
    })
    }
  return (<Modal size="mb-3" show={showart} onHide={handleClose} aria-labelledby="example-modal-sizes-title-sm">
            <NotificationContainer/>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
            <Modal.Header closeButton style={{background:"#eeee"}}>
              <Modal.Title style={{fontFamily:"futura"}}>UPLOAD ARTWORK</Modal.Title>
            </Modal.Header>
           <Modal.Body style={{textAlign:"center"}}>
           {
          file &&
            <div className="card" style={{background:"white",fontFamily:"futura",color:"#63BFE9",boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",borderRadius: "4px",marginBottom:"0px"}}>   
              <div className="" style={{paddingLeft:"20px",paddingTop:"10px",paddingBottom:"6px",paddingRight:"0",}}>
              <button className='btn' onClick={e=>setFile(false)} style={{float:"right",marginLeft:"30px",marginTop:"-7px"}}><RxCross2 size={20}/></button>
                   {file.name}
              </div>
         </div>
        }     
           </Modal.Body>
           <Modal.Footer className="centered-footer">
             <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" size="mb-3"  onChange={e=>setFile(e.target.files[0])}/>
              {Object.keys(errors).includes("attachment")?<label className='error'>*{errors.attachment[0]}</label>:<></>}
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Button variant="outline-info" onClick={handleSubmit}>UPLOAD</Button>
            </Form.Group>
          </Modal.Footer>
         </Modal>)
}

export default ArtWorkAttach