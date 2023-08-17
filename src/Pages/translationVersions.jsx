import React, { useEffect, useState } from 'react'
import {Table} from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery'
import MainNavbar from './mainNavbar';
import {Token,Url} from '../context/ApiVariables';
import { useParams } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Footer from '../components/Footer';
import { SuccessMessage } from '../components/PopBoxes';
const TranslationVersions  = () =>{
    const [versions,setVersions] = useState([])
    const [version ,setVersion] = useState()
    const {trans_id,master_id,language} = useParams()
    const [text,setText] = useState('')
    const [count,setCount] = useState(0)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
   $("input:checkbox").on('click', function() {
    // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
          // the name of the box is retrieved using the .attr() method
          // as it is assumed and expected to be immutable
          var group = "input:checkbox[name='" + $box.attr("name") + "']";
          // the checked state of the group/box on the other hand will change
          // and the current value is retrieved using .prop() method
          $(group).prop("checked", false);
          $box.prop("checked", true);
      } else {
        $box.prop("checked", false);
      }
   });

   const changeVersion = () => {
       axios.defaults.headers.common['Authorization'] = Token
       axios({
          method: 'post',
          url: Url+'version/change',
          params: {
              language: language,
              master_id:master_id,
              version:version
                  }
            }).then(res=>{
                if(res.data){
                     setMessage({
                type:"success",
                message:"Version changed"
              })
              setSsShow(true)
                            }
              setCount(count+1)
      
              })
             }

  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
          method: 'get',
          url: Url+'trans/version',
          params: {
              language: language,
              trans_id: trans_id
                  }
            }).then(res=>{
                  setVersions(res.data[0].translation[0]) 
                  setText(res.data[0]['_id'])
                          })
         },[count])
    return (
    <div className='hd'>
        <NotificationContainer/>
        <MainNavbar prop='VERSIONS'/>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div style={{"marginTop":"7rem",marginBottom:"20px"}}>
            <h5 style={{fontFamily:"futura"}}>{text}</h5>
        </div>
        <div  className='container lan tableRow' >
            <table className='table'>
                <thead>
                    <tr>
                        <th>select</th>
                        <th>Translation ID</th> 
                        <th>Translation</th>
                        <th>Version number</th>
                    </tr>
                </thead>
                <tbody>
                {versions.map((item,index)=>(
                    <tr key={index}>
                        <td><input type='checkbox' name='check' onClick={()=>setVersion(item.version)}></input></td>
                        <td>{trans_id}[{item.version}]</td>
                        <td>{item.trans}</td>
                        <td>{item.version} {item.currentVersion &&<>[<lable style={{color:"red"}}>Current version</lable>]</>}</td> 
                    </tr>))}
                </tbody>
            </table>
            <button className='vr-set' onClick={changeVersion}>SET AS CURRENT VERSION</button>
        </div>
        <Footer/>
    </div>)
}

export default TranslationVersions