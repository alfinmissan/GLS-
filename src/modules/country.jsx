import React, { useState,useEffect } from 'react'
import MainNavbar from '../Pages/mainNavbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import Countrymodify from '../components/countrymodifypop';
import ModifyCountry from '../context/modifycountrycontex'
import {RiFileHistoryFill} from 'react-icons/ri';
import {CountryHistory} from '../Pages/History';
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';

const CountryChild = () => {
  const languages = []
  const [show, setShow] = useState(false)
  const  handleClose = () => setShow(false)
  const [lan,setLan] = useState([])
  const [codes,setCodes] = useState([])
  const [code,setCode] =useState('')
  const [name,setName] = useState('')
  const [excelData, setExcelData] = React.useState(null);
  const [language,setLangauge] = useState(false)
  const [modifyshow, setModifyShow] = useState(false)
  const [item, setItem] = useState([])
  const handleShow = () => setShow(true)
  const [countries,setCountries] = useState([])
  const [showhistory, setShowhistory] = useState(false);
  const historyShow = () => setShowhistory(true);
  const historyClose = () =>setShowhistory(false)
  const [error,setError] = useState({})
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const [smShow,setSmShow] =useState(false)
  const [result,setResult] =useState([])
  const [searchKey,setSearchKey] = useState('')
  const [key,setKey] = useState('')
const handlemodifyShow = (prop) =>{
  setItem(prop)
  setLangauge([])
  for (let i = 0; i <lan.length; i++) {
    for(let j =0;j<prop.language.length;j++){
      if(lan[i].value==prop.language[j]){
        setLangauge(oldArray => [...oldArray, lan[i]])
      }
    }
} 
setModifyShow(true)
}  

  
              
  const handleCheck = (e) => {
        
    // Destructuring
    const { value, checked } = e.target;
    const obj  = codes;
      
    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setCodes([...obj, value]);
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCodes(obj.filter((e) => e !== value))
    }
    console.log(codes)
      };

 //function for delete single and multiple requirement from database
 const handleDelete = () =>{
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'delete',
    url: Url+'country',
    data: {
        code:codes
    }
}).then(res=>{
  setCodes('')
   setMessage({type:"success",
   message:res.data.message})
   setSsShow(true)
  
})
    
    
    // window.location.reload()
}

//function for add countries
const handleSubmit=(event)=>{
  event.preventDefault()
  for (let i = 0; i <language.length; i++) {
    console.log(i)
    languages.push(language[i].value);
  }
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'country',
    data: {
            code:code,
            name:name,
            language:languages
          }

}).then(res=>{
            //  setShow(false)
             setCode('')
             setMessage({
              type:"success",
              message:res.data.message
             })
             setSsShow(true)
             setLangauge([])
             setName('')
             setError({})
            }).catch(error=>{
              setError(error.response.data)
            })
             
    // window.location.reload()
            }



const  handleSelect = (data) => setLangauge(data)
            
function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios.get(Url+'country/exprtimport',{
    'headers':{
      'Authorization': Token
    }
    }).then((res)=>{
      if(val=='pdf'){
        handleConvertToPdf(res.data.file)
      }else if(val=='excel'){
         window.location.href = res.data.file;
      }
    })

}
const handleConvertToPdf = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const data = new Uint8Array(response.data);

  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });


  // sheetData = sheetData.map((row) => {
  //   return row.filter((_, index) => index !== 0 && index !== 1 && index !== 2);
  // });

  setExcelData(sheetData);
  const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3]]); // include only first column data

  const doc = new jsPDF();
  doc.autoTable({
    head: head ,
    body: body,
  });
  doc.save('converted.pdf');
};

useEffect(()=>{
  axios.defaults.headers.common['Authorization'] =Token
  axios.get(Url+'country',{
    'headers':{
      'Authorization': Token
    }
    }).then((res)=>{
    setCountries(res.data)
    setResult(res.data)
    })
  axios.get(Url+'/lan/list',{
   'headers':{
     'Authorization': Token
   }
   }).then((res)=>{
   setLan(res.data.languages)
   })
},[codes,name,modifyshow])

useEffect(()=>{
  searchData()
},[searchKey])

  const searchData = ()=>{
    let copy = [...countries]
    if(searchKey == null || searchKey == undefined || searchKey ==''){
      setResult([...copy])
  }else {
    const pattern = new RegExp(`^${searchKey}\\w+`,"i")
    let filtered = copy.filter(obj=>{
      return pattern.test(obj[key])
    })
  setResult([...filtered])
    }
    }

  return (
    <div className='hd'>
      <DeleteButton module="country" param=""/>
    <MainNavbar prop='COUNTRIES'/>
    <NotificationContainer/>
    <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid'>
<div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
    <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/country/excel' onClick={e =>window.sessionStorage.setItem("page","/")}><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel" >EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
    
        
      <div  className='container lan'>
      <div  className='container lan tableRow' style={{marginTop:"30px"}}>
      

      <table className='table'>
      <thead>
        <tr>
          <th>Select</th>
          <th>
          <span>Country Code </span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("code")}} placeholder='search'/>
          </th>
          <th>
          <span>Country Name</span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("name")}} placeholder='search'/>
            </th> 
          <th>Languages</th>
          <th>Requirements</th>
          <th>Custom condiions</th>
          <th>MODIFY</th>
        </tr>
      </thead>
      <tbody>
  {
    result.map((items,index)=>(
        <tr key={index}>
            <td><input type='checkbox' onClick={handleCheck} name='check' value={items.code}/></td>
            <td>{items.code}</td>
            <td>{items.name}</td>
            <td><div style={{width:"10vw",overflowWrap:"break-word"}}>{items.language.map(item=><span key={item} style={{marginRight:"5px"}}>{item},</span>)}</div></td>
            <td><Link to='/requirement' onClick={() =>{window.sessionStorage.setItem("page","/country");
             window.sessionStorage.setItem("country_code",items.code);
             window.sessionStorage.setItem("country_name",items.name)}}>
               VIEW</Link></td>
            <td> <Link  to={`/countrycustom/conidtion/${items.code}`}>VIEW</Link> </td>
            <td className='pointer'> <i onClick={e =>{handlemodifyShow(items)}}>
              <FaEdit size={30}/></i></td>
        </tr>
    ))
  }


      </tbody>
     </table> 
  </div>
</div>


{/* country add pop up  */}
<Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Country</Modal.Title>
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
             {Object.keys(error).includes("message")?<label className='error'>*{error.message}</label>:<></>}
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
          placeholder="Select Language"
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
          Add
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>

  {
  modifyshow? <ModifyCountry.Provider value={{modifyshow,setModifyShow}}>
  <Countrymodify props={{item,language}}/> 
  </ModifyCountry.Provider>
   :<> </>
 }



 
<Modal show={showhistory} onHide={historyClose} dialogClassName='custom-dialog-history' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <CountryHistory/>
      </Modal.Body>
    </Modal>

   
       

   </div>
   <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
        <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
        <b style={{color:"#08265aee",cursor: "pointer"}} onClick={historyShow}><RiFileHistoryFill size={20}/>History</b>
        </div>
        </div>
</footer>

</div>
    )}
    



// const Country = () =>{

//   return(
//   <>
//   {data? <CountryChild countries={data}/>:<></>}
//   </>
//   )
// }






export default CountryChild