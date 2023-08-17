import React,{useEffect, useState}from 'react'
import {Table} from 'reactstrap';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import axios from 'axios';
import {Link } from 'react-router-dom'; 
import { TranslationHistory } from './History';
import MainNavbar from './mainNavbar';
import {RiFileHistoryFill} from 'react-icons/ri';
import '../App.css';
import {FaEdit} from 'react-icons/fa';
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';

const TranslationTable = ({trans}) =>{

  const [text ,setText] = useState()
  const [url,setUrl] = useState()
  const [font,setFont] = useState('')
  const [translation ,setTranslation] = useState()
  const [translations ,setTranslations] = useState([])
  const [master_id ,setMaster_id] = useState()
  const [tran_id ,setTran_id] = useState()
  const [trans_ids ,setTrans_ids] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true)
  const [excelData, setExcelData] = React.useState(null);
  const [showhistory, setShowhistory] = useState(false);
  const historyClose = () => setShowhistory(false);
  const historyShow = () => setShowhistory(true);
  const [error,setError] = useState({})
  const [result,setResult] =useState([])
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const [smShow,setSmShow] = useState(false)
  const [fonturl,setFontUrl]  = useState(false)
  const [searchKey,setSearchKey] = useState('')
  const [key,setKey] = useState('')
  const handleCheck = (e,text) => {
    setMaster_id(e.target.value)
    setText(text)
    // Destructuring
    const { value, checked } = e.target;
    const obj  = trans_ids;
      
    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setTrans_ids([...obj, value]);
    }
  
    // Case 2  : The user unchecks the box
    else {
      setTrans_ids(obj.filter((e) => e !== value))
    }
    console.log(trans_ids)
      };

  const handleSubmit = () => {
    axios.defaults.headers.common['Authorization'] = Token
    axios({
        method: 'put',
        url: Url+'translation',
        data: {
            language: sessionStorage.getItem("language"),
            master_id:master_id,
            trans:translation

        }
    }).then(res=>{
     setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
      setError({})
          // setVersion(res.data)
    }).catch(error=>{
      setError(error.response.data)
    })
        // setShow(false)
        // window.location.reload()
  };

  const handleDelete = () => {
   
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'delete',
        url: Url+'translation',
        data: {
            language:sessionStorage.getItem("language"),
            tran_ids:trans_ids
        }
    }).then(res=>{
       setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
          setTrans_ids('')
    })
        
        // window.location.reload(
  }

 useEffect(()=>{
      axios({
        method: 'get',
        url:Url+"get/font",
        params: {
            language:sessionStorage.getItem("language"), 
        }
          }).then((res)=>{
           setFont(res.data.font)
           setFontUrl(res.data.url)
                     })

          axios({
            method: 'get',
            url: Url+'translation',
            params: {
                language:sessionStorage.getItem("language")
            }
        }).then(res=>{
              setTranslations(res.data)
              setResult(res.data)
        })
 },[trans_ids,show])

 function download(val) {
  axios({
    method: 'get',
    url:Url+"translation/import",
    params: {
        language:sessionStorage.getItem("language"), 
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

  // Load the custom font
  const fontUrl = Url + fonturl; // Update with the actual path

  console.log('Fetching font data from:', fontUrl);

  try {
    const fontFile = await fetch(fontUrl);
    const fontArrayBuffer = await fontFile.arrayBuffer();

    console.log('Font data fetched and converted to ArrayBuffer:', fontArrayBuffer);

    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    setExcelData(sheetData);
    const head = [[sheetData[0][1], sheetData[0][2], sheetData[0][3], sheetData[0][4]]];
    const body = sheetData.slice(1).map((row) => [row[1], row[2], row[3], row[4]]);

    const doc = new jsPDF();

    doc.addFileToVFS(font, fontArrayBuffer);
    doc.addFont(font, 'custom', 'normal');
    doc.setFont('custom');
    doc.setFont('custom', 'unicode');
    doc.autoTable({
      head: head,
      body: body,
    });

    doc.save('Translation.pdf');
  } catch (error) {
    console.error('Error loading or applying font:', error);
  }
};


function Uint8ToBase64(u8Arr) {
  let CHUNK_SIZE = 0x8000; // arbitrary number
  let index = 0;
  let length = u8Arr.length;
  let result = '';
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}





useEffect(()=>{
  searchData()
},[searchKey])

  const searchData = ()=>{
    let copy = [...translations]
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
 
    return (<div className='hd'>
      <DeleteButton module="translations" param={sessionStorage.getItem("language")}/>
      <MainNavbar prop='TRANSLATIONS'/>
      <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <div style={{"marginTop":"14vh","marginBottom":"10px","position":"fixed"}} className='container-fluid'>
      <div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
  <Link to='/addtranslation'> <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button></Link>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/trans/excel'><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel">EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
    
     
     <div  className='container lan'>
     <div className='row' style={{marginTop:"60px"}}>
      <div className='hd-btns col-2'></div>
      <div className='hd-btns col-2'></div>
      <div className='hd-btns col-3'><h4>{sessionStorage.getItem("languageName")}({sessionStorage.getItem("language")})</h4></div>
      <div className='hd-btns col-2'></div>
      <div className='hd-btns col-2'><h5>Font : {font}</h5></div>
      </div>

      <div  className='container lan tableRow'>
        <table className='table'>
      <thead >
        <tr >
          <th >Select</th>
          <th>
          <span>English Text</span><br></br>
         <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("text")}} placeholder='search'/>
          </th>
          <th>
          <span>Translation ID</span><br></br>
         <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("trans_id")}} placeholder='search'/>
            </th> 
          <th>Translation</th>
          <th>Current Version</th>
          <th>versions</th>
          <th>Modify</th>
        </tr>
      </thead>
      <tbody >
        {result.map((item,index)=>(<tr key={item.trans_id}>
            <td><input type='checkbox' name='check' onClick={e => handleCheck(e,item.text)} value={item.trans_id}></input></td>
            <td>{item.text}</td>
            <td>{item.trans_id}</td>
            <td>{item.trans}</td>
            <td>{item.version}</td>
            <td>  <Link to={`/version/${item.trans_id}/${item.master_id}/${sessionStorage.getItem("language")}`}> VIEW</Link></td>
            <td className='pointer'><i onClick={()=>{handleShow()
              setMaster_id(item.master_id)
              setText(item.text)
              setTran_id(item.trans_id)
              setTranslation(item.trans)
            }
            }><FaEdit size={30}/></i></td>
        </tr>))}
    
      </tbody>
      </table>
      </div>
      </div>
  </div>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>Add Translation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>{text}</Form.Label>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Translation</Form.Label>
            <Form.Control type='text'  onChange={e => setTranslation(e.target.value)} value={translation} autoComplete='off' />
            {Object.keys(error).includes("trans")?<label className='error'>*{error.trans[0]}</label>:<></>}
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

    <Modal show={showhistory} onHide={historyClose} scrollable dialogClassName='custom-dialog-history'>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <TranslationHistory prop="translation"/>
      </Modal.Body> 
    </Modal>
    <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
       <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
        <b style={{color:"#08265aee",cursor: "pointer"}} onClick={historyShow}><RiFileHistoryFill size={20}/>history</b>
        </div>
        </div>
    </footer>
      </div>
     )
}

export default TranslationTable;

