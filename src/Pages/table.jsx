import {Table} from 'reactstrap';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import React, { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import ObjectIdContext from '../context/Context'
import {Link } from 'react-router-dom'; 
import {GrDown} from 'react-icons/gr';
import '../App.css';
import {FaEdit} from 'react-icons/fa';
import {Token,Url} from '../context/ApiVariables';
import { ErrorOutline } from '@mui/icons-material';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from '../components/PopBoxes';

function LanguageTable(props) {
   const {data,setData} = props
   const [show, setShow] = useState(false);
   const [Code, setCode] = useState();
   const [currentName,setCurrentName] = useState()
   const [currentCode,setCurrentCode] = useState()
   const [Name, setName] = useState();
   const [Id, setId] = useState();
   const {objId, setobjId} = useContext(ObjectIdContext);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const [message,setMessage] =useState('')
   const [ssShow,setSsShow] = useState(false)
   const [error,setError] = useState({})
   const [searchKey,setSearchKey] = useState('')
   const [key,setKey] = useState('')
   const [result,setResult] = useState([])

   const handleSubmit = (event) =>{
    event.preventDefault()
  // api call for update language details
  axios.defaults.headers.common['Authorization'] = Token
  const updateLanguage = axios({
      method: 'put',
      url: Url+'lang',
      data: {
          name: Name.toUpperCase(),
          code: Code.toUpperCase(),
          id:Id
      }
  }).then(res=>{
        setMessage({
        type:"success",
         message:"Language Modified"
      })
      setSsShow(true)
        setError({})
        setobjId('')
        setobjId([])
  }).catch(error=>{
    setError(error.response.data)
  })
      // handleClose()
      // window.location.reload()
 // api for logging language updates
//   const upaateLog = axios({
//     method: 'post',
//     url: Url+'inputModule/log',
//     data: {
//         user:"testuser",
//         action: `Modified ${currentCode} to ${Code} and ${currentName} to ${Name}`,
//         module:"language"
//     }
// }).then(res=>(
//       console.log(res.data)
//     ))
 // calling log input api and language update api
  axios.all([updateLanguage]).then(axios.spread((...responses) => {
    const responseOne = responses[0]
    const responseTwo = responses[1]
  
      // use/access the results 
    })).catch(errors => {
      // react on errors.
    })
   }
   const handleCheck = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const obj  = objId;
      
    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setobjId([...obj, value]);
    }
  
    // Case 2  : The user unchecks the box
    else {
      setobjId(obj.filter((e) => e !== value))
    }
    console.log(objId)
  };
    
  // const loadTranslation = () =>{
  //   window.location.assign('/search/'+this.state.query+'/some-action');
  // }

useEffect(()=>{
  searchData()
},[searchKey,props])

  const searchData = ()=>{
    let copy = [...data]
    if(searchKey == null || searchKey == undefined || searchKey ==''){
      setResult([...copy])
  }else {
    const pattern =  new RegExp(`^(${searchKey}|\\b${searchKey})`,"i")
    let filtered = copy.filter(obj=>{
      return pattern.test(obj[key])
    })
    setResult([...filtered])
    }
    }

  return (
    <div className='container lan  tableRow' style={{marginTop:"2rem"}}>
      <NotificationContainer/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <table className='table'>
      <thead id="thead" style={{backgroundColor:"#719e54"}}>
        <tr style={{backgroundColor:"#719e54"}}>
          <th>Select</th>
          <th style={{width:"20%"}}><span>Language Code </span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("code")}} placeholder='search'/></th>
          <th><span>Language Name</span><br></br>
          <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("name")}} placeholder='search'/> 
            </th> 
          <th>Translations</th>
          <th>MODIFY</th>
        </tr>
      </thead>
      <tbody>
          {result.map((item,index)=>(<tr key={item._id.$oid}>
            
            <td style={{textAlign:"center"}}><input type='checkBox' onChange={handleCheck} value={item._id.$oid}></input></td>
            <td name='code'>{item.code}</td>
            <td className='name'>{item.name}</td>
            <td style={{textAlign:"center"}} > <Link  to="/translation" onClick={()=>{window.sessionStorage.setItem("language",item.code);window.sessionStorage.setItem("languageName",item.name)}}>VIEW</Link></td>
            <td style={{textAlign:"center"}} className='pointer'><i onClick={()=>{handleShow()
             setId(item._id.$oid)
             setCode(item.code)
             setCurrentCode(item.code)
             setCurrentName(item.name)
             setName(item.name)
             }}><FaEdit size={30}/></i></td>
          </tr>))}
         
      </tbody>
  </table>

  <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Language</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Language Code</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name = 'Code'
              onChange={e => setCode(e.target.value.toUpperCase())}
              value={Code}
              autoComplete='off'
            />
            {Object.keys(error).includes("code")?<label className='error'>*{error.code[0]}</label>:<></>}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Language Name</Form.Label>
            <Form.Control type='text' name = 'Name' value={Name}  onChange={e => setName(e.target.value.toUpperCase())} autoComplete='off'/>
            {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
          </Form.Group>
          <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Modify
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  </div>
  );
}

export default LanguageTable;