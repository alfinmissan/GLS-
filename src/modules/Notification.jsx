import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import MainNavbar from '../Pages/mainNavbar'
import {IoNotificationsOutline} from 'react-icons/io5';
import {SlArrowDown} from 'react-icons/sl';
import {SlArrowUp} from 'react-icons/sl';
import {RxDotFilled} from 'react-icons/rx';
import {BsChatRight} from 'react-icons/bs';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom';
import '../css/chat.css'
function Notifications(){
    const [data,setData] = useState([])
    const [type,setType] = useState('grid')
    const navigate = useNavigate()
    useEffect(()=>{
        fetchNotification()
    },[type])

    function fetchNotification(){
        axios.defaults.headers.common['Authorization'] =Token
        axios({
            method: 'get',
            url: Url+'/view/notification',
        }).then(res=>{
                setData(res.data)   
        })   
    
    }
    function DateConvert(string){
        
        let date = new Date(string)
        let month = date.getMonth() + 1    // 11
        let dt =  date.getDate()      // 29
        let year =  date.getFullYear()

        return(dt +'-'+month+'-'+year)
       //  return date
     
     }
     const handleChange=(data)=>{
      setType(data)
     }

  const [isCollapsed, setIsCollapsed] = useState({});

  const handleToggle = (id) => {
    setIsCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleRedirectPending =(data) =>{
    window.localStorage.setItem("status",data.action)
    if(window.localStorage.getItem('userGroup')=='Admin' || window.localStorage.getItem('userGroup')=='Editor'){
        if(data.action === 'Certified'||data.action==='Artwork Completed'){
            navigate(`/certified/${data.varient}`)
           }else{
            navigate(`/admin/grid/${data.varient}`)
        }
    }else if(window.localStorage.getItem('userGroup') == 'Graphics Team'){
        window.localStorage.setItem("var",data.varient);window.sessionStorage.setItem("var",data.varient)
        navigate(`/grph/tasklist/grid/${data.action}/${data.varient}`)
    }else if(window.localStorage.getItem('userGroup')!=='Viewer'){
        navigate(`/tasklist/grid/${data.varient}`)
    } 
  }
const handleRedirectCompleted = (data)=>{
    window.localStorage.setItem("status","")
    if(window.localStorage.getItem('userGroup')=='Admin' || window.localStorage.getItem('userGroup')=='Editor'){
    if(data.action === 'Certified'||data.action==='Artwork Completed'){
        navigate(`/certified/${data.varient}`)
       }else{
        navigate(`/admin/grid/${data.varient}`)
            }
        }else if(window.localStorage.getItem('userGroup')!=='Viewer'){
        navigate('/tasklist/completed/grid')
       }
}

  const handleRedirectMessage=(data) =>{
    window.localStorage.setItem("status",data.status)
    if(window.localStorage.getItem('userGroup')=='Admin' || window.localStorage.getItem('userGroup')=='Editor'){
        if(data.status=== 'Certified'||data.status==='Artwork Completed'){
            navigate('/certified')
           }else{
            navigate(`/admin/grid/${data.varient}`)
        }
    }else if(window.localStorage.getItem('userGroup') == 'Graphics Team' && data.pending){
        window.localStorage.setItem("var",data.varient);window.sessionStorage.setItem("var",data.varient)
        navigate(`/grph/tasklist/grid/${data.status}/${data.varient}`)
    }else if(window.localStorage.getItem('userGroup')!=='Viewer'){
        if(data.pending){
      navigate(`/tasklist/grid/${data.varient}`)
        }else{
             navigate('/tasklist/completed/grid')
        }
  
    } 
  }
    return(<div className='notification-page'>
        <MainNavbar prop='NOTIFICATION'/>
           <div  className='notification-list' >
            <center>
           <div className="container-fluid">
           <div className="card">
           <div className="card-header">
            <div className="row">
                <div className="col" style={{textAlign:"left"}}>
                 Notifications
                </div>
                <div className="col" style={{float:"right"}}>
                    <div className="row" >
                    <div className='col pointer' style={type=='grid'?{background:"white",height:"50px",marginBottom:"-12px",paddingTop:"10px"}:{paddingTop:"10px"}} onClick={e=>setType('grid')}>
                         <IoNotificationsOutline size={27} color=""/> 
                    </div>
                    <div className='col pointer' style={type=='chat'?{background:"white",height:"50px",marginBottom:"-12px",paddingTop:"10px",marginRight:"10px"}:{paddingTop:"10px"}} onClick={e=>setType('chat')}>
                          <BsChatRight size={25} color=""/>
               <span class="position-absolute top-1 start-98 translate-middle badge rounded-pill bg-danger">
                     {data.count && data.count}
                <span class="visually-hidden">unread messages</span>
                </span>
                    </div> 
                </div>
                </div>
            </div>
           </div>
       <div>
 {type =='grid'?<>
                  { data.grid &&
                    data.grid.map((item,index)=>(<div key={index}>
                        <div className='notification-box'>
            <div className='row w-100 notification-header'  onClick={() => handleToggle(index)}  ><div className="col" style={{textAlign:"left"}}>Notifications JOB:{item._id.field1}</div><div className="col-1">{isCollapsed[index] ?<SlArrowUp size={25}/>:<SlArrowDown size={22}/>}{item["total_matched_count"]>0&&
                <span class="position-absolute top-1 start-98 translate-middle badge rounded-pill bg-danger">
                    {item["total_matched_count"]}
                <span class="visually-hidden">unread messages</span>
                </span>}</div></div>
            {isCollapsed[index] ?  <div className='notification-body'>{item['documents'].map((ite,ind)=>(<>{
               ite.matched_documents.length>0?
               <div className='row  pendig-notification' onClick={e=>handleRedirectPending(ite)}> <div className='col-1'><RxDotFilled size={25}/></div><div className='col' style={{textAlign:"left"}}>{ite.user} {ite.action} varient:{ite.varient} job no:{ite.job} item no:{ite.item}</div><div className="col-2"><p style={{fontSize:"12px"}}>{DateConvert(ite.date.$date)}</p></div></div>
               :
               <div className='row  completed-notification' onClick={e=>handleRedirectCompleted(ite)}> <div className='col-1'></div><div className='col' style={{textAlign:"left"}}>{ite.user} {ite.action} varient:{ite.varient} job no:{ite.job} item no:{ite.item}</div><div className="col-2"><p style={{fontSize:"12px"}}>{DateConvert(ite.date.$date)}</p></div></div>
               
            }
            </>))}</div> :
            <></>}
          </div>
           </div>))

                   }
                 </>
                :<>
                {
               data.chat && data.chat.map((item,index)=> <div key={index} className='row  message-notification' onClick={e=>handleRedirectMessage(item)}> <div className='col-1'><RxDotFilled size={25}/></div><div className='col' style={{textAlign:"left"}}>You have new messages in varient:{item.varient} item no:{item.item}</div><div className="col-2"><p style={{fontSize:"12px"}}>{DateConvert(item.date.$date)}</p></div></div>)
                           }
                           
                 </>
                }
        {/* {data && data.data.map((item,index)=>(<div className="w-90 list" style={item.status?{color:"black",background:"#9BCBBD "}:{}} key={index} onClick={e=>{
       window.localStorage.setItem("var",item.varient);window.sessionStorage.setItem("var",item.varient)
      {item.status ==  true ? window.localStorage.setItem("status",item.action):window.localStorage.setItem("status","")}
       if(window.localStorage.getItem('userGroup')=='Admin' || window.localStorage.getItem('userGroup')=='Editor'){
        if(item.action === 'Certified'||item.action==='Artwork Completed'){
            navigate('/certified')
           }else{
            navigate('/admin/grid')
        }      
        }else if(window.localStorage.getItem('userGroup')==='Graphics Team' && item.status==true){
            navigate(`/grph/tasklist/grid/${item.action}`)
        }
        else if(window.localStorage.getItem('userGroup')!=='Viewer' && item.status==true){
        navigate('/tasklist/grid')
       }else if(window.localStorage.getItem('userGroup')!=='Viewer' && item.status==false){
        navigate('/tasklist/completed/grid')
       }
      
       }}>
       {item.type == 'grid'? <div className="row">
                <div className="col" style={{textAlign:"left"}}>
             {item.user +"  "+ item.action + "  "+ "grid varient"+ " :" + item.varient} 
                </div>
                <div className="col" style={{textAlign:"right"}}>
                {DateConvert(item.date.$date)}
                </div>
            </div>:<div className="row">
                <div className="col" style={{textAlign:"left"}}>
             {"You have new message in grid varient"+ " :" + item.varient} 
                </div>
                <div className="col" style={{textAlign:"right"}}>
                {DateConvert(item.date.$date)}
                </div>
            </div>}
        </div>))} */}
       </div>
           </div>
           </div>
           </center>
           </div>
           <Footer/>
          </div>)
}

export default Notifications