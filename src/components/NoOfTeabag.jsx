import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { RiDeleteBin6Line} from 'react-icons/ri'
import { BsPencil} from 'react-icons/bs'
import { HiPlusSm} from 'react-icons/hi'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import AddNoTeaBag from './AddNoTeaBag';
import {TeabagModShow,TeabagAddShow} from '../context/Context';
import ModNoTeaBag from './ModNoTeaBag';
import { ConfirmDelete, SuccessMessage } from './PopBoxes'


const NoOfTeabag = () => {
    const [NoOfTeabag,setNoOfTeabag] = useState([])
    const [modshow,setModShow] = useState(false)
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState('')
    const [show,setShow] = useState(false)
    const [item,setItem] = useState(false)
    const [smShow,setSmShow] = useState(false) 
    const [id,setID]=useState(false)
   
    axios.defaults.headers.common['Authorization'] = Token
    useEffect(()=>{
        axios.get(Url+'tea.bag',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
            setNoOfTeabag(res.data)
            }).catch(error=>{

            })
    },[modshow,show,ssShow,smShow])
    const handleSet =(e)=>{
      setID(e)
      setSmShow(true)
    }
    const handleDelete =()=>{
  
        axios({
            method: 'delete',
            url: Url+'tea.bag',
            params: {
                   id:id
                  }
          }).then(res=>{
          setMessage({
            type:"success",
            message:"Deleted"
          })
          setSsShow(true)
          }).catch(error=>{

          })
    }
 
    
  return (
    <div className='no-of-teabag'>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
           <div className="w-100 head">
            <h4>Number Of Teabag</h4>
        </div>
        <div className='admin-cards' style={{textAlign:"left"}}>
        <Card border="success" style={{ width: '100%',height:'20rem',overflowY:"scroll" }}>
        <Card.Header><div className='row'>
            <div className="col">
            No Of Teabag
            </div>
            <div className="col" style={{textAlign:"right"}} onClick={e=>setShow(true)}>
            <HiPlusSm size={35}/> Add
            </div>
            </div>
            </Card.Header>
        <Card.Body>
          {/* <Card.Title>Primary Card Title</Card.Title> */}
          {
            NoOfTeabag.map((item,index)=><div className='row'>
                <div className='col-9 content'><p>{item.no_of_teabags}</p></div>
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
        {/* <Button onClick={e=>setShow(true)}>Add Number of Teabags</Button> */}
        {show && <TeabagAddShow.Provider value={{show,setShow}}>
        <AddNoTeaBag/>
        </TeabagAddShow.Provider>}
        
        {modshow &&
        <TeabagModShow.Provider value={{modshow,setModShow}}>
             <ModNoTeaBag prop={item}/>
            </TeabagModShow.Provider>
         }
    </div>
  )
}

export default NoOfTeabag