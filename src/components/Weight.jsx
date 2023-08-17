import React,{useState,useContext,useEffect} from 'react'
import Card from 'react-bootstrap/Card'
import { RiDeleteBin6Line} from 'react-icons/ri'
import { BsPencil} from 'react-icons/bs'
import { HiPlusSm} from 'react-icons/hi'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import {WeightAddShow,WeightModShow} from '../context/Context';
import AddWeight from './AddWeight'
import ModWeight from './ModWeight'
import { ConfirmDelete, SuccessMessage } from './PopBoxes'

const Weight = () => {
    const [weight,setWeight] = useState([])
    const [modshow,setModShow] = useState(false)
    const [ssShow,setSsShow] = useState(false)
    const [smShow,setSmShow] = useState(false)
    const [message,setMessage] = useState('')
    const [show,setShow] = useState(false)
    const [item,setItem] = useState(false)
    const [id,setId] = useState(false)
    axios.defaults.headers.common['Authorization'] = Token
    useEffect(()=>{
        axios.get(Url+'weight',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
            setWeight(res.data)
            }) 
    },[ssShow,modshow,show])
    const handleSet =(event)=>{
      setId(event)
      setSmShow(true)
    }
    const handleDelete =()=>{
        axios({
            method: 'delete',
            url: Url+'weight',
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
    <div className='weight'>
      <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={handleDelete}/>
      <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
         <div className="w-100 head">
            <h4>Weights</h4>
        </div>
        <div style={{textAlign:"left"}}>
        <Card border="success" style={{ width: '100%',height:'20rem',overflowY:"scroll" }}>
        <Card.Header>
         <div className='row'>
            <div className="col">
            Weights
            </div>
            <div className="col" style={{textAlign:"right"}} onClick={e=>setShow(true)}>
            <HiPlusSm size={35}/> Add
            </div>
            </div>
        </Card.Header>
        <Card.Body>
          {/* <Card.Title>Primary Card Title</Card.Title> */}
          {
            weight.map((item,index)=><div className='row'>
                <div className='col-9 content'><p>{item.weight}</p></div>
                <div className='col' style={{textAlign:"right" }}>
                    <div className="row">
                        <div className="col" onClick={e=>{handleSet(item._id.$oid)}}>
                        <RiDeleteBin6Line size={20}/>
                        </div>
                        <div className="col" style={{textAlign:"center" }} onClick={e=>{setItem(item);
                        setModShow(true)}} >
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
        {show && <WeightAddShow.Provider value={{show,setShow}}>
        <AddWeight/>
        </WeightAddShow.Provider>}
        {modshow && <WeightModShow.Provider value={{modshow,setModShow}}>
            <ModWeight prop={item}/>
            </WeightModShow.Provider>}
    </div>
  )
}

export default Weight