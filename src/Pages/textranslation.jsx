import React, { useEffect ,useState} from 'react'
import MainNavbar from './mainNavbar'
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {Table} from 'reactstrap';
import {Button} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import Select from "react-select"
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
const  Textranslation = () =>{

  const [text ,setText] = useState('')
  const [url,setUrl] = useState()
  const [translation ,setTranslation] = useState('')
  const [translations ,setTranslations] = useState([])
  const [lan ,setLan] = useState([])
  const [trans_ids ,setTrans_ids] = useState([])
  const [languages ,setLanguages] = useState([])
  const [trans_id ,setTran_id] = useState('')
  const [show, setShow] = useState(false);
  const [smShow,setSmShow]= useState(false)
  const [ssShow,setSsShow] = useState(false)
  const  [message,setMessage] = useState("")
  const handleClose = () =>{ setShow(false);setAddShow(false)}
  const handleShow = (event) =>{
    setLan(event.language)
    setTranslation(event.translation)
    setShow(true)
  } 
  const language = []
  const [addshow, setAddShow] = useState(false);
  const handleAddClose = () => setAddShow(false);
  const handleAddShow = () => setAddShow(true)
  const [result,setResult] =useState([])
  const [searchKey,setSearchKey] = useState('')
  const [key,setKey] = useState('')
  const [excelData, setExcelData] = React.useState(null);
   axios.defaults.headers.common['Authorization'] = Token
   
    useEffect(()=>{
      axios.get(Url+'lan/list',{
        'headers':{
          'Authorization': Token
        }
        }).then((res)=>{
          setLanguages(res.data.languages)
        })
        axios({
          method: 'get',
          url: Url+ 'text/translations',
          params: {
              id:sessionStorage.getItem("id")
          }
      }).then(res=>{
            setTranslations(res.data)
            setResult(res.data)
      })
    
      },[translation,trans_ids])



  const handleSelect = (data) =>{
    setLan(data)
    setTran_id(data.value+sessionStorage.getItem("id"))
  } 

  const handleCheck = (e,text) => {
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

  //set language code when user select language in add translation pop up
  // const onChange= event => setLan(event.value.toUpperCase());  


  const handleSubmit = (event) => {
    for (let i = 0; i <lan.length; i++) {
      console.log(i)
      language.push(lan[i].value);
    }
    axios.defaults.headers.common['Authorization'] = Token
    axios({
        method: 'post',
        url: Url+'translation',
        data: {
            language:lan.value,
            master_id:sessionStorage.getItem("id"),
            trans:translation,
            tran_id:trans_id,
            text:sessionStorage.getItem("text")
        }
    }).then(res=>{
      //  console.log(res.data)
      setTranslation('')
      setLan('')
      setTran_id('')
      setSsShow(true)
      setMessage({
        type:"success",
        message:"Tranlation added"
      })
          
    })
        setShow(false)
        // window.location.reload()
  };

  const handleDelete = () => {
   
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'delete',
        url: Url+'text/translations',
        data: {
            tran_ids:trans_ids
        }
    }).then(res=>(
          // console.log(res)
          setTrans_ids('')
        ))
        
        // window.location.reload()
    
  }

  const handlemodify = () => {
    axios.defaults.headers.common['Authorization'] = Token
    axios({
        method: 'put',
        url: Url+'translation',
        data: {
            language:lan,
            master_id:sessionStorage.getItem("id"),
            trans:translation
        }
    }).then(res=>(
       setTranslation('')
        ))
        setShow(false)
        // window.location.reload()
  };
  function download(val) {
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'export/texttranslations',
      params: {
          master_id:sessionStorage.getItem("id")
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
    const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4]]]; // include first column header
    const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4]]); // include only first column data
  
    const doc = new jsPDF();
    doc.autoTable({
      head: head ,
      body: body,
    });
    doc.save('converted.pdf');
  };
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
      
                <MainNavbar prop='TRANSLATIONS'/>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
                <div style={{"marginTop":"14vh","marginBottom":"10px"}} className='container-fluid'>
                    <div className="container">
                        <div className="w3-show-inline-block" style={{float:"left",marginBottom:"25px"}}>
                            <div className="w3-bar">
                                <button className="w3-btn hd-btns" onClick={handleAddShow}>ADD </button>
                                <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
                            </div>
                         </div>
                         <div className="w3-show-inline-block" style={{float:"right"}}>
                              <div className="w3-bar">
                              {/* <Link to='/country/excel' onClick={e =>window.sessionStorage.setItem("page","/")}><button className="w3-btn hd-btns">IMPORT</button></Link> */}
                                   <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
                                        <option value="#" selected="selected">EXPORT</option>
                                        <option value="pdf" >EXPORT PDF</option>
                                        <option value="excel" >EXPORT EXCEL</option>
                                   </select>
                                </div>
                         </div>  
                    </div>
                    <div  className='container lan tableRow'>
                    <h4 style={{fontFamily:"futura"}}>{sessionStorage.getItem("text")}({sessionStorage.getItem("id")})</h4>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th style={{width:"20%"}}>
                                    <span>Translation ID</span><br></br>
                                    <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("translation_ID")}} placeholder='search'/>
                                </th> 
                                <th>Translation</th>
                                <th>Language Code</th>
                                <th>Versions</th>
                                <th>Modify</th>
                            </tr>
                        </thead>
                        <tbody>
                        {result.map((item,index)=>(
                            <tr key={index}>
                                <td><input type='checkbox' name='check' onClick={e => handleCheck(e)} value={item.translation_ID}></input></td>
                                <td>{item.translation_ID}[{item.version}]</td>
                                <td>{item.translation}</td>
                                <td>{item.language}</td>
                                <td>  <Link to={`/version/${item.translation_ID}/${sessionStorage.getItem("id")}/${item.language}`}> VIEW</Link></td>
                                <td className='pointer'><div onClick={()=>{handleShow(item)}}><FaEdit size={30}/></div></td>
                            </tr>))}
                        </tbody>
                    </table>
              </div>
  {/* modify translation  */}
  <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Modify Translation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>{}</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Translation</Form.Label>
                  <Form.Control type='text'  onChange={e => setTranslation(e.target.value)} value={translation} autoComplete='off'/>
              </Form.Group>
          </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handlemodify}>Modify</Button>
      </Modal.Footer>
  </Modal>

   {/* add text translation  */}
    <Modal show={addshow} onHide={handleAddClose}>
          <Modal.Header closeButton>
              <Modal.Title>Add Translation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                     <Form.Label><h5>{sessionStorage.getItem("text")}</h5></Form.Label>
                  </Form.Group>
                  <Form.Group className="mb-3"  controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Language  : </Form.Label>
                       <div className="dropdown-container">
                          <Select
                              options={languages}
                              placeholder="Select language"
                              value={lan}
                              onChange={handleSelect}
                              isSearchable={true}
                            />
                      </div>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Translation ID</Form.Label>
                        <Form.Control type='text'  value={trans_id} />
                   </Form.Group>
                   <Form.Group className="mb-3"controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Translation</Form.Label>
                        <Form.Control type='text'  onChange={e => setTranslation(e.target.value)} value={translation} autoComplete='off'/>
                    </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}> Add</Button>
          </Modal.Footer>        
    </Modal>
    </div>
        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
            <div className='row'>
                <div className='col-3'></div>
                <div className='col-6'>
                    <b><i>Graphics Language System</i></b>
                </div>
                <div className='col-3'></div>
            </div>
        </footer>
    </div>
     )
}

export default Textranslation
