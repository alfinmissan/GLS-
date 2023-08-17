import React, { useContext, useState,useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {HiOutlineUpload} from 'react-icons/hi';
import {RxDownload} from 'react-icons/rx';
import {FcDocument} from 'react-icons/fc'
import {GridDocumentsAttchmentContext} from '../context/Context'
import { Form } from 'react-bootstrap'
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import { RiDeleteBin6Line} from 'react-icons/ri'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { flatMap } from 'lodash';
import { SuccessMessage } from './PopBoxes';

export default function DocumentView({prop}) {
  const {topRightModal, setTopRightModal} = useContext(GridDocumentsAttchmentContext);
  const [file,setFile] = useState()
  const handleClose= () => setTopRightModal(!topRightModal);
  const [data,setData] = useState([])
  const [salesReport,setSalesReport] = useState(false)
  const [isChecked, setIsChecked] = useState(false);
  const [count,setCount] = useState(0)
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  axios.defaults.headers.common['Authorization'] =Token

 
  const handleDelete = (e,id)=>{
    e.preventDefault()
    axios({
      method: 'delete',
      url: Url+'doc/view',
      params:{
          id:id
      },
    }).then((res)=>{
          setMessage({
                  type:"success",
                   message:res.data.message
                    })
              setSsShow(true)
      setFile(res.data)
      
  })
  }
  const handleSubmit = (event)=>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token

    if(isChecked){
    axios({
      method: 'post',
      url: Url+'/url/salesReport/',
      headers: { "Content-Type": "multipart/form-data" },
      data: {
              varient:prop,
              file:file,
            }
    
    }).then(res=>{
    if(res.status >200 && res.status < 300){
      setFile('')
      setIsChecked(false)
         setMessage({
            type:"success",
            message:"Sales report uploaded"
             })
            setSsShow(true)
    }else{
      // NotificationManager.success(res.error)
    }
    })}else{
      axios({
        method: 'post',
        url: Url+'url/grid/documents/',
        headers: { "Content-Type": "multipart/form-data" },
        data: {
                varient:prop,
                attachment:file,
              }
      
      }).then(res=>{
      if(res.status >200 && res.status < 300){
        setFile('')
            setMessage({
                 type:"success",
                 message:"Attachment  uploaded"
                    })
            setSsShow(true)
      }else{
        // NotificationManager.success(res.error)
      }
      })
    }
  }
  const handleDeleteSalesReport =()=>{
    if (window.confirm('Are you sure you want to delete selected items?')) {
        axios({
          method: 'delete',
          url: Url+'url/salesReport/',
          params: {
            varient:prop
          }
      }).then(res=>{
        NotificationManager.error(res.data.message)
        setSalesReport(false)
        setIsChecked(false)
        // setCount()
      }
      )
    }}
  useEffect(()=>{
    let data = axios({
        method: 'get',
        url: Url+'doc/view',
        params:{
            varient:prop
        },
      }).then((res)=>(
        setData(res.data)
      ))
    let salesReport = axios({
      method: 'get',
      url: Url+'/url/salesReport/',
      params:{
          varient:prop
      },
    }).then((res)=>{
      if(res.data.length > 0)
      setSalesReport(res.data)
    })
   },[file,count])

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Modal show={topRightModal} onHide={handleClose}  scrollable>
            <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
          <Modal.Header closeButton style={{background:"#eeee",fontFamily:"futura"}}>
              <Modal.Title>DOCUMENTS ATTACHMENT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {salesReport &&<> {window.localStorage.getItem('userGroup') == 'UK Sales' || window.localStorage.getItem('userGroup') == 'Admin'?
                    <div style={{padding:"5px",borderRadius:"5px !important",background:"#eeee",marginBottom:"10px"}}>
                          <h6 style={{fontFamily:"futura",textAlign:"center"}}>Sales Report</h6>
                          <div class="card" style={{marginBottom:"3px"}}>
                              <div class="card-body">
                                    <div className="row">
                                         <div className="col-10"><FcDocument/>{salesReport[0]['file'].substring(salesReport[0]['file'].lastIndexOf('/') + 1)}</div>
                                          <div className="col-2">
                                          {window.localStorage.getItem('userGroup') == 'Admin' && 
                                              <div style={{float:"right"}} className='delete' onClick={handleDeleteSalesReport}> <RiDeleteBin6Line size={20}/></div>}
                                              <div style={{float:"right",paddingRight:"2px"}} className='delete'> <a href={Url+salesReport[0]['file']} download='langaugefile'><RxDownload size={20}/></a></div>
                                          </div>
                                    </div>
                              </div>
                          </div>
                        </div>:<></>}</>}
              {data.map((item,index)=>(
                <div class="card" key={index} style={{marginBottom:"3px"}}>
                    <div class="card-body">
                        <div className="row">
                            <div className="col-10"><FcDocument/>{item.name}</div>
                             <div className="col-2">
                                {window.localStorage.getItem('userGroup') == 'Admin' && 
                                <div style={{float:"right"}} className='delete' onClick={e=>{handleDelete(e,item.id.$oid)}}> <RiDeleteBin6Line size={20}/></div>}
                                <div style={{float:"right",paddingRight:"2px"}} className='delete'> <a href={item.file} download='langaugefile'><RxDownload size={20}/></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                      ))
                }
        </Modal.Body>
       { window.localStorage.getItem('userGroup') == 'Admin' &&<Modal.Footer style={{ justifyContent: 'flex-start' }}>
            <Form  onSubmit={handleSubmit}>
               <div className="row">
                    <div style={{width:"90%"}}>
                        <Form.Group  controlId="exampleForm.ControlInput1">
                         {salesReport ?<></>:
                            <Form.Check type="checkbox" label="Attach sales report" checked={isChecked} onChange={handleCheckboxChange} />}
                            <Form.Control type='file'   onChange={e=>setFile(e.target.files[0])}/>
                        </Form.Group>
                    </div>
                    <div  style={{width:"10%"}}>
                        <button className='btn'  style={salesReport ?{background:"#eeee"}:{marginTop:"25px",background:"#eeee"}} type='submit'>upload</button>
                    </div>
                </div> 
            </Form>
        </Modal.Footer>}
      </Modal>
      <NotificationContainer/>
    </>
  );
}