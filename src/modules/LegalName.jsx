import React,{useEffect,useState} from 'react'
import {Token,Url} from '../context/ApiVariables';
import MainNavbar from '../Pages/mainNavbar';
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {LegalNameAddPopUpContext,LegalNameModifyPopUpContext} from '../context/Context'
import AddLegalName from '../components/AddLegalName';
import ModifyLegalName from '../components/ModifyLegalName';
import { LegalNameHistory } from '../Pages/History';
import {RiFileHistoryFill} from 'react-icons/ri';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {Link } from 'react-router-dom'; 
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import Dropdown from 'react-bootstrap/Dropdown';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';
const LegalName = () => {
    const [data,setData] = useState([]) 
    const [id,setId] = useState([])
    const [item,setItem] = useState(false)
    const [show,setShow] = useState(false)
    const [dropdown,setDropDown] = useState(false)
    const handleShow = () => setShow(true)
    const [translation,setTranslation] = useState(false)
    const [modifyshow,setModifyShow] = useState(false)
    const [showhistory, setHistoryShow] = useState(false)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [smShow,setSmShow] = useState(false)
    const [excelData, setExcelData] = React.useState(null);
    const [result,setResult] =useState([])
    const [searchKey,setSearchKey] = useState('')
    const [key,setKey] = useState('')
    const historyClose = () => setHistoryShow(false)
    const historyShow = () => setHistoryShow(true)
    
    const handleModifyShow = (param) => {
        setItem(param)
        dropdown.map(element => {
            if(param.id==element.value){
                setTranslation(element)
            }
        })
      
        setModifyShow(true)}
    const handleCheck = (e) => {
 
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
          setId(obj.filter((e) => e !== value))
        }
          };
    const handleDelete = () =>{
            axios.defaults.headers.common['Authorization'] = Token
            axios({
              method: 'delete',
              url: Url+'legalName',
              data: {
                  id:id
              }
          }).then(res=>{
            setMessage({
              type:"success",
              message:res.data.message
            })
            setSsShow(true)
            setId('')
          }
          )  
    }
    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setDropDown(res.data.req_translation)
            })
            axios.get(Url+'legalName',{
             'headers':{
               'Authorization':Token
             }
             }).then((res)=>{
               setData(res.data)
               setResult(res.data)
             })
    },[id,show])

    function download(val) {
        axios.defaults.headers.common['Authorization'] = Token
        axios.get(Url+'importexport/legalname',{
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
      
          setExcelData(sheetData);
           const head = [[sheetData[0][1],sheetData[0][2]]]; // include first column header
           const body = sheetData.slice(1).map((row) => [row[1],row[2]]); // include only first column data
          const doc = new jsPDF();
          doc.autoTable({
            head:head ,
            body:body,
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
        <MainNavbar prop='LEGAL NAME'/>
        <DeleteButton module="legal_name" param=""/>
        <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<div style={{"marginTop":"15vh","marginBottom":"30px"}} className='container-fluid'>
<div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
    <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/import/legalname' onClick={e =>window.sessionStorage.setItem("page","/")}><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel" >EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
  
 <div  className='container lan tableRow' style={{marginTop:"30px"}}>
      <table className='table'>
      <thead>
        <tr>
          <th>Select</th>
          <th>
          <span>Legal Name </span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("name")}} placeholder='search'/>
          </th>
          <th>English Text(Master Code)</th>
          <th>Modify</th>
        </tr>
      </thead>
        <tbody>
        {
           result.map((item,index)=>(<tr key={index}>
            <td><input type='checkbox' onClick={handleCheck} value={item._id.$oid} name='check'/></td>
            <td>{item.name}</td>
            <td>{item.translation}</td>
            <td style={{textAlign:"center"}} className='pointer'><i onClick={e=>handleModifyShow(item)}><FaEdit size={30}/></i></td>
          </tr>))
        }
        </tbody>
        </table>
        </div>

        
     {
        show && <LegalNameAddPopUpContext.Provider value={{show,setShow}} >
                         <AddLegalName/>
                </LegalNameAddPopUpContext.Provider>
    }

    { 
    modifyshow && <LegalNameModifyPopUpContext.Provider value ={{modifyshow,setModifyShow}}>
   <ModifyLegalName prop = {{item,translation}}/>
    </LegalNameModifyPopUpContext.Provider>
    }

<Modal show={showhistory} dialogClassName='custom-dialog-history' onHide={historyClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <LegalNameHistory/>
      </Modal.Body>
    </Modal>
<NotificationContainer/>
      <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
          <div className='row'>
          <div className='col-3'>
          </div>
          <div className='col-6'>
         <b><i>Graphics Language System</i></b>
          </div>
          <div className='col-3'>
          <b style={{color:"#08265aee",cursor: "pointer"}} onClick={historyShow} ><RiFileHistoryFill size={20}/>History</b>
          </div>
          </div>
      </footer>

 </div>
      </div>
    )
  }
  



export default LegalName