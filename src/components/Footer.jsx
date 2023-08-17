import { textAlign } from '@mui/system';
import React from 'react'
import {RiFileHistoryFill} from 'react-icons/ri';

const Footer = ({prop}) => {
    // const {historyShow} = prop
  return (
    <div >
        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true",textAlign:"center"}}>
       
        <b ><i>Graphics Language System</i></b>
       
     
    </footer>
    </div>
  )
}

export default Footer