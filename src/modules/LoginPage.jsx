import React, { useState } from 'react'
import png from '../files/log.png'
import {Button} from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import * as yup from 'yup';
import { Formik} from 'formik'
import {Token,Url} from '../context/ApiVariables';
import { trackPromise } from 'react-promise-tracker';
import { SuccessMessageLogin } from '../components/PopBoxes';
import { useNavigate } from 'react-router-dom';
// import {Link, useNavigate } from 'react-router-dom'; 

const schema = yup.object().shape({ 
    username: yup.string().required().min(4,"too short - should be minimum 5 character").max(50,'should not exceed 15 chars '),
    password: yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.')
})
const LoginPage = () => {
    const[passwordshow,setPasswordShow] = useState('password')
    const [error,setError] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [message,setMessage] = useState({})
    const Navigate =()=>{
        window.location.replace('/')
    }
    
    async function postJSON(event) {
      // console.log(event)
     const data = {
        username: event.username,
        password: event.password,
      }
     
      try {
       
        const response =  await trackPromise( fetch(Url+'auth/', {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }));
    
        const result = await response.json();
        // sessionStorage.clear();
        localStorage.clear();
        window.localStorage.setItem('token',result.token);
        if(Object.keys(result).includes("non_field_errors")){
          setError(result.non_field_errors)
        }else{
        setMessage({
          type:"success",
          message:"Login Success"
        })
        setSsShow(true)
        }
      } catch (error) {
        // console.log(error.response.data)
        setError(error.response.data.non_field_errors);
      }
    }
    // const submitForm = async (formValues) => {
    //     axios({
    //       method: 'post',
    //       url: Url+'auth/',
    //       data: {
    //         username: formValues.username,
    //         password: formValues.password,
    //       }
    //     }).then(res=>{
    //         if(res.status === 200){
    //             window.localStorage.setItem('token',res.data.token);
    //            window.location.replace('/home')
    //         }}).catch(function (error) {
    //         setError(error.response.data.non_field_errors);
    //       });
    //   };
    const  passwordtoggle = () => {
      if (passwordshow == "password"){
        setPasswordShow("text")}else{
          setPasswordShow("password")
        }
      }
  return (
    <div className='login-page'>
      {ssShow && <SuccessMessageLogin ssShow={ssShow} setSsShow={setSsShow} message={message} Navigate={Navigate}/> }
        <center>
        <div className="container">
            <div>
            <img style={{marginLeft:"0px",margin:"20px"}}src={png} width='200' height='100' alt="Logo" />
            </div>
      <div>
        <h2>Graphics Language System</h2>
      </div>
      <div className='login-form'>
        <h4>Login</h4>
        <Formik
      enableReinitialize
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={(values, { setSubmitting }) => {
        postJSON(values, setSubmitting);
    }} 
      initialValues={{
        username:'',
        password:''
      }} 
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
      }) => (
        <form noValidate onSubmit={handleSubmit}>

            <Row>
              <p className='error'> {error}</p> 
            <Form.Group  md="6" controlId="validationFormik01">
                <Form.Label>Username</Form.Label> 
                <div className='login-input'>
              <Form.Control
                type="text"
                name="username"
                placeholder='Enter Username/email'
                className='login-control'
                value={values.username}
                onChange={e=>setFieldValue('username',e.target.value)}
                isInvalid={!!errors.username}
              />
               </div>
               <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>      
            </Row>
            <Row>
            <Form.Group  md="6" controlId="validationFormik02">
                <Form.Label>Password</Form.Label>
                  <div className='login-input'>
                <Form.Control controlId="passwordId"
                type={passwordshow}
                name="password"
                className='login-control'
                placeholder='Enter Password'
                value={values.password}
                onChange={e=>setFieldValue('password',e.target.value)}
                isInvalid={!!errors.password}
              />
<i className='eye-symbol' onClick={passwordtoggle}>{" "}{passwordshow == "password" ? (<svg width="20"height="17" fill="currentColor"className="bi bi-eye-fill eyefill"viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>) : (<svg width="20"height="17"fill="currentColor"className="bi bi-eye-slash-fill eyefill"viewBox="0 0 16 16">
  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" /></svg>)}</i>
              </div>
              
  
             
               
             
                <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            </Row>
        
            <button className='login-input btn' type="submit">Login</button>
           
        <a href='http://172.16.1.201:8000/password-reset/'><p className='forgot-btn'>Forgot password ?</p></a>
        </form>
      )}
    </Formik>
      </div>
      </div>
      </center>
    </div>
  )
}

export default LoginPage