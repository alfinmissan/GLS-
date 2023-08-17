import React,{useContext,useState,useEffect} from 'react'
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
const ModifyRequirement = (props) => {
  console.log(props.prop)
    const [image,setImage] = useState(props.prop.item.photo)
    const {modifyshow ,setModifyShow } = useContext(PopupShowContext)
    const [requirement,setRequirement] = useState(props.prop.item.requirement)
    const [type,setType] = useState(props.prop.item.type)
    const [value,setValue] = useState(props.prop.value)
    const [dropdown,setDropdown] = useState(props.prop.dropdown)
    const [countryList,setCountryList] = useState(props.prop.countryList)
    const [asset,setAsset] = useState([])
    const [trans,setTrans] = useState([])
    const [country,setCountry] = useState(props.prop.country)
    const [text,setText] = useState(props.prop.text)
    const [error,setError] = useState({})
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [order,setOrder] = useState(props.prop.item.order)
    const [checked,setChecked] = useState(props.prop.item.static)

    let val = ''
    let countries = []
    
    const handleSelect = (data) => setValue(data)
    const handleCountrySelect = (data) => setCountry(data)

    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setAsset(res.data.asset)
              setTrans(res.data.req_translation)
              setCountryList(res.data.country)
            })
    },[])
     
    const Type = (e) =>{
        setType(e.target.value)
        if(e.target.value=='Translation-ID'){
            setDropdown(trans)
        }else if(e.target.value =='Asset'){
            setDropdown(asset)  
        }
    }

    const handleClose = () => {
        setCountry([])
        setModifyShow(false)
    }
    const handleSubmit = (event) =>{
         event.preventDefault()
            if(country.length > 0){
              for (let i = 0; i <country.length; i++) {
                countries.push(country[i].value);
              }
            }else{
               countries = country
            }
        
           if(type=='Plain-text'){
            val=text
           }else if(type=='Asset'){
            val=value.value
           }else{
            val=value.value
           }     
    console.log(countries,val,requirement,type)
      axios.defaults.headers.common['Authorization'] =Token
      axios({
        method: 'put',
        url: Url+'req',
        data: {
                id:props.prop.item._id.$oid,
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
                   }).catch(error=>{
                          setError(error.response.data)
                         })
                //  setModifyShow(false)
        // window.location.reload()
                }

  return (
<>
<NotificationContainer/>
   <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<Modal show={modifyshow} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY REQUIREMENT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
           <Form.Check
            inline
            label="Static requirement"
            defaultValue="Static"
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
            defaultValue=""
            type='radio'
            id='non-static'
            checked={!checked}
            onClick={e=>setChecked(!checked)}
          />
          {Object.keys(error).includes("static")?<label className='error'>*{error.static[0]}</label>:<></>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Requirement</Form.Label>
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
            <Form.Label>Type :</Form.Label>
            <select style={{width:"15vw",height:"6vh"}} onChange ={Type} value={type}>
            <option value="Plain-text">Plain Text</option>
            <option value="Translation-ID">Translation ID</option>
            <option value="Asset">Asset</option>
           </select>
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
       
          </div>
            </Form.Group>


            {country !== 'All' &&
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
         }    
            { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
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
          Update
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
</>   
  )
}

export default ModifyRequirement