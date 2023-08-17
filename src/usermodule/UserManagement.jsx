import React, { useEffect, useState } from 'react'
import MainNavbar from '../Pages/mainNavbar'
import {Button} from 'reactstrap';
import User from './UserTable';
import AddNewUser from './AddNewUser'
import Footer from '../components/Footer';
const UserManagement= () => {

  const [tableView ,setTableView] = useState("all")
  const [active,setActive] = useState({
    all:true,
    viewer:false,
    uksales:false,
    language:false,
    graphics:false,
    editor:false,
    admin:false,
    addnewuser:false
  })
  const [showTable,setShowTable] = useState(true)
  const [user,setUser] = useState(false)
  const handleChange = (event) =>{
    if (event.target.name == 'addnewuser'){
      setUser(true)
      setShowTable(false)
    }else{
      setShowTable(true)
      setUser(false)
    }
    setActive({
      all:false,
      viewer:false,
      uksales:false,
      language:false,
      graphics:false,
      editor:false,
      admin:false,
      addnewuser:false
    })
    setActive({[event.target.name]:true})
    setTableView(event.target.name)   
  }
 

    return (<div className='user-manage'>
         <MainNavbar prop='USER MANAGEMENT'/>
         <div class="w3-container">
         <div className="w3-show-inline-block" style={{"marginTop":"15vh","marginBottom":"30px"}}>
  <div className="w3-bar">
      <button className="w3-btn" style={active.all?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}} name='all' onClick={handleChange} active={active.all}>All User</button>
       <button className="w3-btn " style={active.viewer?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}}  name='viewer' onClick={handleChange} active={active.viewer}>Viewer</button>
       <button className="w3-btn " style={active.uksales?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}} name='uksales' onClick={handleChange} active={active.uksales}>UK Sales</button>
       <button className="w3-btn " style={active.language?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}}  name='language' onClick={handleChange} active={active.language}>Language Approver</button>
  </div>
  </div>
  <div className="w3-show-inline-block"  style={{"marginTop":"15vh","marginTop":"-5px"}}>
  <div className="w3-bar">
       <button className="w3-btn " style={active.graphics?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}}  name='graphics' onClick={handleChange} active={active.graphics}>Graphics Team</button>
       <button  className="w3-btn " style={active.editor?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}} name='editor' onClick={handleChange} active={active.editor}>Editor </button>
       <button className="w3-btn " style={active.admin?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}} name='admin' onClick={handleChange} active={active.admin}>Admin</button>
       <button className="w3-btn " style={active.addnewuser?{background:"#017c5bea",color:"white"}:{background:"#EE975A  ",color:"white"}} name='addnewuser' onClick={handleChange} active={active.addnewuser}>Add New User</button> 
  </div>
  </div>
  </div>  
        {/* <div style={{"marginTop":"15vh","marginBottom":"30px"}} className='container'>
       <Button name='all' onClick={handleChange} active={active.all}>All User</Button>
       <Button name='viewer' onClick={handleChange} active={active.viewer}>Viewer</Button>
       <Button name='uksales' onClick={handleChange} active={active.uksales}>UK Sales</Button>
       <Button name='language' onClick={handleChange} active={active.language}>Language Approver</Button>
       <Button name='graphics' onClick={handleChange} active={active.graphics}>Graphics Team</Button>
       <Button name='editor' onClick={handleChange} active={active.editor}>Editor </Button>
       <Button name='admin' onClick={handleChange} active={active.admin}>Admin</Button>
       <Button name='addnewuser' onClick={handleChange} active={active.addnewuser}>Add New User</Button> 
              </div> */}
              <h3 style={{fontFamily:"futura",fontWeight:700}}>{tableView=='all'? 'All Users':tableView=='viewer'?'Viewers':tableView=='uksales'?'UK Sales':
              tableView=='graphics'?'Graphics Team':tableView=='admin'?"Admin":
              tableView=='editor'?'Editor':tableView=='language'?"Language Approver":"Add New User"}</h3>
<div className='container'>
         
             {active.all && <User user={tableView} setActive={setActive}/> }
             {active.admin  && <User user={tableView}/> }
             {active.language && <User user={tableView}/> }
             {active.graphics && <User user={tableView}/> }
             {active.uksales && <User user={tableView}/> }
             {active.editor && <User user={tableView}/> }
             {active.viewer && <User user={tableView}/> }
             {user && <AddNewUser setActive={setActive} setTableView={setTableView} setUser={setUser}/> }  
</div>
<Footer/>
</div>
    )
  }

export default UserManagement