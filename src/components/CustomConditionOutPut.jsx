import React,{useContext, useEffect, useState} from 'react'
import {Form} from 'react-bootstrap';
import {IoMdArrowDropdown} from 'react-icons/io'
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import Select from "react-select"
import { CustomConditionOutPutContext} from '../context/Context'

const CustomConditionOutPut = () => {
  const [dropdown,setDropDown] = useState([])
  const [data,setData] = useState([])
  const [value,setValue] = useState('')
  const {output,setOutPut} = useContext(CustomConditionOutPutContext)
  const handleSetValue = (data)=>{setValue(data)
    setOutPut(prevState => ({
      ...prevState,
      ['value']: data.value}))
  }

  useEffect(()=>{
    axios.defaults.headers.common['Authorization'] = Token
    axios.get(Url+'customcondition/dropdown',{
      'headers':{
        'Authorization': Token
      }
      }).then((res)=>{
        setDropDown(res.data.requirement)
      })
      axios({
        method: 'get',
        url: Url+'req/dropdown',
    }).then(res=>(
          setData(res.data.req_translation)
        ))
  },[])
  const handleSetOutPut = (event)=>{
    setOutPut(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
  }))
  }
  return (
    <div>
        <center>
            <IoMdArrowDropdown size={140} fill='#E1721B'/>
            <h4>OUTPUT</h4>
      <div className="card" style={{marginBottom:"3vh",background:"#EDEEE9"}}>
      <div className="card-body">
        <div className="row" style={{alignItems:"center"}}>
        <div className="col">
        <div style={{width:"20vw",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" value={output.requirement} name="requirement" onChange={handleSetOutPut}>
            <option value="#"></option>
            {dropdown.map((item,index)=>(<option key={index} value={item.label}>{item.label}</option>))}
      </Form.Select>
      </div>
        </div>
        <div className="col">
        <div style={{width:"100px",marginBottom:"10px"}}>
      <Form.Select aria-label="Default select example" value={output.condition} name="condition" onChange={handleSetOutPut}>
            <option value="#">Select</option>
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
        value={value}
        onChange={handleSetValue}
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
  )
}

export default CustomConditionOutPut