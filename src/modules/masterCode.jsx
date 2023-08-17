import React, { useEffect, useState,useRef } from 'react'
import MainNavbar from '../Pages/mainNavbar'
import {Link } from 'react-router-dom'; 
import '../App.css';
import axios from 'axios';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {FaEdit} from 'react-icons/fa';
import { MastercodeHistory } from '../Pages/History';
import {RiFileHistoryFill} from 'react-icons/ri';
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
// import {Table} from 'reactstrap'
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';

export const Mastercode = () => {

const reportTemplateRef = useRef(null);
const [data,setData] = useState([])
const [text,setText] = useState([])
const [newtext,setNewText] = useState([])
const [id,setId] = useState([])
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const [count,setCount] = useState(0)
const [master_ids ,setmaster_ids] = useState([])
const [excelData, setExcelData] = React.useState(null);
const [message,setMessage] = useState('')
const [ssShow,setSsShow] = useState(false)
const [smShow,setSmShow] = useState(false)
const [subshow, setSubShow] = useState(false);
const handleSubClose = () => setSubShow(false);
const handleSubShow = (event) =>{
  setSubShow(true);
  setId(event)
}
const [result,setResult] =useState([])
const [searchKey,setSearchKey] = useState('')
const [key,setKey] = useState('')

const [editshow, setEditShow] = useState(false);
const handleEditClose = () => setEditShow(false);
const handleEditShow = () =>setEditShow(true);

const [showhistory, setShowhistory] = useState(false);
const historyClose = () =>setShowhistory(false)
const historyShow = () => setShowhistory(true);


// // program to convert first letter of a string to uppercase
// function capitalizeFirstLetter(str) {

//   // converting first letter to uppercase
//   const capitalized = str.replace(/^./, str[0].toUpperCase());

//   return capitalized;
// }

// add master code 

function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios.get(Url+'mastercode/import',{
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

const handleSubmit = (event) =>{
  event.preventDefault()
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'/mastercode',
    params:{
      text:newtext
    }
}).then(res=>{
    setMessage({
             type:"success",
             message:"Master code added"
       })
  setSsShow(true) 
       })
    setShow(false)
    setText('')
    setNewText('')
}
// adding sub master code

const subTranslation = (event) =>{
  // event.preventDefault()
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'/sub/traslation',
    params:{
      text:text,
      master_id:id,
    }
}).then(res=>{
    setText('')
    setMessage({
             type:"success",
             message:"Sub translation addded"
       })
   setSsShow(true)
}
)
    setSubShow(false)
    setText('')
}


// sotre checkbox values for multiple delete

const handleCheck = (e) => {
 
  // Destructuring
  const { value, checked } = e.target;
  const obj  = master_ids;
    
  console.log(`${value} is ${checked}`);

  // Case 1 : The user checks the box
  if (checked) {
    setmaster_ids([...obj, value]);
  }

  // Case 2  : The user unchecks the box
  else {
    setmaster_ids(obj.filter((e) => e !== value))
  }
  console.log(master_ids)
    };
// Delete mastercode items
const handleDelete = () => {
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'delete',
      url: Url+'mastercode',
      data: {
          master_ids:master_ids
      }
  }).then(res=>{
      if(res.status==200){
        NotificationManager.removeAll();
        NotificationManager.error(res.data,"Delete Rejected")
      }else{
    setMessage({
             type:"success",
             message:"Master code deleted"
       })
   setSsShow(true)
        setmaster_ids([...''])
        setCount(count+1)
        // window.location.reload()
      }
  }
  )
}

const editText = (event) =>{
  // console.log(text,id)
  event.preventDefault()
  axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'put',
      url: Url+'mastercode',
      params: {
          id:id,
          text:text
      }
  }).then(res=>{
        setMessage({
             type:"success",
             message:"Master code modified"
                   })
                setSsShow(true)
                  })
      setEditShow(false)
      // window.location.reload()
}

// load  mastercode values 
useEffect(()=>{
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'get',
    url: Url+'mastercode',
}).then(res=>{
      setData(res.data)
      setResult(res.data)
})
    
},[editshow,newtext,text,count,show,subshow])


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
  const head = [[sheetData[0][1],sheetData[0][2]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1],row[2]]); // include only first column data

  const doc = new jsPDF();
  doc.autoTable({
    head: head ,
    body: body,
  });
  doc.save('converted.pdf');
};
return (<div className='hd masterCode'>
  <DeleteButton module="master_code" param=""/>
  <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<MainNavbar prop='MASTER CODE'/>
<div style={{"marginTop":"15vh","marginBottom":"30px"}} className='container'>
<div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
    <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
  </div>
  </div>

  <div className="w3-show-inline-block" style={{float:"right"}}>
 
  <div className="w3-bar">
  <Link to='/mastercode/excel' onClick={e =>window.sessionStorage.setItem("page","/")}><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf">EXPORT PDF</option>
     <option value="excel">EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
     
      <div  className='container lan tableRow' style={{marginTop:"30px"}}>
        <div ref={reportTemplateRef}>
      <table className='table' >
      <thead>
        <tr>
          <th>Select</th>
          <th>
          <span>Code</span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("id")}} placeholder='search'/>
          </th>
          <th>
          <span>English Text</span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("text")}} placeholder='search'/>
            </th> 
          <th>Sub Translations</th>
          <th>Translations</th>
          <th>MODIFY</th>
        </tr>
      </thead>
      <tbody> 
        {
          result.map((item,index)=>(<tr key={index}  style={Number(item.id)?{background:"None"}:{background:"#e8eee2"}}>
           <td><input type="checkbox" value={item.id} onClick={handleCheck}/></td>
           <td>{item.id}</td>
           <td>{item.text}</td>
           <td  style={{textAlign:"center"}} >{Number(item.id)?<button className='btn btn-secondary' onClick={e=>handleSubShow(item.id)}>+</button>:<></>}</td>
           <td> <Link  to="/textranslation" onClick={()=>{window.sessionStorage.setItem("id",item.id);window.sessionStorage.setItem("text",item.text)}}>VIEW</Link> </td>
           <td style={{textAlign:"center"}} className='pointer'><i  onClick={()=>{
            handleEditShow()
            setId(item.id)
            setText(item.text)
            }
            } name={item.id} value={item.text}><FaEdit size={30}/></i></td>
          </tr>))
        }
      </tbody>
      </table>
      </div>
      </div>
      </div>
      {/* component for show success and error notifications */}
      <NotificationContainer/>
{/* popup for for add new mastercode */}

      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add MasterCode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>English Text</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name = 'Text'
              onChange={e => setNewText(e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))}
              value={newtext}
              autoComplete='off'
            />
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

    {/* add sub mastercode */}

    <Modal show={subshow} onHide={handleSubClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add MasterCode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form >
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>English Text</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name = 'Text'
              onChange={e => setText(e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()))}
              value={text}
              autoComplete='off'
            />
          </Form.Group>
             </Form>
       </Modal.Body>
          <Modal.Footer>
        <Button variant="secondary" onClick={handleSubClose}>
          Close
        </Button>
        <Button variant="primary" type='submit' onClick={e=>subTranslation()}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>

{/* edit english text */}
<Modal show={editshow} onHide={handleEditClose}>
      <Modal.Header closeButton>
        <Modal.Title>EDIT TEXT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={editText}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>English Text</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              autoFocus
              name = 'Text'
              onChange={e => setText(e.target.value)}
              value={text}
              autoComplete='off'
            />
          </Form.Group>
          <Modal.Footer>
        <Button variant="secondary" onClick={handleEditClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Update
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
      <MastercodeHistory prop="translation"/>
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
        <b style={{color:"#08265aee",cursor: "pointer"}} onClick={historyShow}><RiFileHistoryFill size={20}/>History</b>
        </div>
        </div>
</footer>
</div>
)
}

