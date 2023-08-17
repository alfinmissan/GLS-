import React,{useEffect,useState,useContext} from 'react'
import {FactoryModifyPopUp} from '../context/Context'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
const ModifyFactory = ({props}) => {
  console.log(props)
  const {modifyshow ,setModifyShow } = useContext(FactoryModifyPopUp)
  const [packed_in,setPacked_in] = useState(props.packed_in)
  const [address,setAddress] = useState(props.address)
  const [countryList,setCountryList] = useState([])
  const [dropdown,setDropDown] = useState([])
  const [country,setCountry] = useState(props.location)
  const [error,setError]  = useState({})
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const handleCountrySelect = (data) => setCountry(data)
  const handleAddressSelect = (data) => setAddress(data)
  const handlePackedInSelect = (data) => setPacked_in(data)
  const handleClose = () => setModifyShow(false)

  const handleSubmit = (event) =>{
   event.preventDefault()
     

axios.defaults.headers.common['Authorization'] = Token
axios({
  method: 'put',
  url: Url+'factory',
  data: {
          id:props._id.$oid,
          location:country,
          packed_in:packed_in,
          address:address,
        }

}).then(res=>{
     setMessage({
            type:"success",
             message:res.data.message
               })
        setSsShow(true)
}).catch(error=>{
  setError(error.response.data)
})
  // window.location.reload()
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
<NotificationContainer/>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<Modal show={modifyshow} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY FACTORY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Factory Location</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={countryList}
                    placeholder="Select country"
                    value={country}
                    onChange={handleCountrySelect}
                    isSearchable={true}
                  />
                   {Object.keys(error).includes("location")?<label className='error'>*{error.location[0]}</label>:<></>}
          </div>
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
                    <Select
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
         Update
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
</>
  )
}

export default ModifyFactory