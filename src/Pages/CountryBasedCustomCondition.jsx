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
import { useParams } from 'react-router-dom';
import { SuccessMessage } from '../components/PopBoxes';

function CountryCustomCondition({prop}){
  axios.defaults.headers.common['Authorization'] = Token
  const [condition,setCondition] = useState([])
  const [show ,setShow] = useState(true)
  const [data,setData] = useState([])
  const navigate = useNavigate()
  const {paramValue} = useParams()
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  useEffect(()=>{
      axios({
        method: 'get',
        url: Url+`customCondtion/Coustrybased/${paramValue}/`,
             }).then(res=>(
              setCondition(res.data)
        ))
       })
  const handleSetData =(data) =>{
    setData(condition[data])
    setShow(false)
   
  }
  const handleDelete = (event) =>{
    axios({
      method: 'delete',
      url: Url+'custom/condition',
      data:{
          id:event
      }
        }).then(res=>{
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
          
          } setMessage({
                type:"success",
                message:""
              })
              setSsShow(true)
        })
  }
  return (
    <div className='custom-condition'>
        <MainNavbar prop='CUSTOM CONDITION'/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div className="container-fluid ">
          {show &&
          <div className='custom-condition-list'>
          
          <ListGroup as="ul">
            {condition &&
            <div className="w-100 conditions">
              {
                condition.map((item,index)=>( <ListGroup.Item>
                  <div className="row conditionName" key={index}>
                    <div  style={{float:"left",borderRight:"1px solid gray",width:"30px"}}>
                    {index+1}
                    </div>
                    <div className="col" onClick={e=>{handleSetData(index)}}>
                    <span>  </span>{item.name}
                    </div>
                    <div className="col-1" style={{float:"right"}}>
                      <div style={{float:"right"}} className='enable' onClick={e=>handleEnable(item._id.$oid,item.state)}><button className='btn enable'>{item.state ==true?"Disable":"Enable"}</button></div>
                    </div>
                    <div className="col-1" style={{float:"right"}}>
                      <div style={{float:"right"}} className='delete' onClick={e=>handleDelete(item._id.$oid)}> <RiDeleteBin6Line size={25}/></div>
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
            <button className='btn main-btns add' onClick={e=>{navigate(`/addCustionCondition/${paramValue}`)}}>Add Condition</button>
          </div>
        </div>
       </div>}
      
        <Footer/>
    </div>
  )
}

export default CountryCustomCondition