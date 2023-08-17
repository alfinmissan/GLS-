import React, { useEffect, useState } from 'react'
import App from './App'
import LoginPage from './modules/LoginPage'
import './App.css'
import {Token,Url} from './context/ApiVariables';
import axios from 'axios';

const Login= () => {
    axios.defaults.headers.common['Authorization'] = Token
    const [auth,setAuth] = useState(false)
    useEffect(()=>{
        axios({
            method: 'get',
            url: Url+'auth/user',
        }).then(res=>(
          setAuth(res.data)
        )) 
    },[])
  return (
   <>
   {auth ? <App/>:<LoginPage/> }
   </>
  )
}

export default Login