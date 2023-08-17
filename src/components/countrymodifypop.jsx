import React,{useContext, useState,useEffect} from 'react'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import ModifyCountry from '../context/modifycountrycontex'
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';

const Countrymodify = ({props}) => {
    const languages = []
    const [lan,setLan] = useState([])
    const {modifyshow, setModifyShow} = useContext(ModifyCountry)
    const [code,setCode] =useState(props.item.code)
    const [name,setName] = useState(props.item.name)
    const [error,setError] = useState({})
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [language,setLangauge] = useState(props.language)
    const  handleClose = () => setModifyShow(false)

      
useEffect(()=>{
    axios.defaults.headers.common['Authorization'] = Token
    axios.get(Url+'lan/list',{
     'headers':{
       'Authorization':Token
     }
     }).then((res)=>{
        // console.log(res.data.languages)
     setLan(res.data.languages)
     })
  },[])

  

    const handleSubmit = (event) =>{
        event.preventDefault()
  for (let i = 0; i <language.length; i++) {
    console.log(i)
    languages.push(language[i].value);
  }
  console.log(name,code,language)
  axios.defaults.headers.common['Authorization'] =Token
  axios({
    method: 'put',
    url: Url+'country',
    data: {
            code:code,
            name:name,
            id:props.item._id.$oid,
            language:languages
          }

}).then(res=>{
  setMessage({
    type:"success",
    message:res.data.message
  })
  setSsShow(true)
  setError({})
}).catch(error=>{
  setError(error.response.data)
})

  }

const  handleSelect = (data) => setLangauge(data)
     
                                
  return (
    <div>
      <NotificationContainer/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <Modal show={modifyshow} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>MODIFY COUNTRY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Country code"
              autoFocus
              name = 'Text'
              onChange={e => setCode(e.target.value.toUpperCase())}
              value={code}
              autoComplete='off'
            />
             {Object.keys(error).includes("code")?<label className='error'>*{error.code[0]}</label>:<></>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Country name"
              autoFocus
              name = 'Text'
              onChange={e => setName(e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))}
              value={name}
              autoComplete='off'
            />
             {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
          </Form.Group>


          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Languages</Form.Label>
            <div className="dropdown-container">
           <Select
          options={lan}
          placeholder="Select language"
          value={language}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
        />
         {Object.keys(error).includes("language")?<label className='error'>*{error.language[0]}</label>:<></>}
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
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export default Countrymodify