import React, {useEffect, useState,useContext } from 'react'
import Footer from '../components/Footer'
import MainNavbar from '../Pages/mainNavbar'
import ListGroup from 'react-bootstrap/ListGroup';
import { RiDeleteBin6Line} from 'react-icons/ri'
import { IoIosArrowForward} from 'react-icons/io';
import CustomConditionView from '../Pages/CustomConditionView';
import { CustomConditionViewContext} from '../context/Context'
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import { useNavigate } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ConfrimPopUp from '../components/WarningPopUp';
import { SuccessMessage } from '../components/PopBoxes';
import DeleteButton from '../components/DeleteButton';

function CustomCondition({prop}){
  axios.defaults.headers.common['Authorization'] = Token
  const [condition,setCondition] = useState([])
  const [show ,setShow] = useState(true)
  const [data,setData] = useState([])
  const [pop,setPop] = useState(false)
  const [count,setCount] = useState(0)
  const [id,setId] = useState(false)
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
      axios({
        method: 'get',
        url: Url+'custom/condition',
             }).then(res=>(
              setCondition(res.data)
        ))
  },[count])
  const handleSetData =(data) =>{
    setShow(false)
    setData(condition[data])
  }
  const handleDelete = (event) =>{
    axios({
      method: 'delete',
      url: Url+'custom/condition',
      data:{
          id:id
      }
        }).then(res=>{
          setCount(count+1)
          setMessage({
            type:"success",
            message:res.data.message
          })
          setSsShow(true)
        })
  }

  const handleEnable = (id,state)=>{
    axios({
      method: 'post',
      url: Url+'enable/condition',
      params:{
          id:id,
          state:!state
      }
        }).then(res=>{
          if(res.status == 200){
            setCount(count+1)
            setMessage({
              type:"success",
              message:res.data.messsage
            })
            setSsShow(true)
          }
        
        })
  }
  return (
    <div className='custom-condition'>
      <DeleteButton module="cutsom_condition" param=""/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <MainNavbar prop='CUSTOM CONDITION' setBackShow={setShow} change={show} back={!show}/>
        <div className="container-fluid ">
          {show &&
          <div className='custom-condition-list'>
          
          <ListGroup as="ul">
            {condition &&
            <div className="w-100 conditions">
              {
                condition.map((item,index)=>( <ListGroup.Item>
                  <div className="row conditionName" key={index}>
                    <div  style={{float:"left",borderRight:"1px solid gray",width:"50px"}}>
                    {index+1}
                    </div>
                    <div className="col" onClick={e=>{handleSetData(index)}}>
                    <span>  </span>{item.name}
                    </div>
                    <div className="col-1" style={{float:"right"}}>
                      <div style={{float:"right"}} className='enable' onClick={e=>handleEnable(item._id.$oid,item.state)}><button className='btn enable'>{item.state ==true?"Disable":"Enable"}</button></div>
                    </div>
                    <div className="col-1" style={{float:"right"}}>
                      <div style={{float:"right"}} className='delete' onClick={e=>{setPop(true);setId(item._id.$oid)}}> <RiDeleteBin6Line size={25}/></div>
                    </div>
                    <div className="col-1" style={{float:"right"}} onClick={e=>{handleSetData(index)}}>
                      <div style={{float:"right"}}> <IoIosArrowForward size={25}/></div>
                    </div>
                    </div>
                    </ListGroup.Item>))
                     
              }
              
            </div>}
          </ListGroup>
          <NotificationContainer/>
        </div>}
        {show == false &&<CustomConditionViewContext.Provider value={{show,setShow}}>
                 <CustomConditionView prop={[data]}/>
          </CustomConditionViewContext.Provider>}
      </div>
      {show && <div className="w-100" style={{bottom:"5vh",position:""}}>
        <div className="row">
          <div className="col-12">
            <button className='btn main-btns add' onClick={e=>{navigate('/addcondition')}}>Add Condition</button>
          </div>
         {/* <div className="col">
             <button className='btn main-btns bin'>Recyle Bin <RiDeleteBin6Line size={20}/></button>
         </div> */}
        </div>
       </div>}
      <ConfrimPopUp pop={pop} setPop={setPop} message={"are you sure want do delete ?"} title={"Delete Confirmation"} handleConfirm={handleDelete}/>
        <Footer/>
    </div>
  )
}

export default CustomCondition