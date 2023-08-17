import React, { useEffect, useState } from 'react';
import MainNavbar from '../Pages/mainNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {IoSettingsSharp} from 'react-icons/io5';
import {TbReport} from 'react-icons/tb';
import {TfiLayoutGrid3Alt} from 'react-icons/tfi';
import {FaTasks} from 'react-icons/fa';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import Footer from '../components/Footer';
import HomeGraph from '../components/HomeGraph';
import ViewerWelcome from '../components/ViewerWelcome';
import { useNavigate } from 'react-router-dom';
const HomePage = () =>{
const navigate = useNavigate()
const [name,setName] = useState(localStorage.getItem('name'))
useEffect(()=>{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'get',
      url: Url+'username',
      params: {
       token:Token,
      }
    }).then(res=>{
      window.localStorage.setItem("name",res.data.name)
      window.localStorage.setItem("userGroup",res.data.user_group)
      window.localStorage.setItem("user_id",res.data.id)
      setName(res.data.name)
    })
},[])    
const handleClick = ()=>{
    navigate('/gridmanagement')
}
    return(
<div className='home-page'>
    <MainNavbar prop='HOME'/>
    <div className="container">
        <div className="row">
            <div className="col-sm-6 welcome-graph">
            { window.localStorage.getItem('userGroup')== "Viewer" ?<ViewerWelcome prop={name}/>:
            <>
                <div className="welcome-box ">
                <h1>Hello  {name}!</h1>
                </div>
                <div className='pointer' onClick={e=>navigate('/task')}><HomeGraph/></div>
               
                 </>}
            </div>
            <div className="col-sm-6 pointer">
                <div className="control-box">
                <div class="container">
        <div className="row">
    { window.localStorage.getItem('userGroup')== "Admin" && <>
        <div className="col-sm" onClick={handleClick}>
            <TfiLayoutGrid3Alt size={50}/>
           <h6> Grid</h6>
        </div>
        <div className="col-sm" onClick={e=>navigate('/task')}>
            <FaTasks  size={50} />
          <h6>Task</h6>
        </div>
</>}
{window.localStorage.getItem('userGroup') == "Graphics Team"? <div className="col-sm" onClick={e=>navigate('/task')}>
            <FaTasks  size={50} />
              <h6>Task</h6>
               </div>:
 window.localStorage.getItem('userGroup') == "UK Sales"? <div className="col-sm" onClick={e=>navigate('/task')}>
            <FaTasks  size={50} />
              <h6>Task</h6>
               </div>: window.localStorage.getItem('userGroup') == "Language Approver"? <div className="col-sm" onClick={e=>navigate('/task')}>
            <FaTasks  size={50} />
              <h6>Task</h6>
               </div>:window.localStorage.getItem('userGroup') == "Editor"?<div className="col-sm" onClick={e=>navigate('/task')}>
            <FaTasks  size={50} />
              <h6>Task</h6>
               </div>:<></>}
        <div className="w-100"></div>
        <div className="col-sm" onClick={e=>navigate('/reports')}>
            <TbReport size={50}/>
            <h6>Report</h6>
        </div>
        <div className="col-sm" onClick={e=>navigate('/usersettings')}>
        <IoSettingsSharp  size={50}/>
        <h6>User Settings</h6>
        </div>
   </div>
</div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
</div>
    )
}
export default HomePage