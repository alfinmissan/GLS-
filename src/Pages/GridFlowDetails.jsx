import React, { useState,useEffect } from 'react'
import Footer from '../components/Footer'
import MainNavbar from './mainNavbar'
import axios from 'axios'
import {Token,Url} from '../context/ApiVariables';
import '../css/graph.css'
function GridFlowDetails(){
  const [data,setData] = useState([])
  useEffect(()=>{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'get',
      url: Url+'grid/flow',
      params: {
       varient:window.localStorage.getItem("varient"),
      }
    }).then(res=>{
      setData(res.data)
    })
},[])  

function DateConvert(string){
        
  let date = new Date(string)
  let month = date.getMonth()  + 1   // 11
  let dt =  date.getDate()      // 29
  let year =  date.getFullYear()

  return(dt +'-'+month+'-'+year)
 //  return date

}
  return (
    <div className="report-flow">
    <MainNavbar prop='REPORTS'/>
    <div style={{marginTop:"12vh",paddingTop:"10px"}}>
    </div>
    <div className='grid-flow'>
 
    <div className="w-100"><h2>Duration</h2></div>
    <div className="w-100">
       Varient Code :{window.localStorage.getItem("varient")}
       
      </div>
      <center>
    <div className='flow'>
     
  {
    data.map((item,index)=>(
      <div style={{display:"flex",direction:"row"}}>
        { item.duration !== false ?
      <div style={{display:"flex",direction:"row",textAlign:"center"}}>
          <div className='line' >{item.duration}days</div>
      </div>:<></>}
      <div className="box">
       <div className='w-100'>  <p>{item.user_group}</p></div>
       <div className='line2'></div>
       <div className='status'>{item.status}</div>
       <div className='line3'></div>
       <div className='w-100' > <p>{DateConvert(item.date.$date)}</p></div>
      </div>
    </div>
    ))
  }

    </div>
    </center>
    </div>
    <Footer/>
    </div>
  )
}

export default GridFlowDetails