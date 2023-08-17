import React, { useEffect, useState } from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function PendingTaskTable(props){
    const navigate = useNavigate()
    axios.defaults.headers.common['Authorization'] = Token
    const [data,setData] = useState([])
    const {result,active} = props
    useEffect(()=>{
        if(active.pending && result){
            setData(result)
        }else{
            FetchData()
        }     
    },[result])
    const FetchData = () =>{
        axios({
            method: 'get',
            url: Url+'task/view',
            params: {
                user_group:window.localStorage.getItem("userGroup")
            }}).then((res)=>{
            setData(res.data)
            })
    }

     function DateConvert(string){
        
         let date = new Date(string)
         let month = date.getMonth() +1     // 11
         let dt =  date.getDate()      // 29
         let year =  date.getFullYear()

         return(dt +'-'+month+'-'+year)
        //  return date
      
      }
      const handleViewGrid = (item) =>{
        if(window.localStorage.getItem('userGroup')=='Admin'){
            if(item.status == 'Certified'){
                navigate(`/certified/${item.varient}`)
            }else{
                navigate(`/admin/grid/${item.varient}`)
            }
        }else if(window.localStorage.getItem('userGroup')=='Editor'){
            navigate(`/admin/grid/${item.varient}`)
        }else if(window.localStorage.getItem('userGroup')=='Graphics Team'){
            navigate(`/grph/tasklist/grid/${item.status}/${item.varient}`)
        }else{
            navigate(`/tasklist/grid/${item.varient}`)
        } 
      }
  return (
    <div  className=' lan taskTable'>
        <center>
        <table className='table  pending-table'>
         <thead>
            <tr>
                <th>
                    No
                </th>
                <th>
                    Item Number
                </th>
                <th>
                    Varient Code
                </th>
                <th>
                    Date 
                </th>
                <th>
                    Action 
                </th>
            </tr>
         </thead>
         <tbody>
            {data&& data.map((item,index)=>(<tr key={index}>
                <td>
                   {index+1}
                </td>
                <td>
                 {item.item}
                </td>
                <td>
                {item.varient}
                </td>
                <td>
               {DateConvert(item.date.$date)}
                </td>
                <td className='view' onClick={e=>{
                    window.localStorage.setItem("var",item.varient)
                    window.sessionStorage.setItem("var",item.varient)
                    window.localStorage.setItem("status",item.status)
                    handleViewGrid(item)
                }}>
                   View
                </td>
            </tr>))}
        </tbody>
        </table>
        </center>
    </div>
  )
}

export default PendingTaskTable