import React,{useState,useContext} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {ModBlendPopUpContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import { useEffect } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from './PopBoxes';

const ModifyBlend = ({prop}) => {
 console.log(prop)
  const {modifyshow,setModifyShow} = useContext(ModBlendPopUpContext)
  const [blendname,setBlendName] = useState(prop.item.name)
  const [ingredientTeaBag,setIngredientTeaBag] = useState(prop.ingredientTeaBag)
  const [ingredientLooseTea,setIngredientLooseTea] = useState(prop.ingredientLooseTea)
  const [blendTeaBag,setBlendTeaBag] = useState(prop.blendTeaBag)
  const [blendLooseTea,setBlendLooseTea] = useState(prop.blendLooseTea)
  const [teaorigin,setTeaOrigin] = useState(prop.teaorigin)
  const [dropdown,setDropDown] = useState(false)
  const [range,setRange] = useState(prop.range)
  const [rangedropdown,setRangeDropDown] = useState([{label:"Black tea",value:"Black tea"},
                                                      {label:"Green tea",value:"Green tea"},
                                                      {label:"Herbal tea",value:"Herbal tea"},
                                                      {label:"Natural Benefit",value:"Natural Benefit"},
                                                      ])
  const [error,setError] = useState({})
  const [message,setMessage] = useState('')
  const [ssShow,setSsShow] = useState(false)
  const handleSelectIngredientTeaBag = (data) => setIngredientTeaBag(data)
  const handleSelectIngredientLooseTea = (data) => setIngredientLooseTea(data)
  const handleSelectBlendLooseTea = (data) => setBlendLooseTea(data)
  const handleSelectBlendTeaBag= (data) => setBlendTeaBag(data)
  const handleSelectRange = (data) => setRange(data)
  const handleSelectTeaOrigin = (data) =>setTeaOrigin(data)
  
  const handleClose = () =>{ setModifyShow(false)}
  const handleSubmit = (event) =>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
     let blend_tea_bag=''
     let blend_loose=''
     let ingredient_tea_bag=''
     let ingredient_loose=''

        if (blendTeaBag && blendTeaBag.value) {
          blend_tea_bag = blendTeaBag.value;
        }

        if (blendLooseTea && blendLooseTea.value) {
          blend_loose = blendLooseTea.value;
        }

        if (ingredientTeaBag && ingredientTeaBag.value) {
          ingredient_tea_bag = ingredientTeaBag.value;
        }

        if (ingredientLooseTea && ingredientLooseTea.value) {
          ingredient_loose = ingredientLooseTea.value;
        }
    axios({
      method: 'put',
      url: Url+'blend',
      data: {
        id:prop.item._id.$oid,
        name: blendname,
        range: range.value,
        blend_tea_bag:blend_tea_bag,
        blend_loose: blend_loose,
        tea_origin: teaorigin.value,
        ingredient_loose:ingredient_loose ,
        ingredient_tea_bag:ingredient_tea_bag
            }
    
    }).then(res=>{
      setMessage({
        type:"success",
        message:res.data.message
      })
      setSsShow(true)
    }).catch(error=>{
      setError(error.response.data)
    })
  }
  useEffect(()=>{
    axios.get(Url+'req/dropdown',{
      'headers':{
        'Authorization': Token
      }
      }).then((res)=>{
        setDropDown(res.data.req_translation)
      })
  },[])
  return (
          <div>
            <NotificationContainer/>
            <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <Modal show={modifyshow} onHide={handleClose} scrollable>
      <Modal.Header closeButton style={{height:'10vh'}}>
      <Modal.Title>Modify Blend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Blend Name</Form.Label>
           <Form.Control type='text' value={blendname} autoComplete='off' style={{width:'100%'}} onChange={e =>setBlendName(e.target.value)}/>
           {Object.keys(error).includes("name")?<label className='error'>*{error.name[0]}</label>:<></>}
             </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Blend Tea Bag</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select Blend Tea Bag"
                    value={blendTeaBag}
                    onChange={handleSelectBlendTeaBag}
                    isSearchable={true}
                    // isMulti
                  />
                   {Object.keys(error).includes("blend_tea_bag")?<label className='error'>*{error.blend_tea_bag[0]}</label>:<></>}
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Blend  Loose Tea</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select Blend Loose Tea"
                    value={blendLooseTea}
                    onChange={handleSelectBlendLooseTea}
                    isSearchable={true}
                    // isMulti
                  />
                  {Object.keys(error).includes("blend_loose")?<label className='error'>*{error.blend_loose[0]}</label>:<></>}
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ingredient Tea Bag</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select Ingredient Tea Bag"
                    value={ingredientTeaBag}
                    onChange={ handleSelectIngredientTeaBag}
                    isSearchable={true}
                    // isMulti
                  />
                  {Object.keys(error).includes("ingredient_tea_bag")?<label className='error'>*{error.ingredient_tea_bag[0]}</label>:<></>}
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ingredient Loose Tea</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select Ingredient Loose Tea"
                    value={ingredientLooseTea}
                    onChange={handleSelectIngredientLooseTea}
                    isSearchable={true}
                    // isMulti
                  />
                   {Object.keys(error).includes("ingredient_loose")?<label className='error'>*{error.ingredient_loose[0]}</label>:<></>}
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Select Range</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={rangedropdown}
                    placeholder="Select Range"
                    value={range}
                    onChange={ handleSelectRange }
                    isSearchable={true}
                    // isMulti
                  />
                {Object.keys(error).includes("range")?<label className='error'>*{error.range[0]}</label>:<></>}
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tea Origin</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="Select Tea Origin"
                    value={teaorigin}
                    onChange={ handleSelectTeaOrigin}
                    isSearchable={true}
                    // isMulti
                  />
                  {Object.keys(error).includes("tea_origin")?<label className='error'>*{error.tea_origin[0]}</label>:<></>}
             </div>
          </Form.Group>

            
          <center>
         <Modal.Footer style={{height:'10vh'}}>
        <Button variant="secondary" onClick={handleClose}>
         Cancel
        </Button>
        <Button variant="primary" type='submit'>
          Modify
        </Button>
      </Modal.Footer>
        </center>
        </Form>
      </Modal.Body>
    </Modal>
   </div>
  )
}

export default ModifyBlend