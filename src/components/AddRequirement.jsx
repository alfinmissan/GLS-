import React, { useContext, useEffect, useState } from 'react'
import {PopupShowContext} from '../context/Context'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';
import { set } from 'lodash';
const AddRequirement = () => {

    const {show ,setShow } = useContext(PopupShowContext)
    const [requirement,setRequirement] = useState('')
    const [type,setType] = useState("Plain-text")
    const [value,setValue] = useState([])
    const [text,setText] = useState('')
    const [dropdown,setDropdown] = useState([])
    const [countryList,setCountryList] = useState([])
    const [asset,setaAsset] = useState([])
    const [trans,setTrans] = useState([])
    const [country,setCountry] = useState([])
    const [image,setImage] = useState(false)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [checked,setChecked] = useState(true)
    const [order,setOrder] = useState()
    const countries = []
    const [error,setError] = useState({})
    let val = ''
   

    const handleSelect = (data) =>{
      setValue(data)
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
       url: Url+`/url/ast/${data.value}/`,   
    }).then(res=>{
      setImage(res.data.photo)
      // console.log(res.data)
    })
    } 
    const handleCountrySelect = (data) => setCountry(data)
    const handleClose = () => setShow(false)

    const handleSubmit = (event) =>{
     event.preventDefault()
       
        for (let i = 0; i <country.length; i++) {
            countries.push(country[i].value);
          }

       if(type=='Plain-text'){
        val=text
       }else{
        val=value.value
       }

console.log(countries,val,requirement,type)
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'req',
    data: {
            type:type,
            requirement:requirement,
            value:val,
            country:countries,
            static:checked,
            order:order
          }

}).then(res=>{
    setMessage({
             type:"success",
            message:res.data.message
                 })
        setSsShow(true)  
  setRequirement('')
  setValue('')
  setCountry('')
  setText('')
  setError('')
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
              setaAsset(res.data.asset)
              setTrans(res.data.req_translation )
              setCountryList(res.data.country)
            })
    },[])

    const Type = (e) =>{
        setType(e.target.value)
        if(e.target.value=='Translation-ID'){
          setImage(false)
            setDropdown(trans)
        }else if(e.target.value =='Asset'){
            setDropdown(asset)  
        }else{
          setImage(false)
        }
    }

    

  return (
    <>
          <Modal show={show} onHide={handleClose} scrollable>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal.Header closeButton>
      <Modal.Title>ADD REQUIREMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
           <Form.Check
            inline
            label="Static requirement"
            value="Static"
            name="group1"
            type='radio'
            id='statc'
            checked={checked}
            onClick={e=>setChecked(!checked)}
          />
          <Form.Check
            inline
            label="Non static requirement"
            name="group1"
            value=""
            type='radio'
            id='non-static'
            checked={!checked}
            onClick={e=>setChecked(!checked)}
          />
          {Object.keys(error).includes("static")?<label className='error'>*{error.static[0]}</label>:<></>}
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Requirement</Form.Label>
            {/* {
                typein ?
            } */}
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name = 'Text'
              onChange={e => setRequirement(e.target.value)}
              value={requirement}
              autoComplete="off"
            />
             {Object.keys(error).includes("requirement")?<label className='error'>*{error.requirement[0]}</label>:<></>}
          </Form.Group>
     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Type</Form.Label>
            <Form.Select aria-label="Default select example" onChange ={e=>Type(e)}>     
              <option value="Plain-text">Plain Text</option>
              <option value="Translation-ID">Translation ID</option>
              <option value="Asset">Asset</option>
           </Form.Select>
      </Form.Group>
  
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Value</Form.Label>
            <div className="dropdown-container">
                {
                    type == 'Plain-text' ? 
                    <Form.Control type='text' value={text} onChange={e=>setText(e.target.value)} autoComplete="off"></Form.Control>:
                    <Select
                    options={dropdown}
                    placeholder="Select value"
                    value={value}
                    onChange={handleSelect}
                    isSearchable={true}
                  />
                }
              {Object.keys(error).includes("value")?<label className='error'>*{error.value[0]}</label>:<></>}
      
          </div>
            </Form.Group>


            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={countryList}
                    placeholder="Select country"
                    value={country}
                    onChange={handleCountrySelect}
                    isSearchable={true}
                    isMulti
                  />
          </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
    
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Order Number</Form.Label>
                <Form.Control type='number' value={order} onChange={e=>setOrder(e.target.value)} autoComplete="off"></Form.Control>
                  {Object.keys(error).includes("order")?<label className='error'>*{error.order[0]}</label>:<></>}
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

export default AddRequirement