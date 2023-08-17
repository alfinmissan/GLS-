import React, { useState,useEffect,useContext} from 'react'
import MainNavbar from '../Pages/mainNavbar'
import axios from 'axios';
import {FaEdit} from 'react-icons/fa';
import {AssetAddPopUPContext,AssetModifyPopUpContext} from '../context/Context'
import AddAsset from '../components/AddAsset';
import ModifyAsset from '../components/ModifyAsset';
import {RiFileHistoryFill} from 'react-icons/ri';
import { AssetHistory } from '../Pages/History';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';
const Asset = () =>{
// console.log(props)
const [data ,setData] = useState([])
const [id,setId] = useState([])
const [item,setItem] = useState([])
const [show,setShow] = useState(false)
const [dropdown,setDropDown] = useState(false)
const [asset,setAsset] = useState(false)
const [showhistory, setHistoryShow] = useState(false)
const [modifyshow,setModifyShow] = useState(false)
const [result,setResult] =useState([])
const [searchKey,setSearchKey] = useState('')
const [message,setMessage] = useState('')
const [ssShow,setSsShow] = useState(false)
const [key,setKey] = useState('')
const handleShow = () => setShow(true)
const handleModifyShow = (param) =>{ 
  setItem(param)
for (let i = 0; i <dropdown.length; i++) {
              if(param.value==dropdown[i].value){
                setAsset(dropdown[i])
              }
            }
  setModifyShow(true)}
const historyClose = () => setHistoryShow(false)
const historyShow = () => setHistoryShow(true)
const handleCheck = (e) => {
 
    // Destructuring
    const { value, checked } = e.target;
    const obj  = id;
      
    console.log(`${value} is ${checked}`);
  
    // Case 1 : The user checks the box
    if (checked) {
      setId([...obj, Number(value)]);
    }
  
    // Case 2  : The user unchecks the box
    else {
      setId(obj.filter((e) => e !== Number(value)))
    }
    // console.log(id)
      };

      // Delete asset items
const handleDelete = (event) => {
  event.preventDefault()
    if (window.confirm('Are you sure you want to delete selected items?')) {
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'delete',
        url: Url+'ast/delete',
        data: {
            id:id
        }
    }).then(res=>{
      const data = res.data 
      if(res.status==200){ 
          setMessage({
              type:"sucsess",
              message:"Asset deleted"
              })
              setSsShow(true)
        setId('')
      }else if(res.status==201){
        alert("delete canceled \n Assets '"+data +"' present in requirements" )
      }
    }
     )
    
        // window.location.reload()
     
    } else {
      //do nothing
    }
  }

  useEffect(()=>{
    axios.get(Url+'req/dropdown',{
        'headers':{
          'Authorization': Token
        }
        }).then((res)=>{
          setDropDown(res.data.asset)
        })
        axios({
          method: 'get',
          url: Url+'url/ast/'
      }).then(res=>{
            setData(res.data)
            setResult(res.data)
      })
},[id,show])

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
return(
    <div className="hd">
      <DeleteButton module="myapp_asset" param=""/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <MainNavbar prop='ASSET'/>
    <div style={{"marginTop":"15vh","marginBottom":"30px"}} className='container'>
    <div className="container">
  <div className="w3-show-inline-block" style={{float:"left"}}>
  <div className="w3-bar">
    <button className="w3-btn hd-btns" onClick={handleShow}>ADD </button>
    <button className="w3-btn hd-btns" onClick={handleDelete}>DELETE </button>
  </div>
  </div>
</div>
  
        <div  className='container lan tableRow' style={{marginTop:"30px"}}>
        <table className='table'>
        <thead>
          <tr>
            <th>Select</th>
            <th style={{width:"30%"}}>
            <span>Asset Name</span><br></br>
        <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("name")}} placeholder='search'/>
            </th>
            <th>Type</th> 
            <th>Preview</th>
            <th>MODIFY</th>
          </tr>
        </thead>
          <tbody>
            {
              result.map((item,index)=>(
                <tr key={index}>
                  <td><input type="checkbox" value={item.id}  onClick={handleCheck}/></td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td style={{textAlign:"center"}}><img src={item.photo} alt={item.name} height="40px" width="50px"/></td> 
                  <td style={{textAlign:"center"}} ><i className='pointer' onClick={e =>{handleModifyShow(item)}}>
                    <FaEdit size={30}/>
                    </i></td>
                </tr>
              ))
            }
          </tbody>
          </table>
          </div>
       {
        show? <AssetAddPopUPContext.Provider value={{show,setShow}}>
          <AddAsset/>
        </AssetAddPopUPContext.Provider>:<></>
       }
  
        {
          modifyshow? <AssetModifyPopUpContext.Provider value={{modifyshow,setModifyShow}}>
                <ModifyAsset props={{item,asset}}/>
          </AssetModifyPopUpContext.Provider>:<></>
        }
    
     
    <Modal show={showhistory} onHide={historyClose}  dialogClassName='' scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <AssetHistory/>
      </Modal.Body>
    </Modal>
<NotificationContainer/>
          </div>
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
)
}


export default Asset