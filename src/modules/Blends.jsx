import React,{useEffect,useContext} from 'react'
import { useState } from 'react';
import {Token,Url} from '../context/ApiVariables';
import MainNavbar from '../Pages/mainNavbar';
import axios from 'axios';
import {Link } from 'react-router-dom'; 
import {FaEdit} from 'react-icons/fa';
import AddBlend from '../components/AddBlend';
import {BlendAddPopUpContext,ModBlendPopUpContext} from '../context/Context'
import {RiFileHistoryFill} from 'react-icons/ri';
import ModifyBlend from '../components/ModifyBlend';
import { BlendHistory } from '../Pages/History';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {Table} from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useNavigate } from 'react-router-dom';
import {ConfirmDelete, SuccessMessage} from '../components/PopBoxes'
import DeleteButton from '../components/DeleteButton';
const Blends = () =>{

    const [data,setData] = useState([])
    const [ingredientTeaBag,setIngredientTeaBag] = useState(false)
    const [ingredientLooseTea,setIngredientLooseTea] = useState(false)
    const [blendTeaBag,setBlendTeaBag] = useState(false)
    const [blendLooseTea,setBlendLooseTea] = useState(false)
    const [teaorigin,setTeaOrigin] = useState('')
    const [show,setShow] = useState(false)
    const [modifyshow,setModifyShow] = useState(false)
    const [item,setItem] = useState(false)
    const [id,setId] = useState([])
    const [range,setRange] = useState(false)
    const [dropdown,setDropDown] = useState(false)
    const [rangedropdown,setRangeDropDown] = useState([{label:"Black tea",value:"Black tea"},{label:"Green tea",value:"Green tea"},{label:"Herbal tea",value:"Herbal tea"},{label:"Natural Benefit",value:"Natural Benefit"}])
    const [showhistory, setHistoryShow] = useState(false)
    const [ssShow,setSsShow] = useState(false)
    const [smShow,setSmShow] = useState(false)
    const [message,setMessage] = useState('')
    const [result,setResult] =useState([])
    const [searchKey,setSearchKey] = useState('')
    const [key,setKey] = useState('')

    const navigate = useNavigate()
    const handleShow = () => setShow(true)
    const historyClose = () => setHistoryShow(false)
    const historyShow = () => setHistoryShow(true)
    const handleModifyShow = (param) =>{
      setItem(param)
      setTeaOrigin()
      setModifyShow(true)
      setBlendTeaBag()
      setBlendTeaBag()
      setIngredientLooseTea()
      setIngredientTeaBag()
      dropdown.map(element => {
        if(param.blendLoose_code==element.value){
          setBlendLooseTea(element)
        }
        if(param.blendTeaBag_code==element.value){
          setBlendTeaBag(element)
        }
        if(param.ingredientLoose_code==element.value){
          setIngredientLooseTea(element)
        }
        if(param.ingredientTeaBag_code ==element.value){
          setIngredientTeaBag(element)
        }
        if(param.tea_origin_code==element.value){
          setTeaOrigin(element)
        }
      })
      rangedropdown.map(element=>{
        if(param.range==element.value){
          setRange(element)
        }
      })
     
      rangedropdown.map(element=>{
        if(element.value == param.range){
           setRange(element)
        }
      })
    }    
    
    
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

      const uncheck = () =>{
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
        // Loop through each checkbox and uncheck if it's checked
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            checkbox.checked = false;
          }
        });
    }
    const handleDelete = () =>{ 
            axios.defaults.headers.common['Authorization'] = Token
            axios({
              method: 'delete',
              url: Url+'blend',
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
            uncheck() 
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
        axios.get(Url+'blend',{
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
      axios.get(Url+'importexport/blend',{
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
    
    
      const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4],sheetData[0][5],sheetData[0][6],sheetData[0][7]]]; // include first column header
      const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4],row[5],row[6],row[7]]); // include only first column data
    
      const doc = new jsPDF();
      doc.autoTable({
        head: head ,
        body: body,
      });
      doc.save('languages.pdf');
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
          return pattern.test(obj[key])
        })
      setResult([...filtered])
        }
        }
    return(<div className='hd'>
       <DeleteButton module="blend" param=""/>
        <MainNavbar prop='BLENDS'/>
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
  <Link to='/import/blend' onClick={e =>window.sessionStorage.setItem("page","/")}><button className="w3-btn hd-btns">IMPORT</button></Link>
    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
    <option value="" selected="selected">EXPORT</option>
     <option value="pdf" >EXPORT PDF</option>
     <option value="excel" >EXPORT EXCEL</option>
    </select>
  </div>
  </div>
</div>
    
 <div  className='container lan tableRow blend' style={{marginTop:"30px"}}>
      <Table>
      <thead>
        <tr>
          <th style={{width:"2vw"}}></th>
          <th style={{width:"10%"}}>
          <span>Blend Name </span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("name")}} placeholder='search'/>
          </th>
          <th >Blend TeaBag (Master Code)</th> 
          <th >Blend LooseTea (Master Code)</th>
          <th >Ingredient TeaBag (Master Code)</th>
          <th>Ingredient LooseTea (Master Code)</th>
          <th >Tea Origin (Master Code)</th>
          <th >Range</th>
          <th> Requirements</th>
          <th >Modify</th>
        </tr>
      </thead>
        <tbody>
        {
          result.map((item,index)=>(<tr key={index}>
            <td><input type='checkbox' onClick={handleCheck} value={item._id.$oid} name='check'/></td>
            <td>{item.name}</td>
            <td>{item.blend_tea_bag}</td>
            <td>{item.blend_loose}</td>
            <td>{item.ingredient_tea_bag}</td>
            <td>{item.ingredient_loose}</td>
            <td>{item.tea_origin}</td>
            <td>{item.range}</td>
            <td className='view' onClick={e=>navigate(`/blend/requirements/${item._id.$oid}`)}>VIEW</td>
            <td className='pointer'><i onClick={e=>handleModifyShow(item)}><FaEdit size={30}/></i></td>
          </tr>))
        }
        </tbody>
        </Table>
        </div>

        
     {
        show && <BlendAddPopUpContext.Provider value={{show,setShow}} >
                         <AddBlend/>
                </BlendAddPopUpContext.Provider>
    }

    { 
    modifyshow && <ModBlendPopUpContext.Provider value ={{modifyshow,setModifyShow}}>
   <ModifyBlend prop = {{item,ingredientTeaBag,ingredientLooseTea,blendTeaBag,blendLooseTea,teaorigin,range}}/>
    </ModBlendPopUpContext.Provider>
    }

<Modal show={showhistory} onHide={historyClose}  dialogClassName='custom-dialog-history' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <BlendHistory/>
      </Modal.Body>
    </Modal>
<NotificationContainer/>
 
 </div>
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

 </div>)
}

export default Blends
