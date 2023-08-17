import React, { useContext,useState } from 'react'
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import { LanguageAddContext,LanguageAddShowContext } from '../context/Context';

const AddLanPop = ({prop}) => {
const {showLan,setShowLan} = useContext(LanguageAddShowContext)
const {language,setLanguage} = useContext(LanguageAddContext)
const handleClose = () => setShowLan(false)
const handleSelect = (data) => setLanguage(data)
const {lanedited,AddNewLanguage} = prop;
const handleAddLan = (event)=>{
  AddNewLanguage(event)
}
  return (
    <div>
    <Modal show={showLan} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>ADD LANGUAGE</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddLan}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Language</Form.Label>
            <Select
                options={lanedited}
                placeholder="Select Language"
                value={language}
                onChange={handleSelect}
                isSearchable={true}
                   // isMulti
               />
             </Form.Group>      
             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type='submit'>
          Add
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export default AddLanPop