import React, { useState,useEffect} from 'react'
import {TiExport} from 'react-icons/ti';
import {AiOutlinePlus} from 'react-icons/ai';
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import {SpecialtranslationViewContext,Specialtranslation,GridChatContext, GridDocumentsAttchmentContext,GridInfoBoxContext,
    translationViewContext,GroupedtranslationViewContext,LanguageAddShowContext,LanguageAddContext,AttachShowFileContext,
    AttachFileContext,GridExportContext
  } from '../context/Context';
import LanguageTranslation, { LanguageTranslationDuplicated } from './LanguageTranslation';
import GroupedTranslation from './GroupedTranslation'
import SpecialTranslation from './SpecialTranslation'
import {Form} from 'react-bootstrap';
import AddLanPop from '../components/AddLanPop';
import {ReqAddContext,ReqAddShowContext} from '../context/Context';
import GridAdditionalRequirement from '../components/GridAdditionalRequirement';
import '@progress/kendo-theme-default/dist/all.css';
import AttachFile from '../components/AttachFile';
import {TiDelete} from 'react-icons/ti';
import {IoRemoveCircleOutline} from 'react-icons/io5';
import {IoIosChatbubbles} from 'react-icons/io';
import {FaCommentAlt} from 'react-icons/fa';
import {CgAttachment} from 'react-icons/cg';
import GridChat from '../components/GridChat';
import DocumentView from '../components/DocumentsAttchment';
import GridAttachment from '../components/AttachmentShow';
import GridExportComponent from '../exportpages/gridExport';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useNavigate } from 'react-router-dom';
import GridInfoBox from '../components/GridInfoBox';
import { isValuePresent,MyComponent,isValueRepeatedInColumn,extractNameFromURL } from '../IsValueModified';
import TranslationVersionChange from '../components/TranslationVersionChange';
import ConfirmGirdSubmission, { EmailMessage, SalesReportConfirmation, SuccessMessage,ValueCheckWarning } from '../components/PopBoxes';
function DuplicatedGrid({prop}){
  console.log(prop.grid)

const [showGridExport,setShowGridExport] = useState(false)
const [showattach,setShowAttach] = useState(false)
const [topRightModal, setTopRightModal] = useState(false);
const [showchat,setShowChat] = useState(false)
const [showattached,setShowAttached] = useState(false)
const [show,setShow] = useState(false)
const [languages,setLanguages] = useState(prop.languages)
const [data,setData] = useState(() => deepCopyArray(prop.data))
const [edit,setEdit] = useState('')
const [showLan,setShowLan] = useState(false)
const [showreq,setShowReq] = useState(false)
const jobno = prop.duplicateInfo.jobno
const varient = prop.duplicateInfo.varient
const [grid,setGrid] = useState(prop.grid)
const [col,setCol] = useState(false)
const [rown,setRow] = useState(false)
const [comment,setComment] = useState('')
const [submit,setSubmit] = useState(true)
const [translationShow,setTranslationShow] = useState(false)
const [specialTrasnaltion,setSpecialTranslation] = useState(prop.specialTrasnaltion)
const [gridinformation,setGridInformation] = useState(prop.gridinformations)
const [specialTrasnaltionShow,setSpecialTranslationShow] = useState(false)
const [groupedTranslationShow,setGroupedTranslationShow] = useState(false)
const [languagetrans,setLanguageTrans]= useState(() => deepCopyArray(prop.languagetrans))
const [grouped,setGrouped] = useState(prop.grouped)
const [message,setMessage] = useState('')
const [ssShow,setSsShow] = useState(false)
const [vcShow,setVcShow] = useState(false)
const [slShow,setSlShow] = useState(false)
const [smShow,setSmShow] = useState(false)
const [requirement,setRequirement] = useState('')
const [lan,setLan] = useState([])
const [language,setLanguage] = useState([])
const [approver,setApprover] = useState("UK Sales")
const [salesReport,setSalesReport] = useState(false)
let lanedited = [...lan]
const oldGrid = [...prop.data]
const oldGrouped = prop.grouped
const oldLanTrans = [...prop.languagetrans]
const [status ,setStatus] = useState(false)
const [emShow,setEmShow] = useState('')
const [email,setEmail] = useState('')
const [editshow,setEditShow] = useState(false)
const navigate = useNavigate()
const[exportdict,setExportdict] =useState({
  additionalrequirement:specialTrasnaltion,
  gridinformation:gridinformation
        })

function deepCopyArray(arr) {
    if (!Array.isArray(arr)) {
          return arr;
                }
    return arr.map((item) => deepCopyArray(item));
    }

//current date 
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`


const AddColumn = () =>{
    setShowLan(true)
}
  function isValidURL(string) {
      if(Number(string)){
        res=null
      }else{
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
      }   
    }
    

// add new language to grid
const AddNewLanguage = (event)=>{
    event.preventDefault()
    if(languages.includes(language.value)){
        window.alert('language already present in grid')
    }else{
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'grid/addlan',
      data:{
      language:language.value,
      grid: data,
      values:prop.grid,
      grouped_translation:grouped,
      language_translations:languagetrans,
      },
    }).then(res=>{
      if(res.status == 200){
        setLanguages([...languages,language.value])
        setData(res.data[0])
        setGrouped(res.data[1])
        setLanguageTrans(res.data[2])
      }
        })
        setShowLan(false)
      }
        setLanguage([])
  }

//   add new requirement in grid

const AddNewRequirement = (event)=>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'grid/addrequirement',
      data:{
      languages:languages,
      grid: data,
      requirement:requirement,
      grouped_translation:grouped,
      language_translations:languagetrans,
      },
    }).then(res=>{
      if(res.status == 200){
        console.log(res.data)
        setData(res.data[0])
        setLanguageTrans(res.data[1])
        // setGrouped(res.data[2])
        
      }
        })
        setRequirement('')
  }

const handleSubmit = (event) =>{
    // event.preventDefault()
    console.log(oldGrid)
    console.log(data)
    if(status){
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'grid/duplicate',
      data:{
      varient:varient,
      job:jobno,
      data:data,
      oldGrid:oldGrid,
      oldGrouped:oldGrouped,
      oldLanTrans:oldLanTrans,
      grid:grid,
      languages:languages,
      date:currentDate ,
      approver:approver,
      translation:languagetrans,
      special_requirement:specialTrasnaltion,
      grouped_translation:grouped,
      user:window.localStorage.getItem("name"),
      email:email
    //   additional_lan:language.value
      },
    }).then(res=>{
      if(res.status==200){
        setSubmit(false)
         setMessage({
                type:"success",
                message:"Grid submitted"
              })
              setSsShow(true)
        axios({
          method: 'post',
          url: Url+'log/duplicate',
          data:res.data,
        }).then((res)=>{
          setTimeout(function() { navigate('/task'); }, 3000);
        })
      }
   
      })
    }
  }
  // const handelChangeVersion = (event) => {
  //  setData(version[event].grid)
  //  setSpecialTranslation(version[event].special_requirement)
  // }
  const handleClickedEdit = (row, column) => {
    setRow(row)
    setCol(column)
    setEdit(data[row,column])
    setEditShow(true) 
  }

  const handleEditValues =(val,txt)=>{
    let copy = [...data]
    let tran= [...languagetrans]
    let groupedtrans = grouped
    if(edit !== '' && val ===''){
      setShow(true)
      copy[rown][col] = val;
      setData(copy)
      for (let i = 0; i < tran[col-1].length; i++) {
        if (tran[col-1][i][0] == edit) {
          tran[col-1][i]=[val,txt];
          break;
        }
      }
      Object.entries(groupedtrans).forEach(function([key, value]) {
        if(value.length > 0){
            for(let i =0;i < value.length;i++){
                if(value[i][0]==edit){
                   value[i]= [val,txt]
                   groupedtrans[key]=value;
                }
            }
        }
      });
      setLanguageTrans([...tran])
      setGrouped(groupedtrans)
    }else{
         if(edit !== val && isValueRepeatedInColumn(copy, col, val)){
            setVcShow(true)
      }else{
      copy[rown][col] = val;
      setData(copy)
      for (let i = 0; i < tran[col-1].length; i++) {
        if (tran[col-1][i][0] == edit) {
          tran[col-1][i]=[val,txt];
          break;
        }
      }
      Object.entries(groupedtrans).forEach(function([key, value]) {
        if(value.length > 0){
            for(let i =0;i < value.length;i++){
                if(value[i][0]==edit){
                   value[i]= [val,txt]
                   groupedtrans[key]=value
                }
            }
        }
      })}
      setLanguageTrans([...tran])
      setGrouped(groupedtrans)
    }
  }

  const handleClose = (event) =>{
    let copy = [...data];
    copy[rown][col] = edit;
    setData(copy)
    setShow(false)}

  const handleSubmitComment = (event) =>{
    event.preventDefault()
    let tran= [...languagetrans]
      let filtered = tran[col-1].filter(ele=>{
        return ele[0] !== edit
       })
       tran[col-1] = filtered
       setLanguageTrans([...tran])
        let cm = ''
      if(isValidURL(edit)){
          let name = extractNameFromURL(edit)
          cm = "deleted Value " + name + " reason:" + comment
      }else{
          cm = "deleted Value " + edit + " reason:" + comment
      }
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'post/comment',
      data:{
     comment:cm,
     varient:varient,
     date:currentDate ,
     user:localStorage.getItem('name')
      },
    }).then(res=>{
      console.log(res.data)
        })
        setShow(false)
      }

      useEffect(()=>{
        axios.defaults.headers.common['Authorization'] =Token
        axios.get(Url+'/lan/list',{
         'headers':{
           'Authorization': Token
         }
         }).then((res)=>{
         setLan(res.data.languages)
         })
            let salesReport = axios({
      method: 'get',
      url: Url+'/url/salesReport/',
      params:{
          varient:varient
      },
    }).then((res)=>{
      if(res.data.length > 0)
      setSalesReport(res.data)
    }).catch(error=>{
      
    })
      },[topRightModal])
const handleSelectApprover = (event) =>{
setApprover(event.target.value)
}
const handleDeleteLanguage = (ind) =>{
   if (window.confirm("Are you sure Want delete requirement")){
  let lan = languages
  let lantrans = languagetrans
  let values = []
  lan.splice(ind,1)
  lantrans.splice(ind-1,1)
  setLanguages([...lan])
  setLanguageTrans([...lantrans])
  data.forEach((el,item)=>{
    el.splice(ind,1)
    values.push(el)
  }) 
    setData([...values])}
}
const handleDeleteRequirement =(ind)=>{
   if (window.confirm("Are you sure Want delete requirement")){
data.splice(ind,1)
setData([...data])}
}
const handleClicked = () =>{
  setStatus(true)
  setSmShow(true)
}
const handleExport =()=>{
  setExportdict({
    ...exportdict,
    additionalrequirement:specialTrasnaltion,
    gridinformation:gridinformation
  })
  setShowGridExport(true)
}
  const checkSalesReport = () => {
    if(salesReport){
      setSmShow(false)
      setEmShow(true)
    }else{
      setSmShow(false)
      setSlShow(true)
    }
  }
return(<div className='container-fluid'>
  <NotificationContainer/>
  <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
      <div className='duplicate-container'>
      <div className="row grid-info" style={{fontFamily: "Times New Roman, Times, serif"}}>   
      <div className="w-100"> <h4 className ='product-description' style={{textAlign:"center"}}>{grid.Description}</h4></div> 
      <div className="col-4" style={{textAlign:"left"}}>
      <div className="container">
  <div className="row" >
    <div className="col"><h6>Job Number </h6></div>
    <div className="col">: {jobno}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Item Number   </h6></div>
    <div className="col">  : {grid.item}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Varient Code </h6></div>
    <div className="col">  : {varient}</div>
    <div className="w-100"></div>
    <div className="col"> <h6>To Approved By</h6></div>
    <div className="col"> <Form.Select aria-label="Default select example"
               name="role"
               value={approver}
               onChange={handleSelectApprover}
                >
                    <option value="Language Approver">Language Approver</option>
                    <option value="UK Sales">UK Sales</option>
                    <option value="Graphics Team">Graphics Team</option>
                </Form.Select></div>
   
   
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"left"}}>
      <div className="container">
<div className="row" >    
    <div className="col">  <h6>Factory </h6></div>
    <div className="col">  : {grid.factory.label}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Created By </h6></div>
    <div className="col">  : {localStorage.getItem('name')}</div>
    <div className="w-100"></div>
    <div className="col"> <h6>Created Date </h6></div>
    <div className="col"> <p style={{"fontSize":"14px"}}>: {currentDate }</p></div>
    {grid.category == 'tea bag' &&  <> <div className="w-100"></div> 
    <div className="col"> <h6>Tea Form </h6></div>
    <div className="col"> <p style={{"fontSize":"14px"}}>: {grid.tea_form}</p></div>
     </> } 
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"right"}}>
<div className="row"style={{width:"30vw"}}>
    <div className="col">
    {/* <Dropdown>
      <Dropdown.Toggle variant="success" color='' id="dropdown-basic">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-git" viewBox="0 0 16 16">
      <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
      </svg> Versions
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {version.map((item,index)=>( <Dropdown.Item onClick={e=>handelChangeVersion(index)}>{index+1}</Dropdown.Item>))}
      </Dropdown.Menu>
    </Dropdown> */}
</div>
    <div className="w-100"></div>
    <div className="w-100"></div>
    <div className="col">
    <button className='btn grid-bt' id='gridbt1' onClick={e=>handleExport()}><span className='visible'><TiExport size={30}/></span> Export</button>
</div>
    <div className="w-100"></div>
    </div>
  
</div>
</div>
<div className='grid-data' style={{width:"100vw"}}>
  { data && <table className='grid-table'>
 

    <thead className='grid-head'><tr>
         {
           languages.map((item,index)=>(<th className='grid-heading' key={index} id={item  == '' ? 'requirement-head-main' :'requirement-head'} >{
              item  == 'heading' ? '' :  index == 0 ? '':<>{item}<span className='delete' style={{float:"right",marginTop:"-2px"}} onClick={e=>handleDeleteLanguage(index)}><TiDelete fill='#c71e29' size={23}/></span></>
            }</th>))
        }
        <th className='grid-heading new-req' style={{width:"4vw",textAlign:"center"}} onClick={AddColumn}><AiOutlinePlus size={20}/></th>
    </tr>
    </thead>
    <tbody>
    {
    data.map((element,index)=>(<tr key={index}>
      {element.map((item,ind)=>( <td
  key={ind}
  id='values'
  style={
    ind === 0
      ? { background: "None", paddingRight: "5px" }
      : item === ''
      ? { background: "rgba(51,102,255,255)" }
      : item === false
      ? { background: "red" }
      :isValuePresent(oldGrid, data, index, ind)
      ? { color: "white", background: "#C202E8FF" }
      : { background: "None" }
  }
>
  {ind === 0 ? (
    <>
      {item}
      {status !== "Certified" && (
        <span className='delete' style={{ float: "right" }} onClick={e => handleDeleteRequirement(index)}>
          <IoRemoveCircleOutline color='#c71e29' size={20} />
        </span>
      )}
    </>
  ) : data[index][ind] === false ? (
    <div style={{ width: "100%", height: "5vh", backgroundColor: "red" }}></div>
  ) : isValidURL(data[index][ind]) ? (
    <img src={data[index][ind]} alt='asset' height="40px" width="50px" onClick={e => handleClickedEdit (index, ind, e)} />
  ) : (
    <div
      id='value-input'
      onClick={e => handleClickedEdit(index, ind)}
      style={
        item === false
          ? { background: "red", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : item === ''
          ? { background: "rgba(51,102,255,255)", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : isValuePresent(oldGrid, data, index, ind)
          ? { color: "white", background: "#C202E8FF", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : { background: "None", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
      }
    >
      {data[index][ind]}
    </div>
  )}
</td>))}
      </tr>))
    }
    <tr><td className='new-req' style={{textAlign:"center"}} onClick={e=>setShowReq(true)}><AiOutlinePlus size={20}/></td></tr>
    </tbody>
</table>}
 </div>
 <GridInfoBoxContext.Provider value={{gridinformation,setGridInformation}}>
  <GridInfoBox/>
</GridInfoBoxContext.Provider>
  </div>
        <div>
<Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>CONFIRM DELETION</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitComment}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Are you sure to delete the value {edit} ?</Form.Label><br></br>
            <Form.Label>Reason :</Form.Label>
           <Form.Control type='text' value = {comment} onChange={e=>setComment(e.target.value)} autoComplete='off'/>
             </Form.Group>      
             <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" type='submit'>
          Confirm
        </Button>
      </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
</div>

{/* button for show grid comments */}
<div className='commentshow'>
<button className='btn' onClick={e=>setShowAttached(true)}>
<span className='visible'><FaCommentAlt  fill='white' size={20}/> </span>
Comments
</button>
</div>

{/* button for show grid atttachments */}
<div className='attachmentshow'>
<button className='btn' onClick={e=> setTopRightModal(true)}>
  <span className='visible'><CgAttachment  fill='#00ad54' size={20}/></span>
 Attchments
</button>
</div>

{/* button for show chat window*/}
<div className='chatshow'  onClick={e=>setShowChat(true)}>
<button className='btn' onClick={e=>setShowChat(true)}>
<IoIosChatbubbles  fill='white' size={20}/> Chat
</button>
</div>




<LanguageAddShowContext.Provider value={{showLan,setShowLan}}>
  <LanguageAddContext.Provider value={{language,setLanguage}}>
   <AddLanPop prop={{lanedited,AddNewLanguage}}/>
  </LanguageAddContext.Provider>
</LanguageAddShowContext.Provider>

<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
<AttachFileContext.Provider value={{showattach,setShowAttach}}>
  <AttachFile varient={varient} handleSubmit={handleSubmit}/>
</AttachFileContext.Provider>
</AttachShowFileContext.Provider>

<ReqAddContext.Provider value={{requirement,setRequirement}}>
  <ReqAddShowContext.Provider value={{showreq,setShowReq}}>
   <GridAdditionalRequirement prop={AddNewRequirement}/>
  </ReqAddShowContext.Provider>
</ReqAddContext.Provider>

{/* pop up for chat winodw  */}
<GridChatContext.Provider value={{showchat,setShowChat}}>
 <GridChat prop={varient}/>
</GridChatContext.Provider>

{/* pop up for view and add documents to grid */}
< GridDocumentsAttchmentContext.Provider value={{topRightModal, setTopRightModal}}>
  <DocumentView prop={varient}/>
</GridDocumentsAttchmentContext.Provider>

{/* pop up window for view file attachments and gird comments */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
  <GridAttachment varient={varient} handleSubmit={handleSubmit}/>
</AttachShowFileContext.Provider>

{/* pop up window for export art work and grid as pdf */}
<GridExportContext.Provider value={{showGridExport,setShowGridExport}}>
  <GridExportComponent prop={{data,languages,languagetrans,grouped,grid,exportdict}}/>
</GridExportContext.Provider>
<ValueCheckWarning vcShow={vcShow} setVcShow={setVcShow} message={"Record with the same value already exists in the language"}/>
{editshow && <TranslationVersionChange language={languages[col]} trans_id={data[rown][col]} editshow={editshow} setEditShow={setEditShow}  handleEditValues={handleEditValues}/>}

        <div className='language-translation-btn' onClick={e=>setTranslationShow(true)}><h6>Language Translations</h6></div>
        <translationViewContext.Provider value={{translationShow,setTranslationShow}}>
        {translationShow && <LanguageTranslationDuplicated languages={languages} languagetrans={languagetrans} oldLanTrans={oldLanTrans}/>}
        </translationViewContext.Provider>
        <div className='language-translation-btn' onClick={e=>setGroupedTranslationShow(true)}><h6>Grouped Translations</h6></div>
        <GroupedtranslationViewContext.Provider value={{groupedTranslationShow,setGroupedTranslationShow}}>
        {groupedTranslationShow && <GroupedTranslation  grouped={grouped}/>}
        </GroupedtranslationViewContext.Provider>
        <div className='language-translation-btn '  onClick={e=>setSpecialTranslationShow(true)}><h6>Special Translations</h6></div>
        <div className="w-100" style={{height:"30px"}}></div>
        <SpecialtranslationViewContext.Provider value={{specialTrasnaltionShow,setSpecialTranslationShow}}>
        <Specialtranslation.Provider value={{specialTrasnaltion,setSpecialTranslation}}>
        {specialTrasnaltionShow && <SpecialTranslation prop={specialTrasnaltion}/>}
        </Specialtranslation.Provider>
        </SpecialtranslationViewContext.Provider>

        <EmailMessage emShow={emShow} setEmShow={setEmShow} email={email} setEmail={setEmail} handleSubmit={handleSubmit}/>
        <ConfirmGirdSubmission smShow={smShow} setSmShow={setSmShow} checkSalesReport={checkSalesReport}/>
        <SalesReportConfirmation slShow={slShow} setSlShow={setSlShow} setEmShow={setEmShow} setTopRightModal={setTopRightModal}/>
        {submit && <button className='btn special-btn' style={{color:"white"}}onClick={handleClicked}>{approver ==='Graphics Team'? 'Publish':'Submit'}</button>}
        <div className="w-100" style={{height:"50px"}}></div>
        </div>)
}
export default DuplicatedGrid