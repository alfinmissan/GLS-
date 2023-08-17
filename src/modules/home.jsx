import React, { useEffect, useState } from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import '../css/sideBar.css'

const CommentWrapper = ({prop}) => {
  const {showattach,varient} = prop
  const [data,setData] = useState()
  useEffect(()=>{
    axios.defaults.headers.common['Authorization'] =Token
    axios.get(Url+'/lan/list',{
     'headers':{
       'Authorization': Token
     }
     }).then((res)=>{
     setData(res.data)
     })
  })
 

  return (<>
  {
    showattach &&
    <div className='comment-wrapper'>
      <div className="card border-dark mb-3" style={{maxWidth: "22rem"}}>
        <div className="card-header">Comments</div>
         <div className="card-body text-dark">
          <h5 className="card-title">Dark card title</h5>
           <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
           <a className='link'>download attachment</a>
        </div>
     </div>
  </div>
  }
  </>)
}

export default CommentWrapper