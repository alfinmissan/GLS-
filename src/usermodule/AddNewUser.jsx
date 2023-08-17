import React, { useState ,useEffect} from 'react'
// import { Form } from 'react-bootstrap'
import {Button} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Select from "react-select"
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { Formik} from 'formik';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import {Token,Url} from '../context/ApiVariables';
import userImage from '../files/user.png'
import { SuccessMessage } from '../components/PopBoxes';


// const {form } = Formik
const schema = yup.object().shape({
  firstName: yup.string().required('Enter first name').max(15,'should be 15 chars maximum').min(1),
  lastName: yup.string().required('Enter second name').max(15,'should be 15 chars maximum').min(1),
  username: yup.string().required('Enter username').min(1,"too short - should be minimum 5 character").max(15,'should be 15 chars maximum'),
  designation: yup.string().required('Enter designation').min(1,"too short - should be minimum 5 character").max(20,'should be 15 chars maximum'),
  role: yup.string().required('Select user role'),
  email: yup.string().email('Not a valid email').required('Enter email'),
});


const AddNewUser = (props) => {
    const {setActive,setUser,setTableView} = props
    const [countryDropDown,setDropDownCountry] = useState([])
    const [country,setCountry] = useState('')
    const [checkfact,setCheckFact] = useState(null)
    const [message,setMessage] = useState('')
    const handleSelectCountry= (data) => setCountry(data)
    const [error,setError] = useState({})
    const [ssShow,setSsShow] = useState(false)
    const [response_message,setResponse] = useState({})
    const [user,setUser2] =useState({
  firstName: '',
  lastName: '',
  username: '',
  designation: '',
  role: '',
  email: '',
})
const refresh = ()=>{
  setUser2({
  firstName: '',
  lastName: '',
  username: '',
  designation: '',
  role: '',
  email: '',
})
}
const [fullname,setFullName] = useState({
  firstName:'',
  lastName:''
})
const handleSetName = (event) =>{ setFullName(prevState => ({
  ...prevState,
  [event.target.name]: event.target.value
}))}

const customStyles = {
  control: base => ({
    ...base,
    width:330,
    // minHeight: 35
  })
};

function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
const submitForm = async (formValues) => {
  console.log(formValues)
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'url/user/',
    data: {
      username: formValues.username,
      password: generatePassword(),
      first_name:formValues.firstName,
      last_name: formValues.lastName,
      email:formValues.email,
      designation:formValues.designation,
      user_group:formValues.role,
      country:formValues.country
          }
  
  }).then(res=>{
  if(res.status == 200){
    setResponse({
      type:"success",
      message:"User Registration Successfull"
    })  
    setSsShow(true)
    setTimeout(()=>{setActive({['addnewuser']:false,
                                ['all']:true})
                                setUser(false)
                                setTableView("all")},2000)
  }else if(res.status == 201){
    console.log(res.data)
    setMessage(res.data)
  }
  }).catch(error=>{
    setError(error.response.data)
  })
};

useEffect(()=>{
  axios.get(Url+'req/dropdown',{
    'headers':{
      'Authorization': Token
    }
    }).then((res)=>{
      setDropDownCountry(res.data.country)
    })
},[])

  return (
    <Formik
      enableReinitialize
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={(values, { setSubmitting }) => {
        submitForm(values, setSubmitting);
    }}
      onChange ={(values)=>{
        handleSetName(values)
      }}
      initialValues={user}
      // handleChange ={(e) => setUser(prevUserInfo => ({...prevUserInfo, [e.target.value]: "name"}))} 
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setFieldValue,
        touched,
        isValid,
        errors,
      }) => (<div className='add_user'>
        <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={response_message}/>
        <div>
          <div className="row" style={{marginBottom:"10px"}}>
            {/* <div className='col-2' style={{paddingBottom:"15px",paddingRight:'0px',marginLeft:"0px",marginBottom:"15px"}}>
              <img style={{marginRight:"0px",paddingRight:'0px'}} src={userImage} width='90' height='90' radius='50%' alt="Logo" />
            </div>
            <div className='col-6' style={{textAlign:"left",marginLeft:"0px",paddingTop:"25px",paddingLeft:'0px'}}> */}
            <h3 style={{fontFamily:"futura"}}>{fullname.firstName + ' ' + fullname.lastName}</h3>
            {/* </div>
            <div className="col-4"></div> */}
          </div>
        </div>
        <form noValidate onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationFormik01">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>First Name</Form.Label> 
                </div>
                <div className="col-sm-8">
              <Form.Control
                type="text"
                name="firstName"
                placeholder='Enter First Name'
                value={values.firstName}
                onChange={e=>{handleChange(e);handleSetName(e)}}
                isValid={touched.firstName &&!errors.firstName}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
               <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
                </div>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationFormik02">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Last Name</Form.Label>
                </div>
                <div className="col-sm-8">
    
                <Form.Control
                type="text"
                name="lastName"
                placeholder='Enter Second Name'
                value={values.lastName}
                onChange={e=>{handleChange(e);handleSetName(e)}}
                isValid={touched.lastName &&!errors.lastName}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
                </div>
              </div>
        
            </Form.Group>
            </Row>
            <Row className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationFormik03">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Designation</Form.Label>
                </div>
                <div className="col-sm-8">
                <Form.Control
                type="text"
                name="designation"
                placeholder='Enter Designation'
                value={values.designation}
                onChange={handleChange}
                isValid={touched.designation && !errors.designation}
                isInvalid={!!errors.designation}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                {errors.designation} 
              </Form.Control.Feedback>
                </div>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationFormik04">
              <div className="row">
            <div className="col-sm-3">
            <Form.Label>Email</Form.Label>
            </div>
            <div className="col-sm-8">
            <Form.Control
                type="email"
                name="email"
                placeholder='example@gmail.com'
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
               {Object.keys(error).includes("email")?<label className='error'>*{error.email[0]}</label>:<></>}
            </div>
            <Form.Control.Feedback type="invalid">
                  {errors.email}
            </Form.Control.Feedback>
           
              </div>
            </Form.Group>
            </Row>

            <Row  className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormikUsername">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Username</Form.Label>
                </div>
                <div className="col-sm-8">
                <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                {Object.keys(error).includes("username")?<label className='error'>*{error.username[0]}</label>:<></>}
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
              
                </div>
              </div>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="validationFormik08">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>User Role</Form.Label>
                </div>
                <div className="col-sm-8">
                <Form.Select aria-label="Default select example"
               name="role"
               onChange={handleChange}
               isInvalid={!!errors.role}>
                    <option   > select user role</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                    <option value="Language Approver">Language Approver</option>
                    <option value="UK Sales">UK Sales</option>
                    <option value="Graphics Team">Graphics Team</option>
                </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.role}
              </Form.Control.Feedback>
                </div>
              </div>
            </Form.Group>
          </Row>
       
       
          <Row  className="mb-2">
            <Form.Group as={Col} md="6" controlId="validationFormik07">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Location</Form.Label>
                </div>
                <div className="col-sm-8">

                <InputGroup hasValidation>
                <Select
                 options={countryDropDown}
                 placeholder="Select location"
                 value={country}
                 name = 'country'
                 onChange={option =>{handleSelectCountry(option);setFieldValue("country", option.label)}}
                 isSearchable={true}
                //  isInvalid={!!errors.factory}
                 isInvalid={!!errors.country}
                 aria-describedby="inputGroupPrepend"
                 styles={customStyles}
                    // isMulti
                  />
                     {Object.keys(error).includes("country")?<label className='error'>*{error.country[0]}</label>:<></>}
                 <Form.Control.Feedback type="invalid">
              </Form.Control.Feedback>
              </InputGroup>
                </div>
              </div>
             
            </Form.Group>
          </Row>

            <div style={{textAlign:"center"}}>
            <button className='btn add-user' type="submit">Create</button>
            </div>
        </form>
      </div>)}
    </Formik>
  )
}

export default AddNewUser