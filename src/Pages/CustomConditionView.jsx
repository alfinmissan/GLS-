import React, { useState,useEffect, useContext } from 'react'
import {Form} from 'react-bootstrap';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import {FaPlus} from 'react-icons/fa';
import { CustomConditionViewContext} from '../context/Context'
import {IoMdArrowDropdown} from 'react-icons/io'
import CustomConditionModification from '../components/CustomConditionModification';
const CustomConditionView = ({prop}) => {
    const [logic,setLogic] = useState(prop[0].subLogic)
    const [name,setName] = useState(prop[0].name)
    const [show,setShow] = useState(true)
    const [value,setValue] = useState('')
    const {conditon,setCondition} = useContext(CustomConditionViewContext)
    const [dropdown,setDropDown] = useState(false)
    const [maincondition,setMainCondition] = useState(prop[0].mainLogc)
    const [conditions,setConditions] = useState(prop[0].statement)
    const [output,setOutPut] = useState(prop[0].output)
    const [data,setData] = useState([])

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = Token
          axios({
            method: 'get',
            url: Url+'req/dropdown',
                 }).then(res=>{
              setData(res.data.req_translation)
              res.data.req_translation.map(ele=>{
                if(ele.value==output.value){
                    setValue(ele)
                }
            })
                 })
            axios.get(Url+'customcondition/dropdown',{
                'headers':{
                  'Authorization': Token
                }
                }).then((res)=>{
                  setDropDown(res.data)
                })    
        },[])

  return (
    
    <div className="custom-condition-list">
 {
    show &&
 
    <div className="container-fluid" style={{marginBottom:"3vh"}}>
    <h2>CONDITIONS</h2>
    <div className="w-100" style={{textAlign:"left",marginBottom:"30px",marginTop:"3vh"}}>
        <div className="row">
            <div className="col-3"  style={{textAlign:"right",width:"200px",fontFamily:"futura"}}>
            <h4 style={{fontFamily:"Furura"}}> Condition Name</h4>
            </div>
            <div className="col">
            <h3 style={{textAlign:"left"}}>: {name}</h3>
            </div>
            <div className="col" style={{textAlign:"right"}}>
            <button className='btn text-light bg-danger' style={{width:"15vw"}} onClick={e=>setShow(false)}>EDIT</button>
            </div>
        </div>
    </div>
<div className="input">
<div className='condition-cards'>
      <center>                                         
  {
    maincondition.map((items,index)=>(<div key={index}>
  <div className="w-100" style={{textAlign:"left"}}>
    {logic[index] &&
  <div style={{width:"100px",marginTop:"10px",marginBottom:"10px"}}>
    <Form.Control aria-label="Default select example" name='logic' value={logic[index].toUpperCase()} readOnly/>
    </div>}
  </div>
     {
     conditions[index].map((item,ind)=>(<div key={ind}>
      <div class="card" style={{background:"#87878716"}}>
      <div class="card-body">
       <div className="row" style={{alignItems:"center"}}>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Control aria-label="Default select example" name="category" value={item['category'].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}  readOnly
       />
      </div>
        </div>
        <div className="col">
        <div style={{width:"100px",marginBottom:"10px"}}>
      <Form.Control aria-label="Default select example" name="condition" value={item['condition'].toUpperCase()} readOnly/>
    
      </div>
       </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Control aria-label="Default select example" name="value" value={item['value'].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}  readOnly/>

      </div>
        </div>
       </div>  
      </div>
    </div>
    </div>))
     }
       {maincondition[index] ? <div className="w-100">
    <div style={{width:"150px",marginTop:"10px",marginBottom:"10px",textAlign:"center"}}>
      <Form.Control className='text-light bg-info' aria-label="Default select example" value={maincondition[index].toUpperCase()} name="logic"  readOnly/>
    
      </div>
    </div>:<></>}
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
      <Form.Select aria-label="Default select example" value={output.requirement.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())} name="requirement"  readOnly>
            <option value="#">{output.requirement}</option>
            
      </Form.Select>
      </div>
        </div>
        <div className="col">
        <div style={{width:"100px",marginBottom:"10px"}}>
      <Form.Control aria-label="Default select example" value={output.condition.toUpperCase()} name="condition"  readOnly/>
      </div>
       </div>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
        <Form.Control aria-label="Default select example" value={value.label} name="condition"  readOnly />
      </div>
        </div>
    </div>
    </div>
    </div>
    </center>
    </div>
</div>
</div> }
{
    show == false && <CustomConditionModification props={{prop,value}}/>
}
    </div>
 
  )
}

export default CustomConditionView