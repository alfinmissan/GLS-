import React,{useState,useEffect} from 'react'
import axios from 'axios'
import LanguageTable from '../Pages/table'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {Form} from 'react-bootstrap';
import  ObjectIdContext from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import {LanguageHistory} from '../Pages/History';
import MainNavbar from '../Pages/mainNavbar';
import {Link } from 'react-router-dom'; 
import '../App.css';
import {RiFileHistoryFill} from 'react-icons/ri';
import Dropdown from 'react-bootstrap/Dropdown';
import {ConfirmDelete, SuccessMessage} from '../components/PopBoxes'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import DeleteButton from '../components/DeleteButton';

const Language = () => {
const [data,setData] = useState()
const [url,setUrl] = useState()
const [show, setShow] = useState(false);
const [showhistory, setShowhistory] = useState(false);
const [Code, setCode] = useState('');
const [Name, setName] = useState('');
const [objId, setobjId] = useState([]);
const [excelData, setExcelData] = React.useState(null);
const [error,setError] = useState({})
const [message,setMessage] = useState('')
const [ssShow,setSsShow] = useState(false)
const [smShow,setSmShow] = useState(false)
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

const historyClose = () =>{ setShowhistory(false);setCode(null)
  setName(null)}
;
const historyShow = () => setShowhistory(true);
const handleSubmit = () =>{
  axios.defaults.headers.common['Authorization'] = Token
 axios({
    method: 'post',
    url: Url+'lang',
    data: {
        name: Name.toUpperCase(),
        code: Code.toUpperCase(), 
    }
}).then(res=>{
      setUrl(res.data.file)
      setMessage({
        type:"success",
         message:"Language added"
      })
      setSsShow(true)
      setCode('')
      setName('')
      setError({})
      handleClose()
}).catch(error=>{
  setError(error.response.data)
})
    // handleClose()
    
    // window.location.reload()
 }
 useEffect(()=>{
  axios.get(Url+'lang',{
  'headers':{
    'Authorization': Token 
  }
  }).then((res)=>{
  setData(res.data)
  })

},[objId,Name])
 
 const deleteLanguage = () =>{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'delete',
      url: Url+'lang',
      data: {
          id:objId
      }
  }).then(res=>{
          setMessage({
        type:"success",
         message:"Language Deleted"
      })
      setSsShow(true)
        setobjId('')
  })
}
function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios.get(Url+'excel/import',{
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
  const head = [[sheetData[0][1], sheetData[0][2]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1], row[2]]); // include only first column data

  const doc = new jsPDF();

  doc.autoTable({
    head: head,
    body: body,
  });

  const headingDoc = new jsPDF();
  const headingText = 'My Heading';
  headingDoc.setFontSize(18);
  headingDoc.text(headingText, 20, 20);

  // Merge the heading PDF with the generated PDF
  doc.internal.events.subscribe('postProcess', () => {
    doc.addPage();
    doc.setPage(doc.internal.pages.length);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    doc.addPage(headingDoc.output('array', 'blob'));
  });

  doc.save('languages.pdf');
};


  return (<div>
    <MainNavbar prop='LANGUAGE'/>
    <DeleteButton module="language" param=""/>
    <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={deleteLanguage}/>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
     <div className='hd'>
      <div style={{"marginTop":"7rem","paddingBottom":"30px",textAlign:"center"}} className='container'>
      <div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
    <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/excel' ><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel" >EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>

       
      </div>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Language</Modal.Title>
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
            />
          {Object.keys(error).includes("message")?<label className='error'>*{error.message}</label>:<></>}
          {Object.keys(error).includes("code")?<label className='error'>*{error.code[0]}</label>:<></>}
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Language Name</Form.Label>
            <Form.Control type='text' name = 'Name' value={Name} onChange={e => setName(e.target.value.toUpperCase())} />
            {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
          </Form.Group>
          <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>

    <Modal show={showhistory} dialogClassName='custom-dialog-history' scrollable onHide={historyClose}>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <LanguageHistory/>
      </Modal.Body>
    </Modal>
    
    {data
      ?<ObjectIdContext.Provider value={{objId,setobjId}}>
       <LanguageTable data={data} setData={setData}/> 
       </ObjectIdContext.Provider>
      : <></>
    }
    <NotificationContainer/>
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
 </div>
  )
}

export default Language


