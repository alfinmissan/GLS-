import React, { useState,useContext } from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {AssetTypeAddShow} from '../context/Context';
import { SuccessMessage } from './PopBoxes';
const AddAssetType = () => {
    const {show,setShow} = useContext(AssetTypeAddShow)
    const [assetType,setAssetType] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    axios.defaults.headers.common['Authorization'] = Token
    const handleAdd = (event) =>{
        axios({
            method: 'post',
            url: Url+'assettype',
            params: {
                   asset_type:assetType
                  }
          
          }).then(res=>{
          if(res.data != 'exist'){
                setMessage({
                  type:"success",
                  message:"Number of teabag added"
                       })
            }else{
                setMessage({
                  type:"error",
                  message:"Number of teabag already exist" 
                  })
            }
            setSsShow(true)
           setTimeout(()=>{setShow(false)}, 5000)
          })
          
    }
    const handleClose = () =>setShow(false)
    
  return (
    <div>
   <Modal show={show} onHide={handleClose}>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>ADD ASSET TYPE</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Asset Type</Form.Label>
            <Form.Control type='text' value={assetType} autoComplete='off' style={{width:'100%'}} onChange={e =>setAssetType(e.target.value)}/>
             </Form.Group> 
                </Form>
      </Modal.Body>     
             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={e=>handleAdd()}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default AddAssetType