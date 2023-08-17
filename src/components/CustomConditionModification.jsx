import React, { useState,useEffect, useContext } from 'react'
import {Form} from 'react-bootstrap';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {FaPlus} from 'react-icons/fa';
import { CustomConditionViewContext} from '../context/Context'
import {IoMdArrowDropdown} from 'react-icons/io'
import Select from "react-select"
import { RiDeleteBin6Line} from 'react-icons/ri'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';

const CustomConditionModification = ({props}) => {
    const {prop,value} = props
    const [logic,setLogic] = useState(prop[0].subLogic)
    const [name,setName] = useState(prop[0].name)
    const [show,setShow] = useState(false)
    const [val,setValue] = useState(value)
    const {conditon,setCondition} = useContext(CustomConditionViewContext)
    const [dropdown,setDropDown] = useState(false)
    const [maincondition,setMainCondition] = useState(prop[0].mainLogc)
    const [conditions,setConditions] = useState(prop[0].statement)
    const [output,setOutPut] = useState(prop[0].output)
    const [data,setData] = useState([])
    const [message,setMessage] = useState({})
    const [ssShow,setSsShow] = useState(false)
    const statement = {
      category:"country",
      condition:"",
      value:''
    }
  
    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = Token
    
            axios.get(Url+'customcondition/dropdown',{
                'headers':{
                  'Authorization': Token
                }
                }).then((res)=>{
                  setDropDown(res.data)
                }) 
           axios({
             method: 'get',
             url: Url+'req/dropdown',
                 }).then(res=>(
             setData(res.data.req_translation)
                ))
          
      },[])
   
    const setOutPutValue =(event) =>{
        setValue(event)
        setOutPut(prevState => ({
            ...prevState,
            ['value']: event.value}))
    }
    const handleSetOutPut = (event)=>{
      setOutPut({...output,
      [event.target.name]:event.target.value})
    }
    const handleSetStatements = (event,index,ind)=>{
        let copy = conditions
        copy[index][ind][event.target.name]=event.target.value
        setConditions([...copy])
    //  conditions[]
    }
    const handleSetLogic =(event,index)=>{
        let copy = logic
        copy[index] = event.target.value
        setLogic([...copy])
    }
    const handleSetCondition = (event,index) =>{
      if (maincondition[index] == false){
     setConditions([...conditions,[{
        category:"country",
        condition:"",
        value:''
      }]])
      setLogic([...logic,false])
      let copy = maincondition
      copy[index] = event.target.value
      setMainCondition(copy)
      setMainCondition([...maincondition,false])
    }else{
      let copy = maincondition
      copy[index] = event.target.value
      setMainCondition(copy)
      console.log(maincondition)
    }
     }
   const handleUpdate = (event)=>{
    axios({
        method: 'put',
        url: Url+`custom/condition?id=${prop[0]._id.$oid}`,
        data: {
            name : name,
            mainLogc:maincondition,
            subLogic : logic,
            statement : conditions,
            output : output,
            state:prop[0].state
        }
    }).then(res =>
 {
setMessage({
      message:"Costom condition modified",
      type:"success"
    })
    setSsShow(true)
 }
    )
   }
   const handleAddStatement = (event) =>{
    let copy = conditions
    copy[event].push(statement)
   setConditions([...copy])
  }
   const handleRemoveCondition=(index,ind)=>{
    let copy1 = conditions
    let copy2 = logic
    let copy3 = maincondition
    if (copy1.length > 1){
     if (copy1[index].length > 1){
       copy1[index].splice(ind,1)
       setConditions([...copy1]) 
     }else{
       copy1.splice(index,1)
       
       if(copy2.length>1){
         copy2.splice(index,1)
         setLogic([...copy2])
       }
       setConditions([...copy1])
       copy3.splice(index,1)
       setMainCondition([...copy3])
     }
    }else{
     if (copy1[index].length > 1){
       copy1[index].splice(ind,1)
       setConditions([...copy1]) 
     }
    }   
    copy3[copy3.length-1] = false
    setMainCondition([...copy3])
   }
  return (
    <div>
        <div className="container-fluid" style={{marginBottom:"3vh"}}>
          <NotificationContainer/>
          <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
    <h2>CONDITIONS</h2>
    <div className="w-100" style={{textAlign:"left",marginBottom:"30px",marginTop:"3vh"}}>
        <div className="row">
            <div className="col-3" style={{textAlign:"right",fontFamily:"futura",width:"200px",marginTop:"5px"}}>
            <label><h5 style={{fontFamily:"futura"}}> Condition Name</h5> </label>
            </div>
            <div className="col">
            <input className="form-control conditon-name" value ={name} placeholder="Enter condition name" type='text' onChange={e=>setName(e.target.value)}/>
            </div>
        </div>
    </div>
<div className="input">
<div className='condition-cards'>
      <center>                                         
  {
    maincondition.map((items,index)=>(<div key={index}>
  <div className="w-100" style={{textAlign:"left"}}>

  <div style={{width:"100px",marginTop:"10px",marginBottom:"10px"}}>
    <Form.Select aria-label="Default select example" name='logic' value={logic[index]} onChange={e=>{handleSetLogic(e,index)}} >
         <option value="#"></option>
          <option value="or">OR</option>
          <option value="and">AND</option>
    </Form.Select>
    </div>
  </div>
     {
     conditions[index].map((item,ind)=>(<div key={ind}>
      <div class="card" style={{background:"#87878716"}}>
      <div class="card-body">
       <div className="row" style={{alignItems:"center"}}>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" name="category" value={item['category']}  onChange={e=>handleSetStatements(e,index,ind)}
       >
            <option value="#"></option>
            <option value="country">Country</option>
            <option value="factory">Factory</option>
            <option value="language">Language</option>
            <option value="blend">Blend</option>
            <option value="range">Range</option>
            <option value="category">Category</option>
            <option value="tea_form">Tea Form</option>
            <option value="legal_name">Legal name</option>
            <option value="no_of_teabag">No of teabag</option>
            <option value="type">Grid Type</option>

      </Form.Select>
      </div>
        </div>
        <div className="col">
        <div style={{width:"100px",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" name="condition" value={item['condition']}  onChange={e=>handleSetStatements(e,index,ind)}>
            <option value="#"></option>
            <option value="is">Is</option>
            <option value="not">Is Not</option>
      </Form.Select>
      </div>
       </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" name="value" value={item['value']}  onChange={e=>handleSetStatements(e,index,ind)}>
            <option value="#"></option>
            { dropdown &&
              dropdown[item['category']].map((ite,int)=>( <option key={int} index value={ite.value}>{ite.label}</option>  ))
            }
             
      </Form.Select>
      </div>
        </div>
    <div className="col-1 delete" onClick={e=>handleRemoveCondition(index,ind)}>
    < RiDeleteBin6Line  size={20}/>
       </div>
       </div>  
      </div>
    </div>
    </div>))
     }
     <div className="w-100" onClick={e =>handleAddStatement(index)}>
       <button className='btn btn-secondary'>Add</button>
       </div>
    <div className="w-100">
    <div style={{width:"150px",marginTop:"10px",marginBottom:"10px",textAlign:"center"}}>
      <Form.Select className='text-light bg-info' aria-label="Default select example" value={maincondition[index]} name="logic" onChange={e=>handleSetCondition(e,index)}>
            <option value="#"></option>
            <option value="or">OR</option>
            <option value="and">AND</option>
      </Form.Select>
      </div>
    </div>
</div>))
  }
   </center>

    </div>

</div>
<div className="output">
<div>
        <center>
            <IoMdArrowDropdown size={150} fill='green'/>
            <h4>OUTPUT</h4>
      <div class="card" style={{marginBottom:"3vh"}}>
      <div class="card-body">
        <div className="row" style={{alignItems:"center"}}>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" value={output.requirement} name="requirement" onChange={handleSetOutPut}>
      {dropdown && dropdown.requirement.map((item,index)=>(<option key={index} value={item.label}>{item.label}</option>))}
            
      </Form.Select>
      </div>
        </div>
        <div className="col">
        <div style={{width:"100px",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" value={output.condition} name="condition" onChange={handleSetOutPut}>
            <option value="#"></option>
            <option value="is">Is</option>
            <option value="not">Is Not</option>
      </Form.Select>
      </div>
       </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
        <Select
        options={data}
        placeholder="Select output"
        value={val}
        onChange={setOutPutValue}
        isSearchable={true}
        // isMulti={multi}
        />
      </div>
        </div>
    </div>
    </div>
    </div>
    </center>
    </div>

</div>
<button className="btn condition-add-btn" style={{marginBottom:"30px"}} onClick={handleUpdate}> MODIFY</button>
</div> 
    </div>
  )
}

export default CustomConditionModification