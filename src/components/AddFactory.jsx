import React,{useContext,useState,useEffect} from 'react'
import {FactoryAddPopUp} from '../context/Context'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import { error } from 'jquery';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';

const AddFactory = () => {

  const {show ,setShow } = useContext(FactoryAddPopUp)
  const [packed_in,setPacked_in] = useState()
  const [address,setAddress] = useState()
  const [countryList,setCountryList] = useState([])
  const [dropdown,setDropDown] = useState([])
  const [country,setCountry] = useState()
  const [message,setMessage] = useState({})
  const [ssShow,setSsShow] = useState(false)
  const countries = []
  const [error,setError] = useState({})
  const handleCountrySelect = (data) => setCountry(data)
  const handleAddressSelect = (data) => setAddress(data)
  const handlePackedInSelect = (data) => setPacked_in(data)
  const handleClose = () => setShow(false)

  const handleSubmit = (event) =>{
   event.preventDefault()
     

axios.defaults.headers.common['Authorization'] = Token
axios({
  method: 'post',
  url: Url+'factory',
  data: {
          location:country,
          packed_in:packed_in,
          address:address,
        }

}).then(res=>{
if(res.status == 200){
  setMessage({
              type:"success",
               message:"Factory already exists"
             })
 setSsShow(true)
}else{
  setAddress(null)
  setPacked_in(null)
  setCountry(null)
  setError({})
  setMessage({
              type:"success",
               message:"Factory added"
             })
 setSsShow(true)
  // setShow(false)
}
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
            setCountryList(res.data.country)
          })
  },[])
  return (
    <>
  <Modal show={show} onHide={handleClose}>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>ADD FACTORY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Factory Location</Form.Label>
            <div className="dropdown-container" >
                    <Select
                    options={countryList}
                    placeholder="Select country"
                    value={country}
                    onChange={handleCountrySelect}
                    isSearchable={true}
                  
                  />
                   {Object.keys(error).includes("location")?<label className='error'>*{error.location[0]}</label>:<></>}
          </div>
          {/* <p style={{color:"#CB2929"}}>{message}</p> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Packed In Translation</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={dropdown}
                    placeholder="Select packed in translation"
                    value={packed_in}
                    onChange={handlePackedInSelect}
                    isSearchable={true}
                    // isMulti
                  />
                   {Object.keys(error).includes("packed_in")?<label className='error'>*{error.packed_in[0]}</label>:<></>}
          </div>
          </Form.Group>


          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Factory Address Translation</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select factory address"
                    value={address}
                    onChange={handleAddressSelect}
                    isSearchable={true}
                    // isMulti
                  />
                   {Object.keys(error).includes("address")?<label className='error'>*{error.address[0]}</label>:<></>}
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
        </Form>
      </Modal.Body>
    </Modal>
    <NotificationContainer/>
    </>
  )
}

export default AddFactory