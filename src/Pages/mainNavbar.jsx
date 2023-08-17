import React,{useEffect,useState} from 'react'
import '../App.css'
import png from '../files/log.png'
import {IoMdArrowBack} from 'react-icons/io';
import {IoNotifications} from 'react-icons/io5';
import {RxExit} from 'react-icons/rx';
import  Sidebar  from './SlidingMenu';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const MainNavbar = (props) => {
  const {prop,setBackShow,back,change} = props
  const [call,setRecall] = useState(0)
  const navigate = useNavigate()
  const user_group = window.localStorage.getItem('userGroup')
  axios.defaults.headers.common['Authorization'] =Token
  function onClick(){
   if(back){
    setBackShow(!change)
   }else{
    window.history.back()
   }
  }
  const handleClick = ()=>{
    navigate('/')
            }
  const [data,setData] = useState(false)
  useEffect(()=>{
    axios({
        method: 'post',
        url: Url+'view/notification',
        params: {
            user_group:user_group,
        }
    }).then(res=>(
          setData(res.data)
        ))   
        setTimeout(()=>{
          setRecall(call+1)
        },5000)
  },[call])

  const [show,setShow] = useState(false)
  const [toggleclass,setToggleClass] =useState('toggle')
  const Logout = () =>{
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('userGroup')
    window.location.replace('/')
  }
  const handleNotification = () =>{
    axios({
      method: 'delete',
      url: Url+'view/notification',
      params: {
          user_group:window.localStorage.getItem('userGroup'),
      }
  }).then(res=>(
        console.log(res.data)
      ))   
      navigate('/notification')
  }

  return (
    <div> 
     <nav className="navbar navbar-expand-sm" style={{ position:"fixed",top: 0,width:"100%",marginBottom:"12vh"}}>
     <div className="row" style={{width:"100%"}}>
     <div className="col-1" style={{paddingTop:"10px"}}>
     <i onClick={e=>onClick()}><IoMdArrowBack color ="white" size={30}/></i>
     </div>
     <div  style={{paddingLeft:"0px"}} className="col-1 pointer" onClick={handleClick}>
     <img style={{marginLeft:"10px"}} src={png} width='90' height='45' alt="Logo" />
     </div>
     <div className="col-2" style={{left:0}}>
    {/* empty space */}
     </div>
     <div className="col-4">
     <h2>{prop}</h2>
     </div>
     <div className="col-1"></div>
     <div className="col-1"></div>
     <div className="col-2 " style={{paddingRight:"0px"}}>
        <div  className='exit-btn1 pointer' style={{display:"flex",direction:"row",paddingRight:"0px"}}>
        <div onClick={handleNotification}>
        <IoNotifications size={36}/>
        {data ? <span class="position-absolute top-1 start-98 translate-middle badge rounded-pill bg-danger">
                     {data}
                <span class="visually-hidden">unread messages</span>
                </span>:<></>}
        </div>
        <div className='exit-btn pointer'>
          <RxExit color="white" size={30} onClick={Logout}/>
        </div>
        </div>
      </div>
     </div>
     </nav>
     <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/>
    </div>
  )
}

export default MainNavbar