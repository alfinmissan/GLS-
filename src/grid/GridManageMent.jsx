import React,{useState,useEffect,useContext,useRef} from 'react'
import MainNavbar from '../Pages/mainNavbar'
import { Form } from 'react-bootstrap'
import {Button} from 'reactstrap';
import Select from "react-select"
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import GridView from './Grid';
import { GridDataShowContext,GridPageShowContext } from '../context/Context';
import {Modal}from 'react-bootstrap';
import {RiFileHistoryFill} from 'react-icons/ri';
import { GridHistory } from '../Pages/History';

function GridManageMent() {
  let count = useRef(0)
 const [showForm,setShowForm] = useState(true)
 const [jobnumber,setJobNumber] = useState('')
 const [itemnumber,setItemNumber] = useState('')
 const [varientcode,setVarientCode] = useState('')
 const [multi,setMulti] = useState(false)
 const [type,setType] = useState(false)
 const [showBlend,setShowBlend] = useState(false)
 const [country,setCountry] = useState([])
 const [blend,setBlend] = useState([])
 const [legalname,setLegalName] = useState({label:false,value:"None"})
 const [category,setCategory] = useState('')
 const [range,setRange] = useState({label:"",value:"all"})
 const [weight,setWeight] = useState('')
 const [showrange,setShowrange] = useState(true)
 const [teaForm,setTeaForm] = useState({label:'None',value:'None'})
 const [description,setDescription] = useState('')
 const [factory,setFactory] = useState()
 const [noofteabag,setNoOfTeaBag] = useState({label:false,value:""})
 const [dropdown,setDropDown] = useState(false)
 const [dropdownBlend,setDropDownBlend] = useState(false)
 const [gridData,setGridData] = useState()
 const [message,setMessage] = useState(false)
 let countries = []
 const [error,setError] = useState({})
 const [showhistory, setHistoryShow] = useState(false)
 const historyClose = () => setHistoryShow(false)
 const historyShow = () => setHistoryShow(true)

 const  categorydropdown = [{label:"Loose Tea",value:"loose tea"},
                            {label:"Tea Bag",value:"tea bag"},
                           ] 
 const  rangedropdown = [{label:"Black tea",value:"black tea"},
                          {label:"Green tea",value:"green tea"},
                          {label:"Herbal tea",value:"herbal tea"},
                          {label:"Natural Benefit",value:"natural benefit"}
                        ]

 const  typedropdown = [{label:"Standard",value:"standard"},
                        {label:"Selection pack",value:"selection pack"},
                        {label:"Promo pack",value:"promo pack"}
                        ]
const handleSelectType = (data) =>{ 
                                    setType(data)
                                    if(data.value=="standard"){
                                      setMulti(false)
                                      setShowrange(true)
                                      setBlend([])
                                    }else{
                                      setMulti(true)
                                    }     
                                    
                                    if(data.value == 'selection pack'){
                                      setShowBlend(true)
                                      setShowrange(false)
                                      setBlend(null)
                                     let blends = dropdown.blend_name_black.concat(dropdown.blend_name_green,dropdown.blend_name_herbal,dropdown.blend_name_natural)
                    
                                     setDropDownBlend(blends)
                                    }
                                    if(data.value == 'promo pack'){
                                      setShowBlend(false)
                                      setShowrange(true)
                                      setBlend([])
                                      if(range.value == 'black tea'){
                                        setDropDownBlend(dropdown.blend_name_black)
                                      }else if(range.value == 'green tea'){
                                        setDropDownBlend(dropdown.blend_name_green)
                                      }else if(range.value == 'herbal tea'){
                                        setDropDownBlend(dropdown.blend_name_herbal)
                                      }else if(range.value == 'natural benefit'){
                                        setDropDownBlend(dropdown.blend_name_natural)
                                      }
                                    }
                                  }
const handleSelectBlend = (data) => setBlend(data)
const handleSelectCountry = (data) =>{
  if (data.length >= count.current){
    setCountry(data)
    count.current = count.current + 1
  }else{
    if (window.confirm("Are you sure want to remove the country")) {
      setCountry(data)
      count.current = count.current - 1
    } else {
      //;
    }
  }
  // setCountry(data)
  console.log(data)
} 
const handleSelectLegalName = (data) => setLegalName(data)
const handleSelectCategory = (data) => setCategory(data)
const handleSelectRange = (data) =>{
        setShowBlend(true)
        setRange(data)
        if(data.value == 'black tea'){
          setDropDownBlend(dropdown.blend_name_black)
        }else if(data.value == 'green tea'){
          setDropDownBlend(dropdown.blend_name_green)
        }else if(data.value == 'herbal tea'){
          setDropDownBlend(dropdown.blend_name_herbal)
        }else if(data.value == 'natural benefit'){
          setDropDownBlend(dropdown.blend_name_natural)
        }
} 
const handleSelectWeight = (data) => setWeight(data)
const handleSetTeaForm =(data) => setTeaForm(data)
const handleSelectFactory = (data) => setFactory(data)
const handleSelectNoOfTeaBag = (data) => setNoOfTeaBag(data)

//react-select customization 
const customStyles = {
    control: base => ({
      ...base,
      // height: 100,
      minHeight: 100
    })
  };

useEffect(()=>{
    axios.get(Url+'grid/dropdown',{
      'headers':{
        'Authorization': Token
      }
      }).then((res)=>{
        setDropDown(res.data)
        // setDropDown(res.data.req_translation)
       
      })
  },[])
  
const handleSubmit = (event) =>{
  event.preventDefault()
  for (let i = 0; i <country.length; i++) {
    countries.push(country[i].value);
  }
  axios.defaults.headers.common['Authorization'] = Token
  axios({
    method: 'post',
    url: Url+'grid',
    data:{
      job: jobnumber,
      item: itemnumber,
      varient:varientcode,
      type: type.value,
      countries:countries,
      blends: blend,
      legal_name:legalname.value,
      category: category.value,
      weight: weight.value,
      range:range.value,
      no_of_bags: noofteabag.value,
      factory: factory,
      Description:description,
      tea_form:teaForm.value
    },
    params:{
      user:window.localStorage.getItem("user")
    }
  
  }).then(res=>{
    if(res.status==201){
      setMessage(res.data)
      setTimeout(() => setMessage(false), 3000);
      console.log(res.data)
    }else{
      setGridData(res.data)
      setShowForm(false)
    }
  }).catch(error => {
    setError(error.response.data)
 })
 
}
  return (<div className='grid-management'> 
    <div className='grid-wrapper'>
        <MainNavbar prop='GRID MANAGEMENT'/>
<div style={{"marginTop":"12vh"}}>

    {/* <div>
       
    </div> */}
    { showForm && <div style={{marginTop:"10vh",textAlign:"left",paddingLeft:"3vw"}}>
    <h3>CREATE GRID</h3>
  <Form>
    <div className="row">
        <div className="col-sm-6">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Job Number  </Form.Label>
        </div>
        <div className="col-sm-8">
        <Form.Control type='text' value={jobnumber} onChange={e=>setJobNumber(e.target.value)}/>
        {Object.keys(error).includes("job")?<label className='error'>*{error.job[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>

    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Item Number  </Form.Label>
        </div>
        <div className="col-sm-8">
         <Form.Control type='text' value={itemnumber} onChange={e=>setItemNumber(e.target.value)}/>
         {Object.keys(error).includes("item")?<label className='error'>*{error.item[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>

    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Varient Code </Form.Label>
        </div>
        <div className="col-sm-8">
         <Form.Control type='text' value={varientcode} onChange={e=>setVarientCode(e.target.value)}/>
         {Object.keys(error).includes("varient")?<label className='error'>*{error.varient[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>

    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Type Of Grid  </Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={typedropdown}
        placeholder="Select Grid Type"
        value={type}
        onChange={handleSelectType }
        isSearchable={true}
        // isMulti
        />
      {Object.keys(error).includes("type")?<label className='error'>*{error.type[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>

    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Country Shipped To </Form.Label>
        </div>
        <div className="col-sm-8" >
        <div className="dropdown-container">
                    <Select color="green"
                    options={dropdown.country}
                    placeholder="select Country"
                    value={country}
                    onChange={handleSelectCountry}
                    isSearchable={true}
                    styles={customStyles}
                    isMulti
                  />   
             </div>
        </div>
    </div>
    </Form.Group>
        </div>
        <div className="col-sm-6">

        {showrange &&<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Range</Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={rangedropdown}
        placeholder="Select Range"
        value={range}
        onChange={ handleSelectRange}
        isSearchable={multi}
// isMulti
        />
        {Object.keys(error).includes("countries")?<label className='error'>*{error.countries[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>}
    { showBlend && 
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Blend Selected  </Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={dropdownBlend}
        placeholder="Select Blend Name"
        value={blend}
        onChange={handleSelectBlend }
        isSearchable={true}
        isMulti={multi}
        />
        {Object.keys(error).includes("blends")?<label className='error'>*{error.blends[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>
}
    {
    type.value == 'selection pack' && <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
       <div className="row">
           <div className="col-sm-3">
           <Form.Label>Legal Name  </Form.Label>
           </div>
           <div className="col-sm-8">
           <Select
        options={dropdown.legal_name}
        placeholder="Select Legal Name"
        value={legalname}
        onChange={handleSelectLegalName }
        isSearchable={true}
        // isMulti = {true}
        />
        </div>
    </div>
    </Form.Group>
     }
        
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Category  </Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={categorydropdown}
        placeholder="Select Category"
        value={category}
        onChange={handleSelectCategory }
        isSearchable={true}
// isMulti
        />
         {Object.keys(error).includes("category")?<label className='error'>*{error.category[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>
    {category.value == 'tea bag' &&
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>No Of Tea Bag </Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={dropdown.no_of_teabag}
        placeholder="Select No Of Tea Bag"
        value={noofteabag}
        onChange={handleSelectNoOfTeaBag}
        isSearchable={true}
// isMulti
        />
        </div>
    </div>

    </Form.Group>}
    
    {category.value == 'tea bag' &&
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
     <Form.Label>Teabag Form</Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={dropdown.tea_form}
        placeholder="Select Tea Bag Form"
        value={teaForm}
        onChange={handleSetTeaForm}
        isSearchable={true}
// isMulti
        />
        </div>
    </div>

    </Form.Group>
    }
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Weight  </Form.Label>
        </div>
        <div className="col-sm-8">
        <Select
        options={dropdown.weight}
        placeholder="Select Weight"
        value={weight}
        onChange={handleSelectWeight}
        isSearchable={true}
// isMulti
        />
        </div>
    </div>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Product Description </Form.Label>
        </div>
        <div className="col-sm-8">
         <Form.Control type='text' value={description} onChange={e=>setDescription(e.target.value)}/>
         {Object.keys(error).includes("Description")?<label className='error'>*{error.Description[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <div className="row">
        <div className="col-sm-3">
        <Form.Label>Factory Location  </Form.Label>
        </div>
        <div className="col-sm-8"> 
        <Select
        options={dropdown.factory}
        placeholder="Select Factory"
        value={factory}
        onChange={handleSelectFactory}
        isSearchable={true}
// isMulti
        />
         {Object.keys(error).includes("factory")?<label className='error'>*{error.factory[0]}</label>:<></>}
        </div>
    </div>
    </Form.Group>
        </div>
    </div>
    <div style={{textAlign:"center",marginBottom:"50px"}}>
    <Button className='btn grbtns' onClick={handleSubmit}>Save & Generate</Button>
    </div>

  </Form>
    </div>
   }
{message && <div className='grid-alert'>{message.message}</div>}
   {gridData &&
   <GridDataShowContext.Provider value={{gridData,setGridData}}>
    <GridPageShowContext.Provider value={{showForm,setShowForm}}>
    <GridView prop={gridData}/>
    </GridPageShowContext.Provider>
   </GridDataShowContext.Provider>
    }
</div> 
</div>

{/* history */}

<Modal show={showhistory} onHide={historyClose} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <GridHistory prop={varientcode}/>
       <Button variant="secondary" onClick={historyClose}>
          Close
        </Button>
      </Modal.Body>
    </Modal>

        <footer style={{backgroundColor: "#f5faf5",position:"fixed", bottom: 0,width:"100vw",overlay:"true"}}>
          <div className='row'>
          <div className='col-3'>
          </div>
          <div className='col-6'>
         <b><i>Graphics Language System</i></b>
          </div>
          <div className='col-3'>
          { showForm == false && <b style={{color:"#08265aee",cursor: "pointer"}} onClick={historyShow}><RiFileHistoryFill size={20}/>History</b>} 
          </div>
          </div>
      </footer>
    </div>
  )
}

export default GridManageMent