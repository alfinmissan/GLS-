import React ,{useState,useEffect} from 'react'
import MainNavbar from '../Pages/mainNavbar';
import {Link } from 'react-router-dom'; 
import axios from 'axios'
import {FaEdit} from 'react-icons/fa';
import {Button} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import '../App.css';
import {RiFileHistoryFill} from 'react-icons/ri';
import {RequirementHistory} from '../Pages/History';
import {PopupShowContext} from '../context/Context'
import AddRequirement from '../components/AddRequirement';
import ModifyRequirement from '../components/ModifyRequirement';
import {Token,Url} from '../context/ApiVariables';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import Dropdown from 'react-bootstrap/Dropdown';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {ConfirmDelete, SuccessMessage} from '../components/PopBoxes'
import DeleteButton from '../components/DeleteButton';
const Requirements = ({prop}) => {
//states for add new requirement
    const [id,setId] = useState([])
    const [show,setShow] = useState(false)
    const handleShow = () => setShow(true)
    const [dropdown,setDropdown] = useState([])
    const [value,setValue] = useState([])
    const [excelData, setExcelData] = React.useState(null);
    const [count,setCount] = useState(0)
    //states for modifying requirements
    const [asset,setaAsset] = useState([])
    const [trans,setTrans] = useState([])
    const [country,setCountry] = useState([])
    const [countryList,setCountryList] = useState([])
    const [modifyshow,setModifyShow] = useState(false)
    const [item,setItem] = useState('')
    const [showhistory, setShowhistory] = useState(false);
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow]  = useState(false)
    const [smShow,setSmShow] = useState(false)
    const historyShow = () => setShowhistory(true);
    const historyClose = () =>setShowhistory(false)
    const [text,setText] = useState('')
    const [requirements,setRequirements] = useState([])
    const [result,setResult] =useState([])
    const [searchKey,setSearchKey] = useState('')
    const [key,setKey] = useState('')

    const handleCheck = (e) => {
        console.log(e)
        // Destructuring
        const { value, checked } = e.target;
        const obj  = id;
          
        console.log(`${value} is ${checked}`);
    
        // Case 1 : The user checks the box
        if (checked) {
          setId([...obj, value]);
        }
      
        // Case 2  : The user unchecks the box
        else {
          console.log(obj)
          if(Array.isArray(obj)){
            setId(Object.values(obj).filter((e) => e !== value))
          }else{
            setId([])
          }
        }
        console.log(id)
          };
    
    const handleDelete = () =>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'delete',
        url: Url+'req',
        data: {
            id:id
        }
    }).then(res=>{
      setMessage({
        type:"success",
        message:res.data.message
      })
      setSsShow(true)
      setCount(count+1)
          setId()
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
            setTrans(res.data.req_translation)
            setCountryList(res.data.country)
          })
            axios({
              method: 'get',
              url: Url+'req/view',
             
          }).then(res=>{
            setRequirements(res.data)
            setResult(res.data)
    })
  },[show,id,modifyshow])

    const handlemodifyShow = (param) =>{
       setItem(param)
      if(param.type=='Translation-ID'){
          setDropdown(trans)
          for (let i = 0; i <trans.length; i++) {
              if(param.value==trans[i].value){
                  console.log(i)
                   setValue(trans[i])
              }
            }
      }else if(param.type =='Asset'){
          setDropdown(asset) 
          for (let i = 0; i <asset.length; i++) {
              if(param.value==asset[i].value){
                setValue(asset[i])
              }
            }
      }else{
        setText(param.value)
      }
      setCountry([])
      if(param.country == 'All'){
        setCountry('All')
      }else{
      for (let i = 0; i <countryList.length; i++) {
        for(let j =0;j<param.country.length;j++){
          if(countryList[i].value==param.country[j]){
            setCountry(oldArray => [...oldArray,countryList[i]])
          }
        }
     
  }
    }
    setModifyShow(true)
}
function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios.get(Url+'importexport/requirements',{
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

useEffect(()=>{
  searchData()
},[searchKey])

  const searchData = ()=>{
    let copy = [...requirements]
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
  const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4],sheetData[0][5],sheetData[0][6]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4],row[5].toString().replace(/(.{27})/g, "$1\n") // Add line breaks if content exceeds 25 characters
,row[6]]);

  const doc = new jsPDF();
  doc.autoTable({
    head: head ,
    body: body,
  });
  doc.save('converted.pdf');
};

  return (<div className='hd'>
      <DeleteButton module="additional_requirement" param=""/>
<MainNavbar prop='REQUIREMENTS'/>
<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
<div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid requirement'>
      <div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
  <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/requirement/import'><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
     <option value="#" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel" >EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
     
      <div  className='container'>
      <div  className='container lan tableRow' style={{marginTop:"30px"}}>
      <table className='table'>
      <thead>
        <tr>
          <th>Select</th>
           <th>Order</th>
          <th>
          <span>Requirements</span><br></br>
         <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("requirement")}} placeholder='search'/>
          </th>
          <th>Type</th> 
          <th>Value</th>
          <th>Countries</th>
          <th>Static requirement</th>
          <th>MODIFY</th>
        </tr>
      </thead>
      <tbody> 
        {result.map((item,index)=>(<tr key={index}>
            <td><input type='checkbox' onClick={handleCheck} name='check' value={item._id.$oid}></input></td>
            <td>{item.order}</td>
            <td>{item.requirement}</td>
            <td>{item.type}</td>
            <td style={item.type=='Asset'?{textAlign:"center"}:{textAlign:"None"}}>{item.type == 'Plain-text'?<>{item.value}</>:item.type=='Asset'?<img src={item.photo} alt='asset' height="40px" width="50px"/>
            :<>{item.value} - {item.text} </>}</td>
            <td>{item.country =='All'? <span>{item.country}</span> :  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {item.country.map((country) => (
        <span key={country} style={{ marginRight: '5px' }}>
          {country}
        </span>
      ))}
    </div>
  }</td>
  <td>{item.static ? "Static requirement":"Non static requirement"}</td>
   
            <td style={{textAlign:"center"}} className='pointer'><div><i onClick={()=>{handlemodifyShow(item)}}>
              <FaEdit size={30}/></i></div></td>
             </tr>))}
        </tbody>
      </table>
      </div>
  </div>
</div>



  {show? 
    <PopupShowContext.Provider value={{show,setShow}}>
    <AddRequirement/>
  </PopupShowContext.Provider> :<></>
  }


{
  modifyshow?
<PopupShowContext.Provider value={{modifyshow,setModifyShow}}>
  <ModifyRequirement prop={{item,value,country,countryList,dropdown,text}}/>
</PopupShowContext.Provider> :<></>

}




<Modal show={showhistory} onHide={historyClose} dialogClassName='custom-dialog-history' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <RequirementHistory/>
      </Modal.Body>
  </Modal>

   <NotificationContainer/>
<div className="w-100" style={{height:"30px"}}></div>
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


</div>)
}

export default Requirements