import React from 'react'
import {IoIosLock} from 'react-icons/io';

const UnauthorizedAccess = () => {
    
    const onclick = ()=>{
       window.location.replace('/')
    }
  return (
    <div className='access-denied-page'>
        <div className="warning-box">

        <h1>403</h1>
        <IoIosLock size={100} color='white'/>
        <h2>Access denied</h2>
        <h4 onClick={onclick}>Login ?</h4>

        </div>
    </div>
  )
}

export default UnauthorizedAccess