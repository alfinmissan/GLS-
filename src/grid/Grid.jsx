import React,{useEffect,useRef,useState,useContext, useCallback}from 'react'
import '../css/grid.css'  
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {ReqAddContext,ReqAddShowContext, AttachFileContext} from '../context/Context';
import { GridDataShowContext,GridPageShowContext,SpecialtranslationViewContext,Specialtranslation,
  GridChatContext, GridDocumentsAttchmentContext,AttachShowFileContext,GridInfoBoxContext,
  translationViewContext,GroupedtranslationViewContext,LanguageAddShowContext,LanguageAddContext,
  DuplicatePopUpContext,MainGridShowContext,DuplicateGridInfos,GridExportContext} from '../context/Context';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineDocumentDuplicate} from 'react-icons/hi';
import {TiExport,TiDeleteOutline} from 'react-icons/ti';
import LanguageTranslation from './LanguageTranslation';
import GroupedTranslation from './GroupedTranslation'
import SpecialTranslation from './SpecialTranslation'
import 'reactjs-popup/dist/index.css';
import Dropdown from 'react-bootstrap/Dropdown';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import DuplicatedGrid from './DuplicatedGrid'
import AddLanPop from '../components/AddLanPop';
import GridAdditionalRequirement from '../components/GridAdditionalRequirement';
import GridDuplicatePopUp from '../components/GridDuplicatePopUp';
import GridExportComponent from '../exportpages/gridExport';
import { useNavigate } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {FaCommentAlt} from 'react-icons/fa';
import {IoIosChatbubbles} from 'react-icons/io';
import {CgAttachment} from 'react-icons/cg';
import GridChat from '../components/GridChat';
import DocumentView from '../components/DocumentsAttchment';
import GridAttachment from '../components/AttachmentShow';
import AttachFile from '../components/AttachFile';
import {IoRemoveCircleOutline} from 'react-icons/io5';
import GridInfoBox from '../components/GridInfoBox';
import TranslationVersionChange from '../components/TranslationVersionChange';
import  {ConfirmGirdSubmission,EmailMessage,SalesReportConfirmation, SuccessMessage, ValueCheckWarning } from '../components/PopBoxes';
import { isValueRepeatedInColumn ,extractNameFromURL} from '../IsValueModified';

const GridView = ({prop}) => {
  const navigate = useNavigate()
  const [showGridExport,setShowGridExport] = useState(false)
  const [topRightModal, setTopRightModal] = useState(false);
  const [showattach,setShowAttach] = useState(false)
  const [showattached,setShowAttached] = useState(false)
  const [showchat,setShowChat] = useState(false)
  const [maingrid,setMainGrid] = useState(true)
  const [col,setCol] = useState(false)
  const [rown,setRow] = useState(false)
  const [translationShow,setTranslationShow] = useState(false)
  const [back,setBack] = useState(true)
  const [specialTrasnaltion,setSpecialTranslation] = useState('')
  const [gridinformation,setGridInformation] = useState(' ')
  const [specialTrasnaltionShow,setSpecialTranslationShow] = useState(false)
  const [groupedTranslationShow,setGroupedTranslationShow] = useState(false)
  const [data,setData]= useState(prop.data.data)
  const [edit,setEdit] = useState('')
  const [version,setVersion]= useState([0])
  const [salesReport,setSalesReport] = useState(false)
  const dataCopy = []
  const [duplicate,setDuplicate] =useState(false)
  const [showduplicate,setShowDuplicate] =useState(false)
  const [show,setShow] = useState(false)
  const [lan,setLan] = useState([])
  const [language,setLanguage] = useState([])
  const [comment,setComment] = useState('')
  const [languages,setLanguages]= useState(prop.data.languages)
  const [languagetrans,setLanguageTrans]= useState(prop.translation)
  const [grouped,setGrouped] = useState(prop.grouped)
  const {gridData,setGridData}= useContext(GridDataShowContext)
  const {showForm,setShowForm} = useContext(GridPageShowContext)
  const [showLan,setShowLan] = useState(false)
  const [showreq,setShowReq] = useState(false)
  const [editshow,setEditShow] = useState(false)
  const [requirement,setRequirement] = useState('')
  const [approver,setApprover] = useState("UK Sales")
  const [smShow, setSmShow] = useState(false);
  const [slShow, setSlShow] = useState(false);
  const [ssShow,setSsShow] = useState(false)
  const [vcShow,setVcShow] = useState(false)
  const [message,setMessage] = useState('')
  const [emShow,setEmShow] = useState('')
  const [email,setEmail] = useState('')
  const grid = {
    job:prop.grid.job,
    item:prop.grid.item,
    varient:prop.grid.varient,
    factory:prop.grid.factory,
    category:prop.grid.category,
    tea_form:prop.grid.tea_form,
    user:prop.name,
    date:prop.date,
    Description:prop.grid.Description,
  }
  const varient = prop.grid.varient
  const values = prop
  const [duplicateInfo,setDuplicateInfo] = useState({
    jobno:'',
    varient:''
  })
  const[exportdict,setExportdict] =useState({
    additionalrequirement:specialTrasnaltion,
    gridinformation:gridinformation
          })
  console.log(prop.gridvalues)
  let lanedited = [...lan]
  Object.defineProperty(dataCopy, 'secret', {
    value:prop.data.data ,
    writable : false,
    enumerable : true,
    configurable : false
});
  function isValidURL(string) {
    if(Number(string)){
      res=null
    }else{
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      return (res !== null)
    }   
  }
  
  const handleClickedEdit = (row, column) => {
    setRow(row)
    setCol(column)
    setEdit(data[row][column])
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
      }
      )
      setLanguageTrans([...tran])
      setGrouped(groupedtrans)
    }else{
      if(edit !== val && isValueRepeatedInColumn(copy, col, val)){
            setVcShow(true)
      }else{
      copy[rown][col] = val;
      setData(copy)
     if (tran[col-1] && Array.isArray(tran[col-1])) {
       for (let i = 0; i < tran[col-1].length; i++) {
          if (tran[col-1][i][0] === edit) {
              tran[col-1][i] = [val, txt];
                          break;
                }
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

  const handleClicked = () =>{
    setGridData(false)
    setShowForm(true)
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
      values:prop.gridvalues,
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

  // add new requirements to grid 
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
        }).catch(error=>{
          setMessage({type:"error",
             message:error.response.data})
            setSsShow(true)
        })
        setRequirement('')
  }

  // save versions of grid
  const handleSubmit = (event) =>{
    setShowAttach(false)
    axios.defaults.headers.common['Authorization'] = Token
    axios({
      method: 'post',
      url: Url+'grid/version',
      data:{
      data:data,
      grid:prop.grid,
      languages:languages,
      date:prop.date,
      blend:prop.gridvalues.blends,
      category:prop.gridvalues.category,
      no_of_bags:prop.gridvalues.no_of_bags,
      legalname:prop.gridvalues.legal_name,
      translation:languagetrans,
      special_requirement:specialTrasnaltion,
      grouped_translation:grouped,
      gridinformations:gridinformation,
      user:prop.name,
      approver:approver,
      email:email
      // additional_lan:language.value
      },
    }).then(res=>{
      if(res.status==200){
        console.log(res.data)
        axios({
          method: 'post',
          url: Url+'grid/log',
          data:res.data,
        }).then((res)=>{
          if(res.status < 300){
            // NotificationManager.removeAll();
            setMessage({type:"success",
             message:"Grid submited for approval"})
            setSsShow(true)
            setTimeout(function() { navigate('/task'); }, 3000);
          }
          console.log(res.data)
        })
      }
    })
    setBack(false)
    setShowDuplicate(true)
  }
  const handelChangeVersion = (event) => {
    console.log(version)
    
   setData(version[event].grid)
   setSpecialTranslation(version[event].special_requirement)
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
          varient:prop.grid.varient
      },
    }).then((res)=>{
      if(res.data.length > 0)
      setSalesReport(res.data)
    })
  
  },[topRightModal])
  const AddColumn = () =>{
    setShowLan(true)
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
     varient:prop.grid.varient,
     date:prop.date,
     user:prop.name
      },
    }).then(res=>{
      console.log(res.data)
        })
        setShow(false)
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
        setData([...values])
       }
      }
    const handleDeleteRequirement =(ind)=>{
      if (window.confirm("Are you sure Want delete requirement")){
      data.splice(ind,1)
      setData([...data])
      }
     
    }
  const handleExport =()=>{
    setExportdict({
      ...exportdict,
      additionalrequirement:specialTrasnaltion,
      gridinformation:gridinformation
    })
    setShowGridExport(true)
  }
  const handleSelectApprover = (event) =>setApprover(event.target.value)
  const checkSalesReport = () => {
    if(salesReport){
      setSmShow(false)
      setEmShow(true)
    }else{
      setSmShow(false)
      setSlShow(true)
    }
  }
  return (<div>{maingrid &&
    <div className='container-fluid grid-container'  style={{marginBottom:"40px",paddingLeft:"20px",paddingRight:"20px"}}>
      <div className="row grid-info" style={{fontFamily: "Times New Roman, Times, serif"}}>   
      <div className="w-100"> <h4 className ='product-description' style={{textAlign:"center"}}>{prop.grid.Description}</h4></div> 
      <div className="col-4" style={{textAlign:"left"}}>
      <div className="container">
  <div className="row" >
    <div className="col"><h6>Job Number </h6></div>
    <div className="col">: {prop.grid.job}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Item Number   </h6></div>
    <div className="col">  : {prop.grid.item}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Varient Code </h6></div>
    <div className="col">  : {prop.grid.varient}</div>
    <div className="w-100"></div>
    <div className="col"> <h6>To Approved By</h6></div>
    <div className="col">
       <Form.Select aria-label="Default select example"
               name="role"
               value={approver}
               onChange={handleSelectApprover}
                >
                    <option value="Language Approver">Language Approver</option>
                    <option value="UK Sales">UK Sales</option>
                    <option value="Graphics Team">Graphics Team</option>
        </Form.Select>
    </div>
 </div>
</div>
</div>
<div className="col-4" style={{textAlign:"left"}}>
      <div className="container">
  <div className="row" >    
    <div className="col">  <h6>Factory </h6></div>
    <div className="col">  : {prop.grid.factory.label}</div>
    <div className="w-100"></div>
    <div className="col"><h6>Created By </h6></div>
    <div className="col">  : {prop.name}</div>
    <div className="w-100"></div>
    <div className="col"> <h6>Created Date </h6></div>
    <div className="col"> <p style={{"fontSize":"14px"}}>: {prop.date}</p></div>
    {prop.grid.category == 'tea bag' &&  <> <div className="w-100"></div>
    <div className="col"> <h6>Tea Form </h6></div>
    <div className="col"> <p style={{"fontSize":"14px"}}>: {prop.grid.tea_form}</p></div>
      </>  }
 </div>
</div>
</div>
<div className="col-4" style={{textAlign:"right"}}>
<div className="row" style={{width:"30vw"}}>
    {/* <div className="col">
    <Dropdown>
      <Dropdown.Toggle variant="success" color='' id="dropdown-basic">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-git" viewBox="0 0 16 16">
      <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
      </svg> Versions
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {version.map((item,index)=>( <Dropdown.Item onClick={e=>handelChangeVersion(index)}>{index+1}</Dropdown.Item>))}
      </Dropdown.Menu>
    </Dropdown>
</div> */}
    <div className="w-100"></div>
    {showduplicate && 
    <div className="col">
    <button className='btn grid-bt ' id='gridbt1' onClick={e=>setDuplicate(true)}><span className='visible'><HiOutlineDocumentDuplicate size={30}/></span> Duplicate</button>
    </div>}
    <div className="w-100"></div>
    <div className="col">
    <button className='btn grid-bt ' id='gridbt1' onClick={e=>handleExport()}><span className='visible'><TiExport size={30}/> </span>Export</button>
</div>
    <div className="w-100"></div>
    </div>
  
</div>
</div>

  <div className='grid-data' style={{maxWidth:"100%",overflowX:"auto"}}>

  { data && <table className='grid-table'  id="id">
 

    <thead className='grid-head'><tr>
         {
           languages.map((item,index)=>(<th className='grid-heading' key={index} id={item  == '' ? 'requirement-head-main' :'requirement-head'} >{
              item  == 'heading' ? '' :  index == 0 ? '':<>{item}<span className='delete' style={{float:"right",marginTop:"-2px"}} onClick={e=>handleDeleteLanguage(index)}><TiDeleteOutline color='#c71e29' size={23}/></span></>
            }</th>))
        }
        <th className='grid-heading new-req' style={{width:"4vw",textAlign:"center"}} onClick={AddColumn}><AiOutlinePlus size={20}/></th>
    </tr>
    </thead>
    <tbody>
    {
    data.map((element,index)=>(<tr key={index}>
      {element.map((item,ind)=>(<td
  key={ind}
  id='values'
  style={
    ind === 0
      ? { background: "None", paddingRight: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
      : item === ""
      ? { background: "rgba(51,102,255,255)" }
      : item === false
      ? { background: "red" }
      : { background: "None" }
  }
>
  {ind === 0 ? (
    <>
      {item}
      <span
        className='delete'
        style={{ float: "right" }}
        onClick={e => handleDeleteRequirement(index)}
      >
        <IoRemoveCircleOutline color='#c71e29' size={20} />
      </span>
    </>
  ) : data[index][ind] === false ? (
    <div style={{ width: "100%", height: "5vh", backgroundColor: "red" }}></div>
  ) : isValidURL(data[index][ind]) ? (
    <img
      src={data[index][ind]}
      alt='asset'
      height='40px'
      width='50px'
      onClick={e => handleClickedEdit(index, ind)}
    />
  ) : (
    <div
      id='value-input'
      style={
        item === false
          ? { background: "red", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : item === ""
          ? { background: "rgba(51,102,255,255)", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : { background: "None", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
      }
      onClick={e => handleClickedEdit(index, ind)}
    >
      {data[index][ind]}
    </div>
  )}
</td>




))}
      </tr>))
    }
    <tr><td className='new-req' style={{textAlign:"center"}} onClick={e=>setShowReq(true)}><AiOutlinePlus size={20}/></td></tr>
    </tbody>
</table>}
</div>
{/* box for adding grid addition informaions */}
<GridInfoBoxContext.Provider value={{gridinformation,setGridInformation}}>
  <GridInfoBox/>
</GridInfoBoxContext.Provider>
<div>
  <NotificationContainer/>
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
<span className='visible'><FaCommentAlt  fill='white' size={20}/></span> Comments
</button>
</div>

{/* button for show grid atttachments */}
<div className='attachmentshow'>
<button className='btn' onClick={e=> setTopRightModal(true)}>
<span className='visible'><CgAttachment  fill='#00ad54' size={20}/></span> Attchments
</button>
</div>

{/* button for show chat window*/}
<div className='chatshow'  onClick={e=>setShowChat(true)}>
<button className='btn' onClick={e=>setShowChat(true)}>
<span className='visible'><IoIosChatbubbles  fill='white' size={20}/></span> Chat
</button>
</div>


{/* pop up for duplicate grid */}
<MainGridShowContext.Provider value={{maingrid,setMainGrid}}>
<DuplicatePopUpContext.Provider value={{duplicate,setDuplicate}}>
  <DuplicateGridInfos.Provider value={{duplicateInfo,setDuplicateInfo}}>
    <GridDuplicatePopUp/>
  </DuplicateGridInfos.Provider>
</DuplicatePopUpContext.Provider>
</MainGridShowContext.Provider>
{/* pop up box for adding new language to grid */}


<GridExportContext.Provider value={{showGridExport,setShowGridExport}}>
  <GridExportComponent prop={{data,languages,languagetrans,grouped,grid,exportdict}}/>
</GridExportContext.Provider>

<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message} />

<LanguageAddShowContext.Provider value={{showLan,setShowLan}}>
  <LanguageAddContext.Provider value={{language,setLanguage}}>
   <AddLanPop prop={{lanedited,AddNewLanguage}}/>
  </LanguageAddContext.Provider>
</LanguageAddShowContext.Provider>

<ReqAddContext.Provider value={{requirement,setRequirement}}>
  <ReqAddShowContext.Provider value={{showreq,setShowReq}}>
   <GridAdditionalRequirement prop={AddNewRequirement}/>
  </ReqAddShowContext.Provider>
</ReqAddContext.Provider>

{/* pop up for attch file and comment to grid */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
<AttachFileContext.Provider value={{showattach,setShowAttach}}>
  <AttachFile  handleSubmit={handleSubmit}/>
</AttachFileContext.Provider>
</AttachShowFileContext.Provider>

{/* pop up window for view file attachments and gird comments */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
  <GridAttachment varient={prop.grid.varient} handleSubmit={handleSubmit}/>
</AttachShowFileContext.Provider>

{/* pop up for chat winodw  */}
<GridChatContext.Provider value={{showchat,setShowChat}}>
 <GridChat prop={prop.grid.varient}/>
</GridChatContext.Provider>

{/* pop up for view and add documents to grid */}
< GridDocumentsAttchmentContext.Provider value={{topRightModal, setTopRightModal}}>
  <DocumentView prop={prop.grid.varient}/>
</GridDocumentsAttchmentContext.Provider>
<ValueCheckWarning vcShow={vcShow} setVcShow={setVcShow} message={"Record with the same value already exists in the language"}/>
{editshow && <TranslationVersionChange language={languages[col]} trans_id={data[rown][col]} editshow={editshow} setEditShow={setEditShow}  handleEditValues={handleEditValues}/>}

<div className='language-translation-btn' onClick={e=>setTranslationShow(true)}><h6>Language Translations</h6></div>
<translationViewContext.Provider value={{translationShow,setTranslationShow}}>
{translationShow && <LanguageTranslation  languages={languages} languagetrans={languagetrans} />}
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
{back && <button className=' back-btn' onClick={handleClicked}><IoMdArrowRoundBack color='#1d4934' size={30}/>Edit</button>}
<button className='btn special-btn' style={{color:"white",marginBottom:"20px"}}onClick={e=>setSmShow(true)}>{approver ==='Graphics Team'? 'Publish':'Submit'}</button>
</div>}

{maingrid == false  && <MainGridShowContext.Provider value={{maingrid,setMainGrid}}>
<DuplicatedGrid prop={{languages,data,duplicateInfo,grid,values,specialTrasnaltion,grouped,languagetrans}}/>
</MainGridShowContext.Provider>}
</div>
  )
}

export default GridView