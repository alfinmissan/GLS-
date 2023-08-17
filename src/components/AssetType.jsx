import React,{useState,useContext,useEffect} from 'react'
import '../css/admin.css'
import Card from 'react-bootstrap/Card'
import { RiDeleteBin6Line} from 'react-icons/ri'
import { BsPencil} from 'react-icons/bs'
import { HiPlusSm} from 'react-icons/hi'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {AssetTypeAddShow ,AssetTypeModShow} from '../context/Context';
import AddAssetType from './AddAssetType'
import ModAssetType from './ModAssetType'
import { ConfirmDelete, SuccessMessage } from './PopBoxes'


const AssetType = () => {
    const [teaform,setTeaForm] = useState([])
    const [modshow,setModShow] = useState(false)
    const [show,setShow] = useState(false)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [id,setId] = useState(false)
    const [smShow,setSmShow] = useState()
    const [item,setItem] = useState(false)
    const [count,setCount] = useState(0)
    axios.defaults.headers.common['Authorization'] = Token

    useEffect(()=>{
        axios.get(Url+'assettype',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
            setTeaForm(res.data)
            }) 
    },[modshow,ssShow,show]) 
    const handleSet = (e)=>{
      setId(e)
      setSmShow(true)
    }
    const handleDelete =()=>{
        // event.preventDeault()
        axios({
            method: 'delete',
            url: Url+'assettype',
            params: {
                   id:id
                  }
          
          }).then(res=>{
             setMessage({
              type:"success",
              message:"Deleted"
             })
            setSsShow(true)
          })
    }
       
  return (
    <div>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
        <div className='teabag-form'>
        <div className="w-100 head">
            <h4>Asset Type</h4>
        </div>
       <div className='admin-cards' style={{textAlign:"left"}}>
       <Card border="success" style={{ width: '100%',height:'20rem',overflowY:"scroll" }}>
        <Card.Header>
        <div className='row'>
            <div className="col">
              Asset Type
            </div>
            <div className="col" style={{textAlign:"right"}} onClick={e=>setShow(true)}>
            <HiPlusSm size={35}/> Add
            </div>
            </div>
        </Card.Header>
        <Card.Body>
          {/* <Card.Title>Primary Card Title</Card.Title> */}
          {
            teaform.map((item,index)=><div className='row'>
                <div className='col-9 content'><p>{item.value}</p></div>
                <div className='col' style={{textAlign:"right" }}>
                    <div className="row">
                        <div className="col" onClick={e=>{handleSet(item.id.$oid)}}>
                        <RiDeleteBin6Line size={20}/>
                        </div>
                        <div className="col" style={{textAlign:"center" }} onClick={e=>{setItem(item);
                        setModShow(true)}}>
                        <BsPencil size={20}/>
                        </div>
                    </div>
                   </div>
                   </div>)
          }
          <Card.Text>
           
          </Card.Text>
        </Card.Body>
      </Card>
       </div>
     {show && <AssetTypeAddShow.Provider value={{show,setShow}}>
             <AddAssetType />
        </AssetTypeAddShow.Provider>}
        {modshow && <AssetTypeModShow.Provider value={{modshow,setModShow}}>
            <ModAssetType prop={item}/>
            </AssetTypeModShow.Provider>}
    </div>
    </div>
  )
}

export default AssetType