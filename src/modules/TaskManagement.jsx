import React, { useState } from 'react'
import Footer from '../components/Footer'
import MainNavbar from '../Pages/mainNavbar'
import { Form } from 'react-bootstrap'
import '../css/tasklist.css'
import DatePicker from "react-datepicker"
import PendingTaskTable from '../components/PendingTaskTable'
import CompletedTaskTable from '../components/CompletedTaskTable'
import axios from "axios";
import {Token,Url} from '../context/ApiVariables';
import DeleteButton from '../components/DeleteButton'

function TaskManagement(){
    const [item,setItem] = useState('')
    const [varient,setVarient] = useState('')
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [result,setaResult] = useState(false)
    const [active,setActive] = useState({
        pending:true,
        completed:false

    })
    const [table,setTable] = useState('')
    const handleSubmit = (event) =>{
        event.preventDefault()
        if(active.pending){
            setTable('pending')
        }else{
            setTable('completed')
        }
        axios.defaults.headers.common['Authorization'] = Token
        axios({
          method: 'post',
          url: Url+'task/search',
          params: {
           varient:varient,
           item:item,
           table:table,
           fromdate:startDate,
           todate:endDate,
           usergroup:localStorage.getItem('userGroup')
                }
        
        }).then(res=>{
            setaResult(res.data)
        })
    }
    const handleChange = (event) =>{
        setActive({
        pending:false,
        completed:false
          })
          setActive({[event]:true})
          setaResult(false)
    }

  return (
    <div className='task-list'>
        <DeleteButton module="tasklist" param=""/>
        <MainNavbar prop='TASK LIST'/>
        <div className='task-search'>
    <Form>
        <div className="row">
            <div className="col-6">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <div className="row">
                <div className="col-sm-3">
                <Form.Label>Item Number </Form.Label>
                </div>
                <div className="col-sm-8">
                <Form.Control type='text' value={item} onChange={e=>setItem(e.target.value)}/>
                </div>
            </div>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
            <div className="col-sm-3">
            <Form.Label>Varient Code  </Form.Label>
            </div>
            <div className="col-sm-8">
            <Form.Control type='text' value={varient} onChange={e=>setVarient(e.target.value)}/>
            </div>
        </div>
    </Form.Group>
            </div>
            <div className="col-6">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <div className="row">
            <div className="col-sm-3">
            <Form.Label>DATE </Form.Label>
            </div>
            <div className="col-sm-3" >
            <DatePicker wrapperClassName="datepicker"
      showIcon
      selected={startDate}
      placeholderText='from'
      onSelect={(date) => setStartDate(date)}
      onChange={(date) => setStartDate(date)}
    
                  />
                
            </div>
          <div className="col-sm-1"></div>
            <div className="col-sm-3 datepicker">
            <DatePicker
                 showIcon
                    placeholderText='to'
                    selected={endDate}
                   onChange={(date) => setEndDate(date)}
                  />
            </div>
        </div>
    </Form.Group>
            </div>
        </div>
        <div style={{textAlign:"center"}}><button className="btn btns" onClick={handleSubmit}>Search</button></div>
    </Form>
        </div>
        <div className="w-100">
            <div className="container">
                <div className="row tasklist-headin pointer" >
                    <div className={`col heading " ${active.pending && 'active'}`} onClick={e=>handleChange('pending')}>
                            Pending Task
                    </div>
                    <div className={`col heading " ${active.completed && 'active'}`} onClick={e=>handleChange('completed')}>
                          Completed Task
                    </div>
                </div>
            </div>
        </div>
        <div className='contaier-fluid task-table'>
            {
                active.pending ? <PendingTaskTable result={result} active={active}/> :<CompletedTaskTable  result={result} active={active}/>
            }

        </div>
        <Footer/>
    </div>
  )
}

export default TaskManagement