import React, { useEffect, useState } from 'react'
import {
 Tooltip,
 BarChart,
 XAxis,
 Cell,
 YAxis, PieChart, Pie, ResponsiveContainer ,
 Legend,
 CartesianGrid,
 Bar,
 } from "recharts";
import { CChart } from '@coreui/react-chartjs'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';

export const GraphPage = () => {
const [data,setData] = useState('')
useEffect(()=>{
    axios.defaults.headers.common['Authorization'] =Token
    axios.get(Url+'graph/data',{
     'headers':{
       'Authorization': Token
     }
     }).then((res)=>{
     setData(res.data)
     }) 
},[])

 return (<><div className='container' ><div className='row '><div className='text-center p-5'><h3 className='fs-5 font-bold'>ALL DATA</h3><div className='mt-5'><BarChart
 width={1000}
 height={400}
 data={data.module}
 margin={{
 top: 5,
 right: 30,
 left: 10,
 bottom: 5,
 }}
 barSize={70}><XAxis
 dataKey="name"
 scale="point"
 padding={{ left: 80, right:0}}
 /><YAxis /><Tooltip /><Legend /><CartesianGrid strokeDasharray="3 3" /><Bar dataKey="numbers" fill="#1d4934" background={{ fill: ["#eee"] }} /></BarChart></div></div></div></div></>
 )
} 



export const PieComponent = () =>{
  const [data,setData] = useState([])
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] =Token
      axios.get(Url+'graph/data',{
       'headers':{
         'Authorization': Token
       }
       }).then((res)=>{
       setData(res.data.userdata)
       }) 
  },[])
      
    return (<div className='pieChart container' style={{textAlign:"center",width:"27rem"}}>
        <div className="w-100" ></div>
       <div className="w-100"><h5>USERS</h5></div>
       <div >
       <CChart
            type="polarArea"
            data={{
              labels: ['Admin', 'Editor', 'Viewer', 'Language Approver', 'UK Sales',"Graphics Team"],
              datasets: [
                {
                  data: data,
                  backgroundColor: ['#F67402', '#DAF602', '#38B200', '#009253', '#000492 ','#7A0036'],
                },
              ],
            }}
          />
        </div>
          </div>
      
    );
}



export const Diagram =() =>{

  const [grid,setData] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] =Token
      axios.get(Url+'graph/data',{
       'headers':{
         'Authorization': Token
       }
       }).then((res)=>{
       setData(res.data.grid)
       }) 
  },[])
    return (
        <div className='funnelChart container' style={{width:"27rem"}}>
        <div className="w-100" >
        <div className="w-100"><h5>GRIDS</h5></div>
        <div >
      {grid !== false&& <CChart
          type="doughnut"
          data={{
          labels:["Created"," Approved","Rejected","Certified","Published","Modified","Duplicated","Artwork Completed","Acknowledged","Design Completed"],
          datasets: [
                {
                  backgroundColor: ['#E63F0F ', '#AADB0A', '#0B35B6', '#1BBC98', '#55C811','#D68110','#B90F32','#AADB0A','#1BBC98','#B90F32'],
                  data:grid,
                },
                    ],
                }}
            />}
          </div>
          </div>
          </div>
      
    );

}

export default GraphPage