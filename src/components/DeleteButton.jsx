import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Url,Token } from '../context/ApiVariables'
import axios from 'axios'
import { SuccessMessage } from './PopBoxes'

const DeleteButton = (props) => {
    const {module,param} = props
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState("")
    axios.defaults.headers.common['Authorization'] = Token
    const handleDelete = ()=>{
        if(window.confirm("Are you sure want to delete all data")){
             axios({
          method: 'post',
          url: Url+'delete/all',
          params: {
             module:module,
             param:param
          }}).then((res)=>{
         if (res.status ===200){
            setMessage({
              type:"success",
              message:res.data
            })
            setSsShow(true)
            setTimeout(()=>{window.location.reload()},3000)
         }else{
          setMessage({
            type:"error",
            message:res.data
          })
          setSsShow(true)
         }
        
          })
        }
    }

  return (<div style={{position: "fixed", bottom:" 1.5rem", right:" 30px", zIndex:"999"}}>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <Button variant='danger' onClick={handleDelete}>
        Delete All
    </Button>
</div>
)
}

export default DeleteButton