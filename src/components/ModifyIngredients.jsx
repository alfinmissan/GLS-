import React,{useState,useContext} from 'react'
import { Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import axios from 'axios';
import {ModIngredientPopUpContext} from '../context/Context'
import {Token,Url} from '../context/ApiVariables';
import { useEffect } from 'react';
const ModifyIngredients = ({prop}) => {
    const {modifyshow,setModifyShow} = useContext(ModIngredientPopUpContext)
    const [dropdown,setDropDown] = useState(false)
    const [ingredient,setIngredient] = useState(prop.item.name)
    const [teabag,setTeabag] = useState(prop.teabag)
    const [loosetea,setLooseTea] = useState(prop.loosetea)
    const handleClose = () => setModifyShow(false)
    const handleSelectTeaBag = (data) => setTeabag(data)
    const handleSelectLooseTea = (data) => setLooseTea(data)
    const handleSubmit = (event) =>{
      // event.preventDefault()
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'put',
        url: Url+'ingredient',
        data: {
            id:prop.item._id.$oid,
            name: ingredient,
            tea_bag:teabag.value ,
            loose_trans: loosetea.value
              }
      
      }).then(res=>{
      console.log(res.data)
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
    <Modal show={modifyshow} onHide={handleClose} >
      <Modal.Header closeButton style={{height:'10vh'}}>
      <Modal.Title>MODIFY INGREDIENTS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ingredient Name</Form.Label>
           <Form.Control type='text' value={ingredient} autoComplete='off' style={{width:'300px'}} onChange={e =>setIngredient(e.target.value)}/>
             </Form.Group>
  

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ingredient Translation(Tea Bag)</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="select Translation"
                    value={teabag}
                    onChange={handleSelectTeaBag}
                    isSearchable={true}
                    // isMulti
                  />
             </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ingredient Translation(Loose Tea)</Form.Label>
            <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown}
                    placeholder="select Translation"
                    value={loosetea}
                    onChange={ handleSelectLooseTea}
                    isSearchable={true}
                    // isMulti
                  />
             </div>
          </Form.Group>

          <center>
         <Modal.Footer style={{height:'10vh'}}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Add
        </Button>
      </Modal.Footer>
        </center>
        </Form>
      </Modal.Body>
    </Modal>
   </div>
  )
}

export default ModifyIngredients