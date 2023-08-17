import React, {useState ,useContext} from 'react'
import ConditionCards from "../components/CustomConditionCards";
import CustomConditionOutPut from "../components/CustomConditionOutPut";
import Footer from "../components/Footer";
import MainNavbar from "./mainNavbar";
import {Token,Url }from '../context/ApiVariables';
import {CustomCondtionSubLogicContext ,CustomCondtionLogicContext,
    CustomConditionOutPutContext,CustomCondtionContext} from '../context/Context'
import axios from 'axios';
import { useNavigate ,useParams} from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SuccessMessage } from '../components/PopBoxes';

export function AddCustomCiondition(){
    const navigate = useNavigate()
    axios.defaults.headers.common['Authorization'] = Token
    const [conditions,setConditions] = useState([[{
        category:"country",
        condition:"",
        value:''
      }]])
      const [message,setMessage] = useState('')
      const [ssShow,setSsShow] = useState(false)
      const [logic,setLogic] = useState([])
      const [name,setName] = useState()
      const [valid,setValid] = useState(false)
      const [border,setBorder] = useState()
      const [maincondition,setMainCondition] = useState([false])
      const [output,setOutPut] = useState({
        requirement:"",
        condition:'',
        value:""
      })
const handleSubmitCondition = (event)=>{
    console.log(logic)
    console.log(name)
    console.log(maincondition)
    console.log(output)
    axios({
        method: 'post',
        url: Url+'custom/condition',
        data: {
            name : name,
            mainLogc:maincondition,
            subLogic : logic,
            statement : conditions,
            output : output,
            state:true
        }
    }).then(res =>{
        if(res.status == 200){
             setMessage({
                type:"success",
                message:"Custom condition added"
             })
             setSsShow(true)
            setTimeout(function() {  navigate('/customcondition'); }, 3000);
            }
            }).catch((error)=>{
                if(error.response.data['name'] !== undefined){
                       setBorder('2px solid #e61d02')
                       setValid(true)
                }
            })
            }
return(<div className="custom-condition">
<MainNavbar prop='CUSTOM CONDITON'/>
<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<NotificationContainer/>
<div className="custom-condition-list">
    <div className="container-fluid" style={{marginBottom:"3vh"}}>
    <h2>CONDITIONS</h2>
    <div className="w-100" style={{textAlign:"left",marginBottom:"30px",marginTop:"3vh"}}>
        <div className="row">
            <div className="col-3" style={{textAlign:"right",marginTop:"5px",width:"200px",fontFamily:"futura"}}>
            <label><h5 style={{fontFamily:"futura"}}>Condition Name</h5>  </label>
            </div>
            <div className="col">
            <input  className="form-control conditon-name" value ={name} onChange={e=>setName(e.target.value)} placeholder="Enter condition name" type='text'  style={{border:border,width:"50%"}}/>
            {valid && <p style={{color:"#e61d02"}}>*This field is required</p>}

            </div>
        </div>
    </div>
<div className="input">
    <CustomCondtionContext.Provider value={{conditions,setConditions}}>
        <CustomCondtionLogicContext.Provider value={{maincondition,setMainCondition}}>
            <CustomCondtionSubLogicContext.Provider value={{logic,setLogic}}>
                <ConditionCards/>
            </CustomCondtionSubLogicContext.Provider>
        </CustomCondtionLogicContext.Provider>
    </CustomCondtionContext.Provider>

</div>
<div className="output">
    <CustomConditionOutPutContext.Provider value={{output,setOutPut}}>
        <CustomConditionOutPut/>
    </CustomConditionOutPutContext.Provider>

</div>
<button className="btn condition-add-btn" onClick={handleSubmitCondition}> Save</button>
</div>
</div>
<Footer/>
    </div>)
}


export function AddCountryCustomCiondition(){
    const navigate = useNavigate()
    axios.defaults.headers.common['Authorization'] = Token
    const {country} = useParams()
    const [conditions,setConditions] = useState([[{
        category:"country",
        condition:"",
        value:''
      }]])
      const [logic,setLogic] = useState([])
      const [name,setName] = useState()
      const [valid,setValid] = useState(false)
      const [border,setBorder] = useState()
      const [message,setMessage] = useState('')
      const [ssShow,setSsShow] = useState(false)
      const [maincondition,setMainCondition] = useState([false])
      const [output,setOutPut] = useState({
        requirement:"",
        condition:'',
        value:""
      })
const handleSubmitCondition = (event)=>{
    console.log(logic)
    console.log(name)
    console.log(maincondition)
    console.log(output)
    axios({
        method: 'post',
        url: Url+'custom/condition',
        data: {
            name : name,
            mainLogc:maincondition,
            subLogic : logic,
            statement : conditions,
            output : output,
            state:true
        }
    }).then(res =>{
 
        if(res.status == 200){
            setMessage({
                type:"success",
                message:"Custom condition added"
            })
            setSsShow(true)
            setTimeout(function() {  navigate(`/countrycustom/conidtion/${country}`); }, 3000);
            }
            }).catch((error)=>{
                console.log(error)
                if(error.response.data['name'] !== undefined){
                       setBorder('2px solid #e61d02')
                       setValid(true)
                }
            })
            }
return(<div className="custom-condition">
<MainNavbar prop='CUSTOM CONDITON'/>
<NotificationContainer/>
<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
<div className="custom-condition-list">
    <div className="container-fluid" style={{marginBottom:"3vh"}}>
    <h2>CONDITIONS</h2>
    <div className="w-100" style={{textAlign:"left",marginBottom:"30px",marginTop:"3vh"}}>
        <div className="row">
            <div className="col-3" style={{textAlign:"right",marginTop:"5px",width:"200px",fontFamily:"futura"}}>
            <label><h5 style={{fontFamily:"futura"}}>Condition Name</h5>  </label>
            </div>
            <div className="col">
            <input  className="form-control conditon-name" value ={name} onChange={e=>setName(e.target.value)} placeholder="Enter condition name" type='text'  style={{border:border,width:"50%"}}/>
            {valid && <p style={{color:"#e61d02"}}>*This field is required</p>}

            </div>
        </div>
    </div>
<div className="input">
    <CustomCondtionContext.Provider value={{conditions,setConditions}}>
        <CustomCondtionLogicContext.Provider value={{maincondition,setMainCondition}}>
            <CustomCondtionSubLogicContext.Provider value={{logic,setLogic}}>
                <ConditionCards/>
            </CustomCondtionSubLogicContext.Provider>
        </CustomCondtionLogicContext.Provider>
    </CustomCondtionContext.Provider>

</div>
<div className="output">
    <CustomConditionOutPutContext.Provider value={{output,setOutPut}}>
        <CustomConditionOutPut/>
    </CustomConditionOutPutContext.Provider>

</div>
<button className="btn condition-add-btn" onClick={handleSubmitCondition}> Save</button>
</div>
</div>
<Footer/>
    </div>)
}

export default AddCustomCiondition