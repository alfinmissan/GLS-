import React,{useState,useEffect} from 'react'
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {IoSettingsSharp} from 'react-icons/io5'
import { RiDeleteBin6Line} from 'react-icons/ri'
import ModifyUser from './ModifyUser';
import { SuccessMessage } from '../components/PopBoxes';
const User= (props) => {
   const {user} = props
  const [countryDropDown,setDropDownCountry] = useState([])
  const [userData,setUserData] = useState(false) 
  const [data ,setData] = useState([])
  const [show,setShow] = useState(false)
  const [showtable,setShowtable] = useState(true)
  const [id,setId] = useState(false)
  const [message,setMessage] =useState({})
  const [ssShow,setSsShow] = useState(false)
  const handleDelete = (id) =>{
    if (window.confirm('Are you sure you want to delete selected user?')) {
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+"/username",
        params:{
          token:Token
        }
    }).then(res=>{
      if(res.data.id === id){
        window.alert("delete canceled")
      }else{
        axios({
          method: 'delete',
          url: Url+`/url/user/${id}/`,
      }).then(res=>{
       setMessage({
        type:"success",
        message:"User Deleted"
       })
       setSsShow(true)
      }
       )
      }
    })
     
        // window.location.reload()
     
    } else {
      //do nothing
    }
  }

  const handleModify = (id) =>{
    setId(id)
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'get',
      url: Url+`/url/user/${id}/`,
  }).then(res=>{
    setUserData(res.data)
  }
   )
   setShowtable(false)
   setShow(true)
  }
  useEffect(()=>{
    axios.get(Url+'req/dropdown',{
      'headers':{
        'Authorization': Token
      }
      }).then((res)=>{
        setDropDownCountry(res.data.country)
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

   useEffect(()=>{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'get',
      url:Url+"user/groupedview",
      params: {
        user_group:user, 
      }
        }).then((res)=>{
         setData(res.data)
        }).catch(error=>{

        })
},[ssShow])
  return (<div>
    <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
{
  showtable && <div className='user-table'>
    <div  className='container lan tableRow' style={{marginTop:"30px"}}>
      {/* <h1>{prop}</h1> */}
    <table className='table'>
    <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Creation Date</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
    </thead>
      <tbody>
      {
      data.map((item,index)=>(<tr key={index}>
          <td>{index + 1}</td>
          <td>{item.first_name+' '+item.last_name}</td>
          <td>{DateConvert(item.date_joined.$date)}</td>
          <td>{item.user_group}</td>
          <td>
             <div className="row" style={{margin:'0pxs',textAlign:"center"}}>
                <div className="col">
                  <button  className='modify' onClick={e=>handleModify(item.id)}><IoSettingsSharp size={20}/></button> 
                </div>
                <div className="col delete">
                  <button  className='delete' onClick={e=>handleDelete(item.id)}><RiDeleteBin6Line size={20}/></button> 
                </div>
            </div>
          </td>
        </tr>))
        }
      </tbody>
      </table>
      </div>
      
      </div>
}
       {
        userData && <ModifyUser  userData={userData} id={id} countryDropDown={countryDropDown} setShowtable={setShowtable} setUserData={setUserData}/>
      }
  </div>
  )
}

export default User