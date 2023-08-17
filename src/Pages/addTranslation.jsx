import React, { useState ,useEffect} from 'react'
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import Select from "react-select"
import axios from 'axios';
import MainNavbar from './mainNavbar';
import {Token,Url }from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Footer from '../components/Footer';
import { SuccessMessage } from '../components/PopBoxes';

const AddTranslation = () => {
    const [text,setText] = useState('')
    const [texts,setTexts] = useState('')
    const [translation,setTranslation] = useState()
    const [dropdown,setDropDown] = useState([])
    const [trans_id,setTran_id] = useState('')
    const [id,setId] = useState('')
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [error,setError] = useState({})
    const langauge = sessionStorage.getItem("language")
    const handleSelect = (data) =>{setTexts(data);setText(data.text);setId(data.value);setTran_id(langauge.concat(data.value))}
    useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios.get(Url+'req/dropdown',{
        'headers':{
          'Authorization': Token
        }
        }).then((res)=>{
       setDropDown(res.data.req_translation)
        })
    },[])
    const handleSubmit = async (event) => {
        event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    
            // const mastercode = await   axios({
            //     method: 'post',
            //     url: 'http://127.0.0.1:8000/mastercode',
            //     params: {
            //         text:text
            //     }
            // })

      const translationsApi =  await   axios({
                method: 'post',
                url: Url+'translation',
                data: {
                    text:text,
                    trans:translation,
                    tran_id:trans_id,
                    language: langauge,
                    master_id:id
                }
            }).then(res =>{
              setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
              setText('')
              setTran_id('')
              setTranslation('')
              setId('')
              setTexts('')
              setError({})
                  }).catch(error=>{
                    setError(error.response.data)
                  })
          
  };
  return (<>
    <MainNavbar prop='Add Translation'/>
    <NotificationContainer/>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <center>
    <div style={{"marginTop":"15vh","marginBottom":"30px"}} className='container'>
      <div style={{width:"35vw"}} >
      <Form>
     <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>English text</Form.Label>
                    <Select
                  options={dropdown}
                    placeholder="Select english text"
                    value={texts}
                    onChange={handleSelect}
                    isSearchable={true}  
                  />   
                  {Object.keys(error).includes("text")?<label className='error'>*{error.text[0]}</label>:<></>}
      </Form.Group>

<Form.Group className="mb-3" controlId="formBasicEmail">
 
  <Form.Label>Translation ID :</Form.Label>
  
  <Form.Control type="text" placeholder="TranslationId" value={trans_id} onChange={ e =>setTran_id(e.target.value)} autoComplete='off' />
  {Object.keys(error).includes("tran_id")?<label className='error'>*{error.tran_id[0]}</label>:<></>}

</Form.Group>

<Form.Group className="mb-3" controlId="formBasicPassword">

  <Form.Label>Translation :</Form.Label>

  <Form.Control type="text" placeholder="translation" value={translation} onChange={ e =>setTranslation(e.target.value)} autoComplete='off'/>
  {Object.keys(error).includes("trans")?<label className='error'>*{error.trans[0]}</label>:<></>}
</Form.Group>

      <button  className='translation-add-btn' onClick={handleSubmit}>
        Add
      </button>
    </Form>
      </div>
    </div>
    </center>
    <Footer/>
    </>)
}

export default AddTranslation