import React from 'react'
import {MdOutlineWavingHand} from 'react-icons/md';
const ViewerWelcome = ({prop}) => {
  return (
   
   <div className="welcome-box ">

                <h1 className='viewer-welcome'><MdOutlineWavingHand/>Hello {prop}!</h1>
              
   </div>
    
  )
}

export default ViewerWelcome