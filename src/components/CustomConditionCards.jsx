import React, { useContext, useEffect, useState } from 'react'
import {Form} from 'react-bootstrap';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {FaPlus} from 'react-icons/fa';
import {CustomCondtionSubLogicContext ,CustomCondtionLogicContext,
        CustomCondtionContext} from '../context/Context'
import { RiDeleteBin6Line} from 'react-icons/ri'

const ConditionCards = () => {
  const [cardno,setCardNo] = useState(false)
  const {logic,setLogic} = useContext(CustomCondtionSubLogicContext)
  const {maincondition,setMainCondition} = useContext(CustomCondtionLogicContext)
  const [dropdown,setDropDown] = useState({"country":[]})
  const {conditions,setConditions} =useContext(CustomCondtionContext)
  const statement = {
    category:"country",
    condition:"",
    value:''
  }

  const handleSelectOperator = (event,index) =>{
     setCardNo(true)
     let copy = logic
     copy[index] = event.target.value
     setLogic(copy)
  }
  const handleSetStatements = (event,row,col)=>{
    console.log(event,row,col)
        let copy = conditions
    copy[row][col][event.target.name] = event.target.value
   setConditions([...copy])
    console.log(conditions)
  }
  const handleAddStatement = (event) =>{
    let copy = conditions
    copy[event].push(statement)
   setConditions([...copy])
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
 
  useEffect(()=>{
    axios.get(Url+'customcondition/dropdown',{
      'headers':{
        'Authorization': Token
      }
      }).then((res)=>{
        setDropDown(res.data)
      })   
  },[])
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
    <div className='condition-cards'>
      <center>                                         
  {
    conditions.map((items,index)=>(<div key={index}>
  <div className="w-100" style={{textAlign:"left"}}>
  <div style={{width:"100px",marginTop:"10px",marginBottom:"10px"}}>
    <Form.Select aria-label="Default select example" name='logic' onChange={e=>handleSelectOperator(e,index)} >
         <option value="#">Select</option>
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
        <div className="col-1">
          
        </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" name="category" value={conditions[index][ind]['category']} onChange={e=>{
        handleSetStatements(e,index,ind)
        }}>
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
      <Form.Select aria-label="Default select example" name="condition" value={conditions[index][ind]['condition']} onChange={e =>handleSetStatements(e,index,ind)}>
            <option value="#">Select</option>
            <option value="is">Is</option>
            <option value="not">Is Not</option>
      </Form.Select>
      </div>
       </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" name="value" value={conditions[index][ind]['value']} onChange={e=>handleSetStatements(e,index,ind)}>
            <option value="#"></option>
            {
              dropdown[conditions[index][ind]['category']].map((ite,int)=>( <option key={int} index value={ite.value}>{ite.label}</option>  ))
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
    { cardno && <div className="w-100"  onClick={e =>handleAddStatement(index)}>
       <button className='btn btn-secondary'>Add</button>
       </div>}
       <div className="w-100">
    <div style={{width:"150px",marginTop:"10px",marginBottom:"10px",textAlign:"center"}}>
      <Form.Select className='text-light bg-info' aria-label="Default select example" name="logic" onChange={e=>handleSetCondition(e,index)}>
            <option value="#">Select</option>
            <option value="or">OR</option>
            <option value="and">AND</option>
      </Form.Select>
      </div>
    </div>
</div>))
  }
   
  
   </center>

    </div>
  )
}

export default  ConditionCards