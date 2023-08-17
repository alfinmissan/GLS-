import React,{useContext,useState} from 'react'
import {AssetTypeModShow} from '../context/Context';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { SuccessMessage } from './PopBoxes';
const ModAssetType = ({prop}) => {
    const {modshow,setModShow} = useContext(AssetTypeModShow)
    const [assetType,setAssetType] = useState(prop.value)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    axios.defaults.headers.common['Authorization'] = Token
    const handleMod = (event) =>{
        axios({
            method: 'put',
            url: Url+'assettype',
            params: {
                id:prop.id.$oid,
                asset_type:assetType
                  }
          
          }).then(res=>{
          setMessage({
            type:"success",
            message:"Modified asset"
          })
          setSsShow(true)
         setTimeout(()=>{setModShow(false)},5000)
          })
          
    }
    const handleClose = () =>setModShow(false)
    
  return (
    <div>
<Modal show={modshow} onHide={handleClose}>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY ASSET TYPE</Modal.Title>
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
        <Button variant="primary" onClick={e=>handleMod()}>
          Modify
        </Button>
      </Modal.Footer>
       </Modal>
    </div>
  )
}

export default ModAssetType