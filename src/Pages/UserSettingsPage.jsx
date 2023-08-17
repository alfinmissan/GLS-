import Footer from '../components/Footer'
import MainNavbar from './mainNavbar'
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

// const {form } = Formik
const schema = yup.object().shape({
    firstName: yup.string().required('Enter first name').max(15,'should be 15 chars maximum').min(1),
    lastName: yup.string().required('Enter second name').max(15,'should be 15 chars maximum').min(1),
    username: yup.string().required('Enter username').min(1,"too short - should be minimum 5 character").max(15,'should be 15 chars maximum'),
  });
  
function UserSettingsPageChild({prop}){
    console.log(prop)
    const [message,setMessage] = useState('')
    const [user,setUser] =useState({
                firstName: prop.first_name,
                lastName:  prop.last_name,
                username: prop.username,
                    })
// const [fullname,setFullName] = useState({
//   firstName:'',
//   lastName:''
// })
// const handleSetName = (event) =>{ setFullName(prevState => ({
//   ...prevState,
//   [event.target.name]: event.target.value
// }))}

const customStyles = {
  control: base => ({
    ...base,
    width:330,
    // minHeight: 35
  })
};

const submitForm = async (formValues) => {
  console.log(formValues)
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'update/user',
    data: {
      username: formValues.username,
      firstname:formValues.firstName,
      lastname: formValues.lastName,
 }
  
  }).then(res=>{
  if(res.status == 200){
      window.location.reload()
  }else if(res.status == 201){
    console.log(res.data)
    setMessage(res.data)
  }
  })
};

return (
    <Formik
      enableReinitialize
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={(values, { setSubmitting }) => {
        submitForm(values, setSubmitting);
    }}
    //   onChange ={(values)=>{
    //     handleSetName(values)
    //   }}
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
      }) => ( <div className='user-settings'>
        <MainNavbar prop='USER SETTINGS'/>
        <div style={{marginTop:"13vh"}}>
        <div>
          <div className="row" style={{marginBottom:"15px"}}>
            {/* <div className='col-2' style={{paddingBottom:"15px",paddingRight:'0px',marginLeft:"0px",marginBottom:"15px"}}>
              <img style={{marginRight:"0px",paddingRight:'0px'}} src={userImage} width='90' height='90' radius='50%' alt="Logo" />
            </div>
            <div className='col-6' style={{textAlign:"left",marginLeft:"0px",paddingTop:"25px",paddingLeft:'0px'}}> */}
            {/* <h3 style={{fontFamily:"futura"}}>{fullname.firstName + ' ' + fullname.lastName}</h3> */}
            {/* </div>
            <div className="col-4"></div> */}
          </div>
        </div>
        <div className="container user-settings-form">
            <center>
        <form noValidate onSubmit={handleSubmit}>
      
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
                onChange={e=>{handleChange(e)}}
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
                onChange={e=>{handleChange(e)}}
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
              
                <a href='http://172.16.1.201:8000/password-reset/'> <button className='btn reset-btn' type='button' onClick={e=>e.target.value} style={{width:"98%"}}>Reset Password</button></a>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
                </div>
              </div>
            </Form.Group>
     
          
      

            <div style={{textAlign:"center"}}>
            <Button type="submit">Save</Button>
            </div> 
        </form>
        </center>
        </div>
        </div>
       <Footer/>
    </div>)}
    </Formik>
  )
}


function UserSettingsPage(){
    const [data,setData] = useState(false)
    useEffect(()=>{
        axios.get(Url+'update/user',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
             setData(res.data)
            })
    },[])
    return(
        <div>
            {data && <UserSettingsPageChild prop={data[0]}/>}
        </div>
    )
}
export default UserSettingsPage