import React, { useEffect, useState } from 'react'
import MainNavbar from '../Pages/mainNavbar';
import axios from 'axios';
import PopupShowContext from '../context/Context'
import AddCountryRequirement from '../components/AddCountryRequirement';
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
const CountryRequirement = () => {
  const [data,setData] = useState([])
  const [codes,setCodes] =useState([])
  const [show,setShow] = useState(false)
  const [item,setItem] = useState('')
  const [modifyshow,setModifyShow] = useState(false)
  const [result,setResult] =useState([])
  const [searchKey,setSearchKey] = useState('')
  const [key,setKey] = useState('')
  const [message,setMessage] = useState('')
  const [smShow,setSmShow] = useState(false)
  const [ssShow,setSsShow] = useState(false)
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

      const handleDelete = () =>{
        axios.defaults.headers.common['Authorization'] = Token
        axios({
          method: 'delete',
          url: Url+'country/requirement',
          data: {
              id:codes,
              country:window.sessionStorage.getItem("country_code")
          }
      }).then(res=>{
        setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
           setCodes('')
      })
          
          // window.location.reload()
      }

      function download(val) {
        axios({
          method: 'get',
          url:Url+"country/requirement/export",
          params: {
              country:sessionStorage.getItem("country_code"), 
          }
            }).then((res)=>{
              if(val=='pdf'){
                handleConvertToPdf(res.data.file)
              }else if(val=='excel'){
                 window.location.href = res.data.file;
              }
            })
      
      }
  useEffect(()=>{
    axios({
      method: 'post',
      url: Url+'req/view',
      params: {
          country:window.sessionStorage.getItem("country_code")
      }
  }).then(res=>{
        setData(res.data)
        setResult(res.data)
  })
  },[show,codes])
      const handleConvertToPdf = async (url) => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
      
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
        const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4]]]; // include first column header
        const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4]]); // include only first column data
        const doc = new jsPDF();
        doc.autoTable({
          head: head ,
          body: body ,
        });
        doc.save('converted.pdf');
      };
      useEffect(()=>{
        searchData()
      },[searchKey])
      
        const searchData = ()=>{
          let copy = [...data]
          if(searchKey == null || searchKey == undefined || searchKey ==''){
            setResult([...copy])
        }else {
          const pattern = new RegExp(`^(${searchKey}|\\b${searchKey})`,"i")
          let filtered = copy.filter(obj=>{
            return pattern.test(obj[key])
          })
        setResult([...filtered])
          }
          }
  return (
<div className='hd'>
<MainNavbar prop='REQUIREMENTS'/>
<NotificationContainer/>
<ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
  <div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid'> 
      <div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
 <button className="w3-btn hd-btns" onClick={e =>setShow(true)}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" selected="selected">EXPORT PDF</option>
     <option value="excel" selected="selected">EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
      


      <div className="row" style={{fontFamily:"futura",marginTop:"50px"}}>
      <div className="col-3"><h5></h5></div>
      <div className="col-6"><h3 style={{fontFamily:"futura"}}>{sessionStorage.getItem("country_code")}:{sessionStorage.getItem("country_name")}</h3></div>
      <div className="col-3"></div>
      </div>


      <div  className='container lan'>
      <div  className='container lan tableRow' style={{marginTop:"10px"}}>
      <table className='table'>
      <thead>
        <tr>
          <th style={{width:"2vw"}}>Select</th>
          <th>
          <span>Requirements</span><br></br>
         <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("requirement")}} placeholder='search'/>
          </th>
          <th>Type</th> 
          <th>Value</th>
        </tr>
      </thead>
      <tbody>

      {result.map((item,index)=>(<tr key={index}>
       <td style={{textAlign:"center"}}><input type='checkbox'  onClick={handleCheck} name='check' value={item._id.$oid}/></td>
       <td>{item.requirement}</td>
       <td>{item.type}</td>
       <td style={item.type=='Asset'?{textAlign:"center"}:{textAlign:"None"}}>{item.type=='Asset'?<img src={item.value} alt='asset' height="40px" width="50px"/>:<>{item.value}</>}</td>
      </tr>))
      }
     </tbody>
     </table>
     </div>
   </div>



{show? 
  <PopupShowContext.Provider value={{show,setShow}}>
  <AddCountryRequirement prop={item}/>
</PopupShowContext.Provider> :<></>
}


<footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
        <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
        </div>
        </div>
</footer>


</div> 
</div>
  )
}



export default CountryRequirement