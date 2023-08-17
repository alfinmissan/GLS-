import React from "react";
import png from '../files/log.png'
import { useNavigate } from "react-router-dom";

function ResetPassword(){
    const navigate = useNavigate()
    const handleReset = ()=>{
      navigate('/resetpasswordlink')
    }
    return(<div>
    <div className="login-page">
    <center>
        <div className="w-100">
        <div className="container">
            <div>
            <img style={{marginLeft:"0px",margin:"20px"}}src={png} width='200' height='100' alt="Logo" />
            </div>
      <div>
        <h2>Graphics Language System</h2>
      </div>
      </div>

        </div>
        <div className="rest-form">
        <form >
            <h3>Reset Password</h3>
            <p>
            Enter the email address  associated with your Graphic Language System account.
            </p>
            <div className="email">
            <label>Enter  Email</label><br></br>
            <input type='email'></input><br></br>
            <button onClick={handleReset}> Send Password Reset Link</button>
            </div>
        </form>
        </div>
        </center>
    </div>
    </div>)
}

export const PasswordResetLinkSent = ()=>{
    return(<div>
<div className="login-page">
    <center>
        <div className="w-100">
        <div className="container">
            <div>
            <img style={{marginLeft:"0px",margin:"20px"}}src={png} width='200' height='100' alt="Logo" />
            </div>
      <div>
        <h2>Graphics Language System</h2>
      </div>
      </div>
        </div>
        <div className="rest-form">
            <h3>Email Sent</h3>
        <h6>We sent an email to <span style={{color:"red"}}>testuser@gmail.com</span> with a link to reset your password</h6>
        </div>
        </center>
    </div>
           </div>)
}
export default ResetPassword