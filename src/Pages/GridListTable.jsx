import React, { useContext, useState } from 'react'
import {ReportGridViewContext,ReportSetGridDataContext} from "../context/Context"
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const GridListTable = (props) => {
  const {grid}= props
  const navigate = useNavigate()
  const handleView = (index)=>{
        if(window.localStorage.getItem('userGroup')=='Admin'||window.localStorage.getItem('userGroup')=='Editor'){
            window.localStorage.setItem('var',grid[index]['varient'])
            window.localStorage.setItem('status',grid[index]['status'])
            if(grid[index]['status']=='Certified'||grid[index]['status']=='Artwork Completed'){
              navigate(`/certified/${grid[index]['varient']}`)
            }else{
              navigate(`/admin/grid/${grid[index]['varient']}`)
            } 
        }else{
          if(grid[index]['status']=='Certified'||grid[index]['status']=='Artwork Completed'){
             navigate(`/grid/view/${grid[index]['varient']}/${true}`)
          }else{
            navigate(`/grid/view/${grid[index]['varient']}/${false}`)
          }
        }
    }
    function DateConvert(string){
        
      let date = new Date(string)
      let month = date.getMonth() + 1    // 11
      let dt =  date.getDate()      // 29
      let year =  date.getFullYear()

      return(dt +'-'+month+'-'+year)
     //  return date
   
   }
  return (
    <div >
        <div className="lan container-fluid gridList">
           <table className="table ">
        <thead>
            <tr>
           { localStorage.getItem('userGroup') !== 'Viewer' ? <>
                <th>Item No</th>
                <th>Varient Code</th>
                <th>Product</th>
                <th>Status</th>
                <th>User</th>
                <th>User Group</th>
                <th>Date</th>
                <th>Grid</th>
                <th>More </th></>: <><th>Item No</th>
                <th>Varient Code</th>
                <th>Product</th>
                <th>Status</th>
                <th>User</th>
                <th>User Group</th>
                <th>Date</th>
                <th>Grid</th></>}
            </tr>
        </thead>
        <tbody>
          {
            localStorage.getItem('userGroup') !== 'Viewer' ?  
              grid.map((item,index)=>(<tr key={index}>
              <td>{item.item}</td>
              <td>{item.varient}</td>
              <td>{item.Description}</td>
              <td>{item.status}</td>
              <td>{item.user}</td>
              <td>{item.user_group}</td>
              <td>{DateConvert(item.date.$date)}</td>
              <td  className='view'><div  className='view' onClick={e=>handleView(index)}>View</div></td>
              <td className='view'><div onClick={e=>{
                window.localStorage.setItem('varient',item.varient)
                window.localStorage.setItem('description',item.Description)
                navigate('/gridflow')
              }}>View</div></td>
              </tr>))
             : grid.map((item,index)=>(<>
              {item.type == 'Certified' &&<tr key={index}>
              <td>{item.item}</td>
              <td>{item.varient}</td>
              <td>{item.Description}</td>
              <td>{item.status}</td>
              <td>{item.user}</td>
              <td>{item.user_group}</td>
              <td>{DateConvert(item.date.$date)}</td>
              <td className='view'><div  className='view' onClick={e=>handleView(index)}>View</div></td>
              {/* <td className='view'><div >View</div></td> */}
              </tr>}</>))
          }
           
            <tr>

            </tr>
        </tbody>
    </table>
    </div>
    </div>
  )
}

export default GridListTable