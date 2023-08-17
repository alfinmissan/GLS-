import React, { useEffect, useState } from 'react'
import MainNavbar from './mainNavbar'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import {FaEdit} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ConfirmDelete, SuccessMessage } from '../components/PopBoxes';
import {RiFileHistoryFill} from 'react-icons/ri';
import { BlenReqNoHistory} from './History';
import DeleteButton from '../components/DeleteButton';

export const BlendBasedRequirement = () => {
  axios.defaults.headers.common['Authorization'] = Token
  const {blend} = useParams()
  const [data,setData]= useState([])
  const [show,setShow] = useState(false)
  const [value,setValue] = useState()
  const [dropdown,setDropdown] = useState([])
  const [asset,setAsset] = useState([])
  const [trans,setTrans] = useState([])
  const [modifyshow,setModifyShow]= useState(false)
  const [item,setItem] = useState({})
  const [country,setCountry] = useState([])
  const [countryList,setCountryList] = useState([])
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const [excelData, setExcelData] = React.useState(null);
  const [id,setId] = useState([])
  const [smShow,setSmShow] = useState(false)
  const [showhistory,setShowhistory] = useState(false)
  const handleModifyShow =(event)=>{
    console.log(event)
       setItem(event)
       if(event.type=='Translation-ID'){
        setDropdown(trans)
        for (let i = 0; i <trans.length; i++) {
            if(event.code==trans[i].value){
                console.log(i)
                 setValue(trans[i])
            }
          }
    }else if(event.type =='Asset'){
        setDropdown(asset) 
        for (let i = 0; i <asset.length; i++) {
            if(event.code==asset[i].value){
              setValue(asset[i])
            }
          }
    }else{
      setValue(event.value)
    }
    setCountry([])
    for (let i = 0; i <countryList.length; i++) {
      for(let j =0;j<event.country.length;j++){
        if(countryList[i].value===event.country[j]){
          setCountry(oldArray => [...oldArray,countryList[i]])
        }
      }
}
       setModifyShow(true)

  }
 const BlendRequirements = () => axios({
  method: 'get',
  url: Url+'blendRequirements',
  params:{
    blend:blend
  },
}).then(res=>{
  setData(res.data)
})
const DropDowns = () => axios.get(Url+'req/dropdown',{
  'headers':{
    'Authorization': Token
  }
  }).then((res)=>{
    setAsset(res.data.asset)
    setTrans(res.data.req_translation)
    setCountryList(res.data.country)
  })

  useEffect(()=>{
  BlendRequirements()
  DropDowns()
  },[show,modifyshow,id])

 function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios.get(Url+`import/exportBlendRequirements?id=${blend}`,{
    'headers':{
      'Authorization': Token
    },
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
  const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4],sheetData[0][5]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4],row[5]]); // include only first column data

  const doc = new jsPDF();
  doc.autoTable({
    head: head ,
    body: body,
  });
  doc.save('converted.pdf');
};

const handleDelete = ()=>{
  axios({
    method: 'delete',
    url: Url+'blendRequirements',
    data:{
     id:id
    },
  }).then((res)=>{
    setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
    setId([])
  }).catch(error=>{})
}
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
  const historyClose =()=>setShowhistory(false)
  return (
    <div className='blendbased_requirement hd'>
        <DeleteButton module="blend_requirements" param={blend}/>
        <MainNavbar prop='BLEND REQUIREMENTS'/>
        <NotificationContainer/>
        <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
         <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid'> 
          <div className="container">
            <div className="w3-show-inline-block" style={{float:"left"}}>
               <div className="w3-bar">
                 <button className="w3-btn hd-btns" onClick={e=>setShow(true)} >ADD </button>
                 <button className="w3-btn hd-btns" onClick={e=>setSmShow(true)}>DELETE </button>
               </div>
            </div>
               <div className="w3-show-inline-block" style={{float:"right"}}>
                 <div className="w3-bar">
                 <Link to='/blend/requirement/import'><button className="w3-btn hd-btns">IMPORT</button></Link>
                    <select className='w3-btn  hd-btns select-format' name="subject" id="subject" onChange={e=>{download(e.target.value)}}>
                      <option value="" selected="selected">EXPORT</option>
                      <option value="pdf" selected="selected">EXPORT PDF</option>
                      <option value="excel" selected="selected">EXPORT EXCEL</option>
                   </select>
                </div>
              </div>
          </div>


          {/* blend requirement table */}
          <div  className='container lan'>
            <div  className='container lan tableRow' style={{marginTop:"10px"}}>
              <table className='table'>
                <thead>
                    <tr>
                     <th></th>
                     <th>Requirement</th>
                     <th>Type</th>
                     <th>Value</th>
                     <th>Category</th>
                     <th>Countries</th>
                     <th>Modify</th>
                    </tr>
                </thead>
                <tbody>
                 {data.map((item,ind)=>(<tr key={ind}>
                    <td><input type='checkbox' onClick={handleCheck} name='check' value={item._id.$oid}/></td>
                    <td>{item.requirement}</td>
                    <td>{item.type}</td>
                    <td style={item.type=='Asset'?{textAlign:"center"}:{textAlign:"None"}}>{item.type == 'Plain-text'?<>{item.value}</>:item.type=='Asset'?<img src={item.photo} alt='asset' height="40px" width="50px"/>
                     :<>{item.value} - {item.text} </>}</td>
                     <td>{item.category}</td>
                     <td>{item.country.join(", ")}</td>
                    <td style={{textAlign:"center"}} className='pointer'><i style={{cursor:"pointer"}} onClick={e=>handleModifyShow(item)}><FaEdit size={30}/></i></td>
                 </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={showhistory} onHide={historyClose} dialogClassName='custom-dialog-history' scrollable>
            <Modal.Header closeButton>
                <Modal.Title>HISTORY</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BlenReqNoHistory blend={blend}/>
            </Modal.Body>
       </Modal>
        <AddBlendBaseRequirement show={show} setShow={setShow} blend={blend}/>
       {modifyshow && <ModifyBlendRequirement modifyshow={modifyshow} setModifyShow={setModifyShow} countrylist={countryList} blend={blend} item={item} val={value} countrydict={country}/>}
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
    </div>
  )
}


const AddBlendBaseRequirement = (props) => {
    const {show,setShow,blend} = props
    const [requirement,setRequirement] = useState('')
    const [value,setValue] = useState()
    const [dropdown,setDropdown] = useState([])
    const [type,setType] = useState("Plain-text")
    const [error,setError] = useState({})
    const [asset,setaAsset] = useState([])
    const [trans,setTrans] = useState([])
    const [country,setCountry] = useState([])
    const [image,setImage] = useState(false)
    const [countryList,setCountryList] = useState([])
    const [category,setCategory] = useState('')
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const countries = []
    let val = ''
    const handleClose =()=>{
           setShow(false)
    }
    const handleSelect = (data) =>{
      setValue(data)
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
       url: Url+`/url/ast/${data.value}/`,   
    }).then(res=>{
      setImage(res.data.photo)
      // console.log(res.data)
    })
    } 
    const handleCountrySelect = (data) => setCountry(data)
    const handleSubmit = (event)=>{
      event.preventDefault()
      for (let i = 0; i <country.length; i++) {
        countries.push(country[i].value);
      }
        if (type === 'Plain-text'){
          val = value
        }else if(type === 'Asset'){
          val = value.value
        }else{
          val = value.value
        }
        axios({
            method: 'post',
            url: Url+'blendRequirements',
            data:{
              blend:blend,
              requirement:requirement,
              type:type,
              value:val,
              country:countries,
              category:category
            },
          }).then(res=>{
           setRequirement('')
           setValue('')
           setError('')
           setCountry('')
           setImage(false)
           setMessage({
                type:"success",
                message:res.data.message
              })
              setSsShow(true)
              }).catch(error=>{
                setError(error.response.data)
              })
      }
      const Type = (e) =>{
        setType(e.target.value)
        if(e.target.value=='Translation-ID'){
          setImage(false)
            setDropdown(trans)
        }else if(e.target.value =='Asset'){
            setDropdown(asset)  
        }else{
          setImage(false)
        }
    }

    const SelectCategory = (e)=>{
          setCategory(e.target.value)
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
    },[])


  return (
    <Modal show={show} onHide={handleClose} scrollable>
      <NotificationContainer/>
       <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <Modal.Header closeButton>
    <Modal.Title>ADD BLEND REQUIREMENT</Modal.Title>
    </Modal.Header>
    <Modal.Body>
       <Form onSubmit={handleSubmit}>

       <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
       <Form.Label>Requirement</Form.Label>
       <Form.Control type='text' value={requirement} autoComplete='off' style={{width:'100%'}} onChange={e =>setRequirement(e.target.value)}/>
       {Object.keys(error).includes("requirement")?<label className='error'>*{error.requirement[0]}</label>:<></>}
       </Form.Group>

       <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Type :</Form.Label>
            <div className='w-100'>
            <select style={{width:"100%",height:"6vh"}} onChange ={Type}>
            <option value="Plain-text">Plain Text</option>
            <option value="Translation-ID">Translation ID</option>
            <option value="Asset">Asset</option>
           </select>
           </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Value</Form.Label>
            <div className="dropdown-container">
                {
                    type == 'Plain-text' ? 
                    <Form.Control type='text' value={value} onChange={e=>setValue(e.target.value)} autoComplete="off"></Form.Control>:
                    <Select
                    options={dropdown}
                    placeholder="Select value"
                    value={value}
                    onChange={handleSelect}
                    isSearchable={true}
                  />
                }
              {Object.keys(error).includes("value")?<label className='error'>*{error.value[0]}</label>:<></>}
      
             </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Category :</Form.Label>
            <div className='w-100'>
            <select value={category} style={{width:"100%",height:"6vh"}} onChange ={SelectCategory}>
            <option value=''>Select</option>
            <option value="loose tea">Loose Tea</option>
            <option value="tea bag">Tea Bag</option>
           </select>
           </div>
          {Object.keys(error).includes("category")?<label className='error'>*{error.category[0]}</label>:<></>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={countryList}
                    placeholder="Select country"
                    value={country}
                    onChange={handleCountrySelect}
                    isSearchable={true}
                    isMulti
                  />
          </div>
          {Object.keys(error).includes("country")?<label className='error'>*{error.country[0]}</label>:<></>}
            </Form.Group>
            { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
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
  )
}


const ModifyBlendRequirement = (props) =>{
    const {modifyshow,setModifyShow,item,val,countrydict,blend} = props
    const [requirement,setRequirement] = useState(item.requirement)
    const [value,setValue] = useState(val)
    const [dropdown,setDropdown] = useState([])
    const [type,setType] = useState(item.type)
    const [country,setCountry] = useState([...countrydict])
    const [countryList,setCountryList] = useState(item.countryList)
    const [error,setError] = useState({})
    const [image,setImage] = useState(item.photo)
    const [asset,setaAsset] = useState([])
    const [category,setCategory] = useState(item.category)
    const [trans,setTrans] = useState([])
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    let countries = []
    const handleClose =()=>{
           setModifyShow(false)
           setCountry([])
    }
  const handleCountrySelect = (data) => setCountry(data)
  const Type = (e) =>{
        setType(e.target.value)
        if(e.target.value=='Translation-ID'){
          setImage(false)
            setDropdown(trans)
        }else if(e.target.value =='Asset'){
            setDropdown(asset)  
        }else{
          setImage(false)
        }
    }
    
    const handleSelect =(data)=> setValue(data)
    const SelectCategory = (e)=>{
      setCategory(e.target.value)
}
    const handleSubmit = (event)=>{
      event.preventDefault()
      if (type === 'Plain-text'){
        Submit(value)
      }else{
        Submit(value.value)
      }
      }
   function Submit(event){
    if(country.length > 0){
      for (let i = 0; i <country.length; i++) {
        countries.push(country[i].value);
      }
    }else{
       countries = country
    }
      axios({
      method: 'put',
      url: Url+'blendRequirements',
      data:{
        _id:item._id.$oid,
        requirement:requirement,
        type:type,
        blend:blend,
        value:event,
        category:category,
        country:countries
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
    useEffect(()=>{
        axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
              setaAsset(res.data.asset)
              setTrans(res.data.req_translation)
              setCountryList(res.data.country)
              if(type=='Translation-ID'){
                setDropdown(res.data.req_translation)
             }else if(type =='Asset'){
                 setDropdown(res.data.asset)  
             }
            })
           
    },[])

return(<Modal show={modifyshow} onHide={handleClose}>
       <Modal.Header closeButton>
        <NotificationContainer/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
       <Modal.Title>MODIFY BLEND REQUIREMENT</Modal.Title>
       </Modal.Header>
       <Modal.Body>
       <Form onSubmit={handleSubmit}>
       <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
       <Form.Control type='text' value={requirement} autoComplete='off' style={{width:'100%'}} onChange={e =>setRequirement(e.target.value)}/>
       {Object.keys(error).includes("requirement")?<label className='error'>*{error.requirement[0]}</label>:<></>}
       </Form.Group>

       <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Type :</Form.Label>
            <div className="w-100">
            <select style={{width:"100%",height:"6vh"}} id='test' value={type} onChange ={Type}>
            <option value="Plain-text">Plain Text</option>
            <option value="Translation-ID">Translation ID</option>
            <option value="Asset">Asset</option>
            {/* <option value="Asset">Asset</option> */}
           </select>
           </div>
           </Form.Group>
           <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
           <Form.Label>Value</Form.Label>
            <div className="dropdown-container">
                {
                    type == 'Plain-text' ? 
                    <Form.Control type='text' value={value} onChange={e=>setValue(e.target.value)} autoComplete="off"></Form.Control>:
                    <Select
                    options={dropdown}
                    placeholder="Select value"
                    value={value}
                    onChange={handleSelect}
                    isSearchable={true}
                  />
                }
              {Object.keys(error).includes("value")?<label className='error'>*{error.value[0]}</label>:<></>}
      
             </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Category :</Form.Label>
            <div className='w-100'>
              <select value={category} style={{width:"100%",height:"6vh"}} onChange ={SelectCategory}>
                <option value=''>Select</option>
                <option value="loose tea">Loose Tea</option>
                <option value="tea bag">Tea Bag</option>
            </select>
           </div>
          {Object.keys(error).includes("category")?<label className='error'>*{error.category[0]}</label>:<></>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country</Form.Label>
            <div className="dropdown-container">
                    <Select
                    options={countryList}
                    placeholder="Select country"
                    value={country}
                    onChange={handleCountrySelect}
                    isSearchable={true}
                    isMulti
                  />
          </div>
          {Object.keys(error).includes("country")?<label className='error'>*{error.country[0]}</label>:<></>}
            </Form.Group>
            { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
          <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" type='submit'>
       Modify
      </Button>
    </Modal.Footer>
      </Form>
    </Modal.Body>
  </Modal>)
}
export default BlendBasedRequirement

