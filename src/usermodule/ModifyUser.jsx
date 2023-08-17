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
import { event } from 'jquery';
import { SuccessMessage } from '../components/PopBoxes';


// const {form } = Formik
const schema = yup.object().shape({
  firstName: yup.string().required().max(15,'should be 15 chars maximum').min(1),
  lastName: yup.string().required().max(15,'should be 15 chars maximum').min(1),
  username: yup.string().required().min(1,"too short - should be minimum 5 character").max(15,'should be 15 chars maximum'),
  designation: yup.string().required().min(1,"too short - should be minimum 5 character").max(20,'should be 15 chars maximum'),
  // password: yup.string().required('No password provided.') 
  // .min(8, 'Password is too short - should be 8 chars minimum.')
  // .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, 'Password must conatain special symbol eg:@, digit eg:1,2,3.'),
  role: yup.string().required(),
  // factory: yup.string().required(),
  email: yup.string().email().required(),
});


const ModifyUser = (props) => {
    // console.log(props)
const {userData,id,countryDropDown,setUserData,setShowtable} = props 
const [countryDropDowns,setDropDownCountry] = useState([])
const [checkfact,setCheckFact] = useState(null)
const [message,setMessage] = useState('')
const [response_message,setResponse] = useState({})
const [ssShow,setSsShow] = useState()
let country 
countryDropDown.map(element=>{
    if(element.label==props.userData.country){
            country = element
    }
  })

  const customStyles = {
    control: base => ({
      ...base,
      width:330,
      // minHeight: 35
    })
  };
const reload = (event) =>{
  event.preventDefault()
        setShowtable(true)
        setUserData(false)
}
const [user,setUser] =useState({
  firstName:userData.first_name,
  lastName: userData.last_name,
  username:userData.username,
  designation:userData.designation,
  country:country,
  role: userData.user_group,
  email: userData.email,
  // password: '',
})
const [fullname,setFullName] = useState({
  firstName:userData.first_name,
  lastName:userData.last_name
})
const handleSetName = (event) =>{ setFullName(prevState => ({
  ...prevState,
  [event.target.name]: event.target.value
}))}

const submitForm = async (formValues) => {
  console.log(formValues)
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'put',
    url: Url+`url/user/${id}/`,
    data: {
      username: formValues.username,
      // password: formValues.password,
      first_name:formValues.firstName,
      last_name: formValues.lastName,
      email:formValues.email,
      designation:formValues.designation,
      user_group:formValues.role,
      country:formValues.country.label
          }
  
  }).then(res=>{
  if(res.status == 200){
      setResponse({
            type:"success",
            message:"User Details Updated"
      })
      setSsShow(true)
      setTimeout(()=>{
          setShowtable(true)
          setUserData(false)
      },3000)

      // window.location.reload()
  }else if(res.status == 201){
    setMessage(res.data)
  }
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
      validateOnChange={false}
      validationSchema={schema}
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
        <div >
          <div className="row" style={{marginBottom:"15px"}}>
            {/* <div className='col-2' style={{paddingBottom:"15px",paddingRight:'0px',marginLeft:"0px",marginBottom:"15px"}}> */}
              {/* <img style={{marginRight:"0px",paddingRight:'0px'}} src={userImage} width='90' height='90' radius='50%' alt="Logo" /> */}
            {/* </div> */}
            {/* <div className='col-6' style={{textAlign:"left",marginLeft:"0px",paddingTop:"25px",paddingLeft:'0px'}}> */}
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
                placeholder='Enter Third Name'
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
                placeholder='sample@gmail.com'
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
            </div>
             
              <p className='error'>{message.email}</p>  
              
              </div>
            </Form.Group>
            </Row>

            <Row  className="mb-2">
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
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </InputGroup>
              <p>{message.username}</p>
                </div>
              </div>
            </Form.Group>
            <Form.Group as={Col} md="6" >
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Password</Form.Label>
                </div>
                <div className="col-sm-8">
                <a href='http://172.16.1.201:8000/password-reset/'>   <button type='button' className='btn reset-btn' style={{width:"98%"}}>Reset Password</button></a>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
                </div>
              </div>
            </Form.Group>
          </Row>
       
       
          <Row  className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik07">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Location</Form.Label>
                </div>
                <div className="col-sm-8">
                <InputGroup hasValidation>
                <Select
                 options={countryDropDowns}
                 placeholder="Select Location"
                 value={values.country}
                 name = 'factory'
                 onChange={option => setFieldValue("country", option)}
                 isSearchable={true}
                //  isInvalid={!!errors.factory}
                 isInvalid={!!errors.country}
                 aria-describedby="inputGroupPrepend"
                 styles={customStyles}
                    // isMulti
                  />
                 { values.country ? <></>:<p className='error'> *choose location</p>}
               
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
               value ={values.role}
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
          <div style={{textAlign:"center"}}>
          <button className='btn' type="submit">Update</button>
          <button className='btn btn-danger' onClick={reload}>Cancel</button>
          </div>
        </form>
      </div>)}
    </Formik>
  )
}

export default ModifyUser