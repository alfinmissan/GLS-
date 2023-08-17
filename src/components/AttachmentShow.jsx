import React,{useContext,useState,useEffect,useRef} from 'react'
import {AttachShowFileContext} from '../context/Context'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import { Form } from 'react-bootstrap';
import {CgAttachment} from 'react-icons/cg';
import {RxCross2} from 'react-icons/rx';
import {IoSend} from 'react-icons/io5';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useNavigate } from 'react-router-dom';
import { SuccessMessage } from './PopBoxes';
const GridAttachment = (props) => {
  const navigate = useNavigate()
  const {showattached,setShowAttached} = useContext(AttachShowFileContext)
  const[data,setData] = useState([])
  const [file,setFile] = useState()
  const messageRef = useRef();
  const [comment,setComment] = useState('')
  const [error,setError] = useState({})
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const {varient,handleSubmit} = props


   function DateConvert(string){
        
    let date = new Date(string)
    let month = date.getMonth()+1     // 11
    let dt =  date.getDate()      // 29
    let year =  date.getFullYear()


    return(dt +'-'+month+'-'+year)
   //  return date

   
 
 }

 const handleSubmited = (event) =>{
  event.preventDefault()
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'url/grid/attachments/',
    headers: { "Content-Type": "multipart/form-data" },
    data: {
            varient:varient,
            comment:comment,
            attachment:file,
            user:localStorage.getItem('name')
          }
  
  }).then(res=>{
  if(res.status >200 && res.status < 300){
        setMessage({
            type:"success",
             message:"comment added to grid"
              })
      setSsShow(true)
    if(window.localStorage.getItem('userGroup')!=='Admin'){

    // navigate('/task')
    }
  setFile()
  setComment('')
  setError({})
  try{
    handleSubmit()
  } catch(error){

  }
  }else{
    NotificationManager.success(res.error)
  }
  }).catch(error=>{
 setError(error.response.data)
  })
  
 }
 useEffect(()=>{
  axios.defaults.headers.common['Authorization'] =Token
  axios({
      method: 'post',
      url: Url+'grid/commentView',
      data:{
          varient:varient
      },
    }).then((res)=>(
      setData(res.data)
    ))

 },[comment,file,showattached])

 useEffect(()=>{
// scroll windowdow to see latest comment
if (messageRef.current) {
  messageRef.current.scrollIntoView(
    {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
}
 },[])

  return (
    <div className='comment-display'>
     <Modal
        size="lg"
        show={showattached}
        onHide={() => setShowAttached(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        scrollable
      >
            <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          Grid Comments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={messageRef}>
            {
            data.map((item,index)=>( <div key={index} className="card" style={{marginBottom:"10px" ,fontFamily:"futura"}}> 
            <div className="card-body">
            <cite style={{float:"right"}} title="Source Title"> {DateConvert(item.datetime.$date)}</cite>
                <blockquote className="blockquote mb-0">
                <p style={{fontFamily:"futura"}}>{item.comment}</p>
                
                <footer className="blockquote-footer">{item.user}<cite style={{float:"right"}} title="Source Title">{item.attachment!=''&&<a className='link' href={Url+"media/"+item.attachment} download='attachment' style={{fontSize:"0.9em",float:"right",
                   }}>download attachment ?</a>}</cite></footer>
                </blockquote>
            </div>
         </div>))
            }
            </div>
        </Modal.Body>
        <div className='w-100 comment_footer' style={{border:"1px solid #e8e7e6",padding:"10px"}}>
          <div className="row">
            <div className="col-1 fileupload">
              <div class="upload-btn-wrapper">
                <button class="btn"><CgAttachment size={20}/></button>
                <input type="file" name="myfile"   onChange={e=>setFile(e.target.files[0])}/>
              </div>
            </div>
            <div className="col">
      <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
        <Form.Control type='text' placeholder='type comment' value={comment} onChange={e=>setComment(e.target.value)}/>
        {Object.keys(error).includes("comment")?<label className='error'>*{error.comment[0]}</label>:<></>}
      </Form.Group>
            </div>
            <div className="col-1"style={{paddingLeft:"0px"}}>
            <button className='btn' type='submit' onClick={handleSubmited}><IoSend size={25}/></button>
            </div>
          </div>
         {/* card for showing selected file */}
         {
          file &&
            <div className="card" style={{background:"#eee",width:"fit-content",marginLeft:"65px",borderRadius: "6px",marginBottom:"0px"}}>   
               <div className="" style={{paddingLeft:"20px",paddingTop:"10px",paddingBottom:"6px",paddingRight:"0",}}>
                  <button className='btn' onClick={e=>setFile(false)} style={{float:"right",marginLeft:"30px",marginTop:"-7px"}}><RxCross2 size={20}/></button>
                   {file.name}
                </div>
            </div>
        }           
       </div>  
        <NotificationContainer/>
      </Modal>
    </div>
  )
}

export default GridAttachment