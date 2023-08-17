import React, { useState,useEffect,useContext} from 'react'
import MainNavbar from '../Pages/mainNavbar'
import axios from 'axios';
import {FactoryAddPopUp,FactoryModifyPopUp} from '../context/Context'
import {FaEdit} from 'react-icons/fa';
import '../App.css';
import $ from 'jquery'
import AddFactory from '../components/AddFactory';
import ModifyFactory from '../components/ModifyFactory';
import {RiFileHistoryFill} from 'react-icons/ri';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import { FactoryHistory } from '../Pages/History';
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
const Factory = () =>{
  const [id,setId] = useState('')
  const [item,setItem] = useState('')
  const [show, setShow] = useState(false)
  const [modifyshow, setModifyShow] = useState(false)
  const [showhistory, setHistoryShow] = useState(false)
  const [excelData, setExcelData] = React.useState(null);
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const [smShow,setSmShow] = useState(false)
  const [data ,setData] = useState([])
  const handleShow = () => setShow(true)
  const handleModifyShow = () => setModifyShow(true)
  const historyClose = () => setHistoryShow(false)
  const historyShow = () => setHistoryShow(true)
  const [result,setResult] =useState([])
  const [searchKey,setSearchKey] = useState('')
  const [key,setKey] = useState('')
  $("input:checkbox").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });

  const handleDelete = () =>{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'delete',
      url: Url+'factory',
      params:{
        id:id
      }
  }).then(res=>{
        setMessage({
          type:"success",
          message:"Factory deleted"
        })
        setSsShow(true)
       setId('')
  })
     
  }

  function download(val) {
    axios.defaults.headers.common['Authorization'] = Token
    axios.get(Url+'factory/excel',{
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
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'get',
      url: Url+'factory',
  }).then(res=>{
        setData(res.data)
        setResult(res.data)
  })
      
},[id,show])
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
    doc.save('factory.pdf');
  };

  useEffect(()=>{
    searchData()
  },[searchKey])
  
    const searchData = ()=>{
      let copy = [...data]
      if(searchKey == null || searchKey == undefined || searchKey ==''){
        setResult([...copy])
    }else {
      const pattern = new RegExp(`^${searchKey}\\w+`,"i")
      let filtered = copy.filter(obj=>{
        return pattern.test(obj[key].label)
      })
    setResult([...filtered])
      }
      }
return (
  <div className="hd">
    <DeleteButton module="factory" param=""/>
  <MainNavbar prop='FACTORY'/>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
  <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
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
          <span>Factory Location</span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("location")}} placeholder='search'/>
          </th>
          <th>Packed In Translation</th> 
          <th>Factory Address Translations</th>
          <th>MODIFY</th>
        </tr>
      </thead>
        <tbody>
          {
            result.map((item,index)=>(
              <tr key={index}>
                <td><input type="checkbox" name='check'  onClick={(e)=> setId(item._id.$oid)}/></td>
                <td>{item.location.label}</td>
                <td>{item.packed_in.label}</td>
                <td>{item.address.label}</td> 
                <td style={{textAlign:"center"}} className='pointer'><i  onClick={e =>{
                  handleModifyShow();setItem(item)
                }}>
                  <FaEdit size={30}/>
                  </i></td>
              </tr>
            ))
          }
        </tbody>
        </table>
        </div>
        {
          show? <FactoryAddPopUp.Provider value={{show,setShow}}>
            <AddFactory />
          </FactoryAddPopUp.Provider>:<></>
        }
         {
          modifyshow? <FactoryModifyPopUp.Provider value={{modifyshow,setModifyShow}}>
            <ModifyFactory props={item}/>
          </FactoryModifyPopUp.Provider>:<></>
        }
        

      {/* history component */}

      
    <Modal show={showhistory} dialogClassName='modal-90w ' scrollable onHide={historyClose}>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      < FactoryHistory/>
      </Modal.Body>
    </Modal>
    <NotificationContainer/>
    {/* footer */}
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


export default Factory