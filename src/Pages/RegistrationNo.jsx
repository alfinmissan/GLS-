import React,{useState,useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import MainNavbar from './mainNavbar'
import { Url,Token } from '../context/ApiVariables'
import axios from 'axios'
import {FaEdit} from 'react-icons/fa';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {Form} from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import {RiFileHistoryFill} from 'react-icons/ri';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { SuccessMessage } from '../components/PopBoxes'
import { RegNoHistory } from './History'

const RegistrationNo = () => {
    axios.defaults.headers.common['Authorization'] = Token
    const [data,setData] = useState([])
    const {itemNo} = useParams()
    const [row,setRow] = useState(false)
    const [id,setId] = useState([])
    const [show,setShow] = useState(false)
    const [modshow,setModShow] = useState(false)
    const [country,setCountry] = useState()
    const [countryList,setCountryList] = useState()
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [showhistory, setShowhistory] = useState(false);
    const historyShow = () => setShowhistory(true);
    const historyClose = () =>setShowhistory(false)
    const [searchKey,setSearchKey] = useState('')
    const [key,setKey] = useState('')
    const [excelData, setExcelData] = React.useState(null);
    useEffect(()=>{
        axios({
          method: 'get',
          url: Url+'registrationNo',
          params:{
            item:itemNo
          }
        }).then(res=>{   
          setData(res.data)
        })
    },[id,show,modshow])

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
          const handleDelete =()=>{
            if (window.confirm('Are you sure you want to delete selected items?')) {
                axios.defaults.headers.common['Authorization'] = Token
                axios({
                  method: 'delete',
                  url: Url+'registrationNo',
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
                  
                  // window.location.reload()
               
              } else {
                //do nothing
              }
        }
    const handleModify = (item)=>{
        setRow(item)
        setCountry([])
        for (let i = 0; i <countryList.length; i++) {
            if(countryList[i].value===item.country){
              setCountry(countryList[i])
          }
        }
        setModShow(true)
    }
    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setCountryList(res.data.country)
            })   
    },[])
    function download(val) {
        axios({
            method: 'get',
            url: Url+'importexport/regno',
            params:{
              itemNo:itemNo
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
        doc.save(`RegistrationNumber item:${itemNo}.pdf`);
      };
        useEffect(()=>{
      searchData()
    },[searchKey])
    
      const searchData = ()=>{
        let copy = [...data]
        if(searchKey == null || searchKey == undefined || searchKey ==''){
          setData([...copy])
      }else {
        const pattern = new RegExp(`^${searchKey}\\w+`,"i")
        let filtered = copy.filter(obj=>{
          return pattern.test(obj[key])
        })
      setData([...filtered])
        }
        }
  return (
    <div className='hd'>
        <MainNavbar prop="REGISTRATION NUMBER"/>
        <NotificationContainer/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid'>
            <div className="container">
                <div className="w3-show-inline-block" style={{float:"left"}}>
                    <div className="w3-bar">
                        <button className="w3-btn hd-btns" onClick={e=>setShow(true)}>ADD </button>
                        <button className="w3-btn hd-btns" onClick={handleDelete} >DELETE </button>
                    </div>
                </div>
                <div className="w3-show-inline-block" style={{float:"right"}}>
                    <div className="w3-bar">
                        <Link to='/reg/number/import' ><button className="w3-btn hd-btns">IMPORT</button></Link>
                            <select className='w3-btn  hd-btns select-format' name="subject" id="subject"  onChange={e=>{download(e.target.value)}}>
                                <option value="">EXPORT</option>
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
                                {/* <th>
                                    <span>Item No </span><br></br>
                                    <input type='text' style={{width:"100%"}} className='input' placeholder='search'/>
                                </th> */}
                                <th>
                                   Registration No 
                                </th> 
                                <th>
                                   <span>Country</span><br></br>
                                   <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("country")}} placeholder='search'/>
                                </th>
                                <th>MODIFY</th>
                            </tr>
                        </thead>
                        <tbody>
                           {data.map((item,index)=>(<tr key={index}>
                            <td><input type='checkbox' onClick={handleCheck} value={item._id.$oid} name='check'/></td>
                            {/* <td>{item.item}</td> */}
                            <td>{item.registration}</td>
                            <td>{item.country}</td>
                            <td style={{textAlign:"center"}} className='pointer'><i onClick={e=>handleModify(item)}><FaEdit size={30}/></i></td>
                           </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddRegistrationNo show={show} setShow={setShow} item={itemNo}/>
            {row && <ModifyRegistrationNo modshow={modshow} setModShow={setModShow} item={row} cntry={country}/>}
        </div>
        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
            <div className='row'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <b><i>Graphics Language System</i></b>
                </div>
                <div className='col-3'>
                    <b style={{color:"#08265aee",cursor: "pointer"}} onClick={e=>setShowhistory(true)}><RiFileHistoryFill size={20}/>History</b>
                 </div>
            </div>
       </footer>

          <Modal show={showhistory} onHide={historyClose} dialogClassName='custom-dialog-history' scrollable>
              <Modal.Header closeButton>
                  <Modal.Title>HISTORY</Modal.Title>
              </Modal.Header>
          <Modal.Body>
                      <RegNoHistory itemno={itemNo}/>
             </Modal.Body>
         </Modal>
    </div>
  )
}



const AddRegistrationNo =(props)=>{
    const {show,setShow,item} = props
    const [registration,setRegistration] = useState()
    const [country,setCountry] = useState()
    const [countryList,setCountryList] = useState()
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [error,setError] = useState({})
   
    // const [data,setData] =useState({

    // })
    const handleSelectCountry = (e) =>setCountry(e)
    const handleClose = () =>setShow(false)
    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setCountryList(res.data.country)
            })   
    },[])
    const handleAdd = (event)=>{
        axios({
            method: 'post',
            url: Url+'registrationNo',
            data:{
              item:item,
              registration:registration,
              country:country.value, 
            },
          }).then(res=>{
          setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
              setRegistration('')
              setCountry('')
          }).catch(error=>{
            setError(error.response.data)
          }) 
        }
    return(<Modal show={show} onHide={handleClose}>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <Modal.Header closeButton>
                    <Modal.Title>ADD REGISTRATION NUMBER</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control type='text' value={registration} autoComplete='off' style={{width:'100%'}} onChange={e=>setRegistration(e.target.value)} />
                            {Object.keys(error).includes("registration")?<label className='error'>*{error.registration[0]}</label>:<></>}
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Country</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                    options={countryList}
                                    placeholder="Select country"
                                    value={country}
                                    onChange={handleSelectCountry}
                                    isSearchable={true}
                                    // isMulti
                                 />
                                {Object.keys(error).includes("country")?<label className='error'>*{error.country[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleAdd}>Add</Button>
                </Modal.Footer>
           </Modal>)
}


const ModifyRegistrationNo =(props)=>{
    const {modshow,setModShow,item,cntry} = props
    const [registration,setRegistration] = useState(item.registration)
    const [country,setCountry] = useState(cntry)
    const [countryList,setCountryList] = useState()
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const handleClose = () => setModShow(false)
    const handleSelectCountry = (e) =>setCountry(e)
    const [error,setError] = useState({})
    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setCountryList(res.data.country)
            })   
    },[])
    const handleModify = ()=>{
        axios({
            method: 'put',
            url: Url+'registrationNo',
            data:{
              id:item._id.$oid,
              item:item.item,
              registration:registration,
              country:country.value, 
            },
          }).then(res=>{
           setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
          }).catch(error=>{
            setError(error.response.data)
          }) 
    }
    return(<Modal show={modshow} onHide={handleClose}>
                <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <Modal.Header closeButton>
                    <Modal.Title>MODIFY REGSITRATION NO</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control type='text' value={registration} autoComplete='off' style={{width:'100%'}} onChange={e=>setRegistration(e.target.value)}/>
                            {Object.keys(error).includes("registration")?<label className='error'>*{error.registration[0]}</label>:<></>}
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Country</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                    options={countryList}
                                    placeholder="select country"
                                    value={country}
                                    onChange={handleSelectCountry}
                                    isSearchable={true}
                                    // isMulti
                                 />
                                {Object.keys(error).includes("country")?<label className='error'>*{error.country[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleModify}>Modify</Button>
                </Modal.Footer>
            </Modal>)
}








export default RegistrationNo