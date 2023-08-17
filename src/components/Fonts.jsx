import React, { useEffect, useState } from 'react'
import '../css/admin.css'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import Card from 'react-bootstrap/Card'
import { PropaneOutlined } from '@mui/icons-material';
import {UploadFontFileShowContext} from '../context/Context'
import UploadFont from './UploadFont';

const Fonts = () => {
const [data,setData] = useState([])
const [lan,setLan] = useState('')
const [show,setShow] = useState(false)
useEffect(()=>{
  axios.get(Url+'fontlist',{
    'headers':{
      'Authorization': Token
    }
    }).then((res)=>{
    setData(res.data)
    }) 
},[show])
  return (
    <div className='fonts'>
           <div className="w-100 head">
            <h4>Fonts</h4>
            </div>
            <div className='admin-cards' style={{textAlign:"left"}}>
            <Card border="success" style={{ width: '100%',height:'20rem',overflowY:"scroll" }}>
        <Card.Header>
        <div className='row font-heading'>
                <div className='col-5'><p>Language Code</p></div>
                <div className='col-5'><p>Font Name</p></div>
                <div className='col-2' style={{textAlign:"center"}}><p>Upload File</p></div>
                </div>
        </Card.Header>
        <Card.Body>
          {/* <Card.Title>Primary Card Title</Card.Title> */}
        
          {
            data.map((item,index)=><div className='row fonts'>
                <div className='col-5'><p>{item.language}</p></div>
                <div className='col-5'><p>{item.name}</p></div>
                <div className='col-2' style={{textAlign:"center"}}><p><button type="button" class="btn upload" onClick={e=>{
                  setLan(item.language);setShow(true)
                }}>Upload</button></p></div>
                </div>)
          }
          <Card.Text>
           
          </Card.Text>
        </Card.Body>
      </Card>
           </div>
           {
            show && <UploadFontFileShowContext.Provider value={{show,setShow}}>
              <UploadFont prop={lan}/>
            </UploadFontFileShowContext.Provider>
           }
    </div>
  )
}


export default Fonts