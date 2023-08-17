import React,{useState,useContext,useEffect} from 'react'
import '../css/admin.css'
import Card from 'react-bootstrap/Card'
import { RiDeleteBin6Line} from 'react-icons/ri'
import { BsPencil} from 'react-icons/bs'
import { HiPlusSm} from 'react-icons/hi'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {TeaFormAddShow,TeaFormModShow} from '../context/Context';
import AddTeaForm from './AddTeaForm'
import ModTeaForm from './ModTeaForm'
import { ConfirmDelete, SuccessMessage } from './PopBoxes'



const TeabagForm = () => {                
    const [teaform,setTeaForm] = useState([])
    const [modshow,setModShow] = useState(false)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    const [show,setShow] = useState(false)
    const [item,setItem] = useState(false)
    const [id,setId] = useState(false)
    const [smShow,setSmShow] = useState(false)
    axios.defaults.headers.common['Authorization'] = Token
    useEffect(()=>{
        axios.get(Url+'teaform',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
            setTeaForm(res.data)
            }) 
    },[show,modshow,ssShow]) 
    const handleSet = (e) =>{
      setId(e)
      setSmShow(true)
    }
    const handleDelete =(event)=>{
        // event.preventDeault()
        axios({
            method: 'delete',
            url: Url+'teaform',
            params: {
                   id:id
                  }
          
          }).then(res=>{
            setMessage({
              type:"success",
              message:"deleted"
            })
            setSsShow(true)
          })
    }
            
  return (
    <div className='teabag-form'>
      <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div className="w-100 head">
            <h4>Teabag Form</h4>
        </div>
       <div className='admin-cards' style={{textAlign:"left"}}>
       <Card border="success" style={{ width: '100%',height:'20rem',overflowY:"scroll" }}>
        <Card.Header>
        <div className='row'>
            <div className="col">
            Teabag Form
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
                <div className='col-9 content'><p>{item.tea_form}</p></div>
                <div className='col' style={{textAlign:"right" }}>
                    <div className="row">
                        <div className="col" onClick={e=>{handleSet(item._id.$oid)}}>
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
     {show && <TeaFormAddShow.Provider value={{show,setShow}}>
             <AddTeaForm />
        </TeaFormAddShow.Provider>}
        {modshow && <TeaFormModShow.Provider value={{modshow,setModShow}}>
            <ModTeaForm prop={item}/>
            </TeaFormModShow.Provider>}
    </div>
  )
}

export default TeabagForm