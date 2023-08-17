import React from 'react'
import png from '../files/log.png'

function AddNewPassWordPage(){
  return (
    <div className='addnew passwordpage'>
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
            <h3 style={{textAlign:"center"}}>Set New Password</h3>
            <div className="email">
            <label>New Password</label><br></br>
            <input type='email'></input><br></br>
            <label>confirm Password</label><br></br>
            <input type='email'></input><br></br>
            <button> Reset Password</button>
            </div>
        </form>
        </div>
        </center>
    </div>
    </div>
  )
}

export default AddNewPassWordPage