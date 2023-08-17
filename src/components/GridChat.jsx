import React,{useContext,useState,useCallback, useRef} from 'react'
import {GridChatContext} from '../context/Context'
import Modal from 'react-bootstrap/Modal';
import {IoSend} from 'react-icons/io5';
import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import '../css/chat.css'
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';

const GridChat = ({prop}) => {
    const handleClose = () => setShowChat(false);
    const {showchat,setShowChat} = useContext(GridChatContext)
    const [message,setMessage] = useState('')
    const [receiver,setReceiver] = useState(false)
    const user_id = localStorage.getItem('user_id')
    const [socketUrl, setSocketUrl] = useState(`ws://172.16.1.201:8080/ws/message/${prop}/${user_id}/`);
    const [messageHistory, setMessageHistory] = useState([]);
    const [userlist,setUserList] = useState([])
    const messageRef = useRef();
    const [value,setValue] = useState('')
    const [date1,setDate1] = useState('')
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [name,setName] =useState('')
    const [result,setResult] = useState([])

    useEffect(() => {
      if (lastMessage !== null) {
        const data = JSON.parse(lastMessage.data)
        setMessageHistory(data.message);
        setUserList(data.user_list)
      }
    }, [lastMessage, setMessageHistory]);
    
    useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'search/user',
        params: {
               value:value
              }
      }).then(res=>{
        setResult(res.data)
      })
      
    },[value])

    useEffect(()=>{
      if (messageRef.current) {
        messageRef.current.scrollIntoView(
          {
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
      }
    })
  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('wss://demos.kaazing.com/echo'),
  //   []
  // );

  const handleClickSendMessage = ()=>{ sendMessage(JSON.stringify({
    receiver:receiver.id,message:message,name:localStorage.getItem('name')
    
  }))
  setMessage('')
}
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  function DateConvert(string){
        
    let date = new Date(string)
    let month = date.getMonth()+1     // 11
    let dt =  date.getDate()      // 29
    let year =  date.getFullYear()
    let dte = dt +'-'+month+'-'+year
    return dte
  }

  function TimeConvert(string){
        
    let date = new Date(string)
    let hr = date.getHours()
    let min= date.getMinutes()
    let time = hr +':' +min
    let month1 = date.getMonth()+1     // 11
    let dt1 =  date.getDate()      // 29
    let year1 =  date.getFullYear()
    let dte1 = dt1 +'-'+month1+'-'+year1
    return time
  }
 
 const handleSelectUser = (item)=>{
     setReceiver(item)
     setResult([])
     setValue('')
 }

//   $("input:checkbox").on('scroll',function(){
//     $(".chat-history").css('bottom',$(window).scrollTop()*-1);
// });




  return (
    <>
      <Modal 
       size="lg"
       aria-labelledby="example-modal-sizes-title-lg"
      //  scrollable
       show={showchat} onHide={handleClose}
      >
        <Modal.Header closeButton style={{background:"rgb(113, 194, 132)",color:"white"}}>
            <div className="w-100">
              <div className="row ">
                <div className="col-4 main-title">
                   <label>Chat</label>
                </div>
                <div className="col-6 ">
                    <input type='text' style={{height:"30px"}} className='form-control' value={value} placeholder='search users' onChange={e=>setValue(e.target.value)}/>
                    <ul style={{position:"absolute"}} className='searchbox'>
                    {result.map((item,ind)=>(<div key={ind} className="w-100">
              <div className="user-list row" onClick={e=>handleSelectUser(item)}>
                <div className="user-avatar col-2"><span style={{marginLeft:"6px"}}>{item.avatar}</span></div>
                <div className="user-name col">
                  <label>{item.user}</label><br/>
                </div>
              </div>
             </div>))}
                    </ul>
                </div>
              </div>
            </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row chatbox">
{/* chat users list*/}
            <div className="name-panel"  style={{borderRight:"2px solid gray"}}>
            {
              userlist.map((item,index)=>(<div key={index} className="w-100">
              <div className="user-list row" onClick={e=>handleSelectUser(item)}>
                <div className="user-avatar col-2"><span style={{marginLeft:"8px"}}>{item.avatar}</span></div>
                <div className="user-name col">
                  <label>{item.user}</label><span style={{float:"right",paddingTop:"5px"}}>{DateConvert(item.timestamp.$date)}</span><br/>
                  <span style={{top:"-5px",lineHeight:"3px"}}>{item.message}</span>
                </div>
              </div>
             </div>))
            }
             

            </div>
{/* chat message */}

  {receiver && <div className="col userpanel" style={{}}>
         
              <div className="row user-title">
                <div className="col-2 user-avtr" style={{padding:"auto"}}>
                     <label style={{marginLeft:"10px"}}>{receiver.avatar}</label>
                </div>
                <div className="col user-name">
                  <label>{receiver.user}</label>
                </div>
              </div>
            <div className="chat-history">
                 <ul className="m-b-0"  ref={messageRef}>
                       {messageHistory.map((message, idx) => ( <li className="clearfix" key={idx}>
                            <div style={{textAlign:"center"}}> {idx == 0 ?<>{DateConvert(message.timestamp.$date)}</>:DateConvert(message.timestamp.$date) !== DateConvert(messageHistory[idx].timestamp.$date) ? <>{DateConvert(message.timestamp.$date)}</>:<></>}</div>
                         {
                            Number(user_id) == message.sender && receiver.id == message.receiver?<div className="float-right">
                            <div className="message other-message">
                            <p style={{fontSize:"12px"}}>{TimeConvert(message.timestamp.$date)}</p>
                             <span>{message ? message.message: null} </span> 
                              </div>
                              </div>: Number(user_id) == message.receiver && receiver.id == message.sender?<div>
                            <div className="message my-message">
                            <p className="text-right" style={{fontSize:"12px",fontWeight:"700"}}>{message.name+" "}<span style={{fontSize:"12px",fontWeight:"400",float:"right"}}>{"  "+TimeConvert(message.timestamp.$date)}</span></p>
                             <div>{message ? message.message: null} </div> 
                              </div>
                              </div>:<></>
                          }
                            
                        </li> ))}
                    </ul>
                </div>

                 <>
        <div className="row w-100" style={{}}>
          <div className='col-11'>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} className='form-control'></input>
          </div>
          <div className='col-1' style={{paddingLeft:0}}>
         <button className='btn' onClick={handleClickSendMessage}><IoSend size={25}/></button>
          </div>
        </div>
        </> 
            </div>}

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default GridChat


























// {/* <div>
//             <div className="chat-history">
//                     <ul className="m-b-0"  ref={messageRef}>
//                         {messageHistory.map((message, idx) => ( <li className="clearfix">
//                              {/* {DateConvert(message.timestamp.$date) !== date1 ? <>{date1}</>:<></>} */}
//                           {
//                             localStorage.getItem('token') == message.usertoken ?<div className="float-right">
//                             <div className="message other-message">
//                             {/* <p style={{fontSize:"12px"}}>{TimeConvert(message.timestamp.$date)}</p> */}
//                              <span>{message ? message.content: null} </span> 
//                               </div>
//                               </div>:<div>
//                             <div className="message my-message">
//                             <p className="text-right" style={{fontSize:"12px",fontWeight:"700"}}>{message.user+" "}<span style={{fontSize:"12px",fontWeight:"400",float:"right"}}>{"  "+TimeConvert(message.timestamp.$date)}</span></p>
//                              <div>{message ? message.content: null} </div> 
//                               </div>
//                               </div>
//                           }
                            
//                         </li> ))}
//                     </ul>
//         </div>
//        </div> */}

        {/* <>
        <div className="row w-70" style={{}}>
          <div className='col-11'>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} className='form-control'></input>
          </div>
          <div className='col-1' style={{paddingLeft:0}}>
         <button className='btn' onClick={handleClickSendMessage}><IoSend size={25}/></button>
          </div>
        </div>
        </> */}