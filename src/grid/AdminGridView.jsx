import React,{useState,useEffect,useRef} from 'react'
import MainNavbar from '../Pages/mainNavbar'
import axios from 'axios';
import '../css/grid.css'
import {Token,Url} from '../context/ApiVariables';
import Dropdown from 'react-bootstrap/Dropdown';
import {AiOutlinePlus} from 'react-icons/ai';
import {IoIosChatbubbles} from 'react-icons/io';
import {HiOutlineDocumentDuplicate} from 'react-icons/hi';
import {TiExport,TiDeleteOutline} from 'react-icons/ti';
import {FaCommentAlt} from 'react-icons/fa';
import {ReqAddContext,ReqAddShowContext} from '../context/Context';
import {SpecialtranslationViewContext,Specialtranslation, GridChatContext, GridDocumentsAttchmentContext,GridInfoBoxContext,
        translationViewContext,GroupedtranslationViewContext,LanguageAddShowContext,LanguageAddContext,AttachShowFileContext,
        AttachFileContext,DuplicatePopUpContext,MainGridShowContext,DuplicateGridInfos,GridExportContext} from '../context/Context';
import LanguageTranslation, { LanguageTranslationDuplicated } from './LanguageTranslation';
import GroupedTranslation, { GroupedTranslationDuplicated } from './GroupedTranslation'
import SpecialTranslation from './SpecialTranslation'
import 'reactjs-popup/dist/index.css';
import {Form} from 'react-bootstrap';
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import DuplicatedGrid from './DuplicatedGrid'
import {CgAttachment} from 'react-icons/cg';
import AddLanPop from '../components/AddLanPop';
import GridAdditionalRequirement from '../components/GridAdditionalRequirement';
import GridDuplicatePopUp from '../components/GridDuplicatePopUp';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-default/dist/all.css';
import GridAttachment from '../components/AttachmentShow';
import AttachFile from '../components/AttachFile';
import GridExportComponent from '../exportpages/gridExport';
import GridChat from '../components/GridChat';
import DocumentView from '../components/DocumentsAttchment';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useNavigate, useParams } from 'react-router-dom';
import {RiFileHistoryFill} from 'react-icons/ri';
import { GridHistory } from '../Pages/History';
import {TiDelete} from 'react-icons/ti';
import {IoRemoveCircleOutline} from 'react-icons/io5';
import GridInfoBox from '../components/GridInfoBox';
import { isValuePresent,isValueRepeatedInColumn } from '../IsValueModified';
import { extractNameFromURL } from '../IsValueModified';
import TranslationVersionChange from '../components/TranslationVersionChange';
import { ConfirmDelete, ConfirmDesignStatus, ConfirmPublish, EmailMessage, EmailMessage2, EmailMessage3, SuccessMessage,ValueCheckWarning } from '../components/PopBoxes';
 const AdminGridViewChild = ({prop}) =>{
    const navigate = useNavigate()
    
    const [showGridExport,setShowGridExport] = useState(false)
    const [topRightModal, setTopRightModal] = useState(false);
    const [showattach,setShowAttach] = useState(false)
    const [showchat,setShowChat] = useState(false)
    const [showattached,setShowAttached] = useState(false)
    const [maingrid,setMainGrid] = useState(true)
    const [col,setCol] = useState(false)
    const [rown,setRow] = useState(false)
    const [translationShow,setTranslationShow] = useState(false)
    const [status,setStatus] = useState(localStorage.getItem("status"))
    const [specialTrasnaltion,setSpecialTranslation] = useState(prop.version[prop.version.length - 1]['special_requirement'])
    const [specialTrasnaltionShow,setSpecialTranslationShow] = useState(false)
    const [groupedTranslationShow,setGroupedTranslationShow] = useState(false)
    const [data,setData]= useState(prop.version[prop.version.length - 1]['grid'])
    const [edit,setEdit] = useState('')
    const [version,setVersion]= useState(prop.version)
    const [duplicate,setDuplicate] =useState(false)
    const [showduplicate,setShowDuplicate] =useState(false)
    const [show,setShow] = useState(false)
    const [lan,setLan] = useState([])
    const [language,setLanguage] = useState([])
    const [comment,setComment] = useState('')
    const [languages,setLanguages]= useState(prop.version[prop.version.length - 1].languages)
    const [languagetrans,setLanguageTrans]= useState(prop.version[prop.version.length - 1]['translation_values'])
    const [grouped,setGrouped] = useState(prop.version[prop.version.length - 1]['grouped_translation'])
    const [showLan,setShowLan] = useState(false)
    const [showreq,setShowReq] = useState(false)
    const [requirement,setRequirement] = useState('')
    const [validatecomment,setValidateComment] = useState(false)
    const [type,setType] = useState(false)
    const [editshow,setEditShow] = useState(false)
    const [gridinformation,setGridInformation] = useState(prop.version[prop.version.length - 1]['gridinformations'])
    const pdfExportComponent = useRef(null);
    const [approver,setApprover] = useState("UK Sales")
    const [stat,setStat] = useState(false)
    const [slShow,setSlShow] = useState(false)
    const [smShow,setSmShow] = useState(false)
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [vcShow,setVcShow] = useState(false)
    const [emShow,setEmShow] = useState(false)
    const [emShow2,setEmShow2] = useState(false)
    const [email,setEmail] = useState('')
    const grid = prop
    const values = prop
    const [duplicateInfo,setDuplicateInfo] = useState({
      jobno:'',
      varient:''
    })
    const[exportdict,setExportdict] =useState({
      additionalrequirement:prop.version[prop.version.length - 1]['special_requirement'],
      gridinformation:prop.version[prop.version.length - 1]['gridinformations']
            })
   
    let lanedited = [...lan]

    function isValidURL(string) {
      if(Number(string)){
        res=null
      }else{
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
      }   
    }
    
    const handleClicked = (row, column) => {
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
        });
        setLanguageTrans([...tran])
        setGrouped(groupedtrans)
      }else{
      if(edit !== val && isValueRepeatedInColumn(copy, col, val)){
        console.log(val,edit)
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

    // add new language to grid 
    const AddNewLanguage = (event)=>{
      event.preventDefault()
      if(languages.includes(language.value)){
          window.alert('Language already present in grid')
      }else{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'grid/addlan',
        data:{
        language:language.value,
        grid: data,
        values:values,
        grouped_translation:grouped,
        language_translations:languagetrans,
        },
      }).then(res=>{
        if(res.status == 200){
          setLanguages([...languages,language.value])
          setData(res.data[0])
          setGrouped(res.data[1])
          setLanguageTrans([...res.data[2]])
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
      if(!gridinformation){
        setGridInformation("")
      }
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'grid/version',
        data:{
        data:data,
        grid:prop,
        approver:approver,
        languages:languages,
        date:prop.date,
        translation:languagetrans,
        special_requirement:specialTrasnaltion,
        grouped_translation:grouped,
        gridinformations:gridinformation,
        user:window.localStorage.getItem("name"),
        email:email
        // additional_lan:language.value
        },
      }).then(res=>{
        if(res.status==200){
             setMessage({
                type:"success",
                message:"Grid Submitted for Approval"
              })
              setSsShow(true)
          setTimeout(function() { navigate('/task'); }, 5000);
          axios({
            method: 'post',
            url: Url+'grid/log',
            data:res.data,
          }).then((res)=>{  
        })}
        })
        
      // setBack(false)
      setShowDuplicate(true)
    }
    const handleChangeVersion = (event) => {
      console.log(version)
      
     setData(event.grid)
     setLanguages(event.languages)
     setSpecialTranslation(event.special_requirement)
     setGridInformation(event.gridinformations)
     setExportdict({
      ...exportdict,
      additionalrequirement:event.special_requirement,
      gridinformation:event.gridinformations
    })
    }
    useEffect(()=>{
      axios.defaults.headers.common['Authorization'] =Token
      axios.get(Url+'lan/list',{
       'headers':{
         'Authorization': Token
       }
       }).then((res)=>{
       setLan(res.data.languages)
       })
       if(window.localStorage.getItem("status") =='Published'){
        setType('Certified')
      }else{
        setType('open')
      }
    },[])
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
      if(comment == ''||comment == null){
        setValidateComment(true)
       
      }else{
      axios({
        method: 'post',
        url: Url+'post/comment',
        data:{
       comment:cm,
       varient:prop.varient,
      //  date:prop.date,
       user:localStorage.getItem("name")
        },
      }).then(res=>{
        console.log(res.data)
          })
          setShow(false)
        }
        }

        const handlePublish =(event)=>{
          axios({
            method: 'post',
            url: Url+'grid/log',
            data:{
                item:values.item,
                varient:values.varient,
                status:stat,
                job:values.job,
                factory:values.factory.label,
                user:window.localStorage.getItem('name'),
                Description:values.Description,
                type:type,
                user_group:window.localStorage.getItem('userGroup'),
                email:email
            },
          }).then((res)=>{
            if(res.status == 200){
                 setMessage({
                type:"success",
                message:"Grid " + stat
              })
              setSsShow(true)
              window.localStorage.setItem("status",stat)
              // setStatus(event)
              setTimeout(function() { navigate('/task'); }, 3000);
            }
          })
    }
    
    const handleDeleteLanguage = (ind) =>{
   if(window.confirm("Are your sure want to delete ?")){
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
    if(window.confirm("Are your sure want to delete ?")){
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

  const handleClick = (event) => {
    setStat(event)
    setSlShow(true)

  }
  // const Delete =(deleteValue)=>{
  //   deleteValue()
  // }
  return (
    <React.Fragment>
    <div className='admin-grid'>
      {/* <ConfirmDelete smShow={smShow} setSmShow={setSmShow} handleSubmit={Delete}/> */}
        {maingrid &&
    <div className='container-fluid grid-container'  style={{marginBottom:"40px",paddingLeft:"20px",paddingRight:"20px"}}>
    <div className="row grid-info" style={{fontFamily: "Times New Roman, Times, serif"}}>
    <div className="w-100"> <h4 className ='product-description' style={{textAlign:"center"}}>{prop.Description}</h4></div> 
    <div className="col-4" style={{textAlign:"left",}}>
    <div className="container">
<div className="row" >
   <div className="col"><h6>Job Number </h6></div>
   <div className="col">:{prop.job}</div>
   <div className="w-100"></div>
   <div className="col"><h6>Item Number   </h6></div>
   <div className="col">  :{prop.item} </div>
   <div className="w-100"></div>
   <div className="col"><h6>Varient Code </h6></div>
   <div className="col">  :{prop.varient} </div>
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
  <div className="col-4" style={{textAlign:"left",}}>
<div className="container">
  <div className="row" >    
  <div className="col">  <h6>Factory </h6></div>
  <div className="col">  : {prop.factory.label} </div>
  <div className="w-100"></div>
  <div className="col"><h6>Created By </h6></div>
  <div className="col">  : {prop.user}</div>
  <div className="w-100"></div>
  <div className="col"> <h6>Created Date </h6></div>
  <div className="col"> <p style={{"fontSize":"14px"}}>:{prop.date} </p></div>
  {prop.category == 'tea bag' &&  <> <div className="w-100"></div>
          <div className="col"> <h6>Tea Form </h6></div>
          <div className="col"> <p style={{"fontSize":"14px"}}>:{prop.tea_form}</p></div>
      </>}
</div>
</div>
</div>
<div className="col-4 buttons" style={{textAlign:"right"}}>
<div className="row"style={{width:"30vw"}}>
  <div className="col">
  <Dropdown>
    <Dropdown.Toggle variant="success" color='' id="dropdown-basic">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-git visible" viewBox="0 0 16 16">
    <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
  </svg> Versions
    </Dropdown.Toggle>

    <Dropdown.Menu>
    {version.map((item,index)=>( <Dropdown.Item onClick={e=>handleChangeVersion(item)}>{index+1}</Dropdown.Item>))}
    </Dropdown.Menu>
  </Dropdown>
</div>
  <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt' id='gridbt1' onClick={e=>setDuplicate(true)}><span className='visible'><HiOutlineDocumentDuplicate size={30}/></span>Duplicate</button>
</div>
  <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt' id='gridbt2'  onClick={handleExport}><span className='visible'><TiExport size={30}/></span> Export</button>
</div>
  <div className="w-100"></div>
  </div>
</div>
</div>
<PDFExport ref={pdfExportComponent} paperSize="A4">
<div className='grid-data' style={{width:"100%"}}>
  { data && <table className='grid-table'>
    <thead className='grid-head'><tr>
         {
           languages.map((item,index)=>(<th className='grid-heading' key={index} id={item  == '' ? 'requirement-head-main' :'requirement-head'} >{
              item  == 'heading' ? '' : index == 0 ? '':status != 'Certified' ? <>{item}<span className='delete' style={{float:"right",marginTop:"-2px"}} onClick={e=>handleDeleteLanguage(index)}><TiDeleteOutline color='#c71e29' size={23}/></span></>:<>{item}</>
            }</th>))
        }
        <th className='grid-heading new-req' style={{width:"4vw",textAlign:"center"}} onClick={AddColumn}><AiOutlinePlus size={20}/></th>
    </tr>
    </thead>
    <tbody>
    {
    data.map((element,index)=>(<tr key={index}>
      {element.map((item,ind)=>(<>{
   
      prop.duplicated ?
      <td
  key={ind}
  id='values'
  style={
    ind === 0
      ? { background: "None", paddingRight: "5px" }
      : item === ''
      ? { background: "rgba(51,102,255,255)" }
      : item === false
      ? { background: "red" }
      : isValuePresent(prop.oldGrid, data, index, ind)
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
    <img src={data[index][ind]} alt='asset' height="40px" width="50px" onClick={e => handleClicked(index, ind, e)} />
  ) : (
    <div
      id='value-input'
      onClick={e => handleClicked(index, ind)}
      style={
        item === false
          ? { background: "red", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : item === ''
          ? { background: "rgba(51,102,255,255)", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : isValuePresent(prop.oldGrid, data, index, ind)
          ? { color: "white", background: "#C202E8FF", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : { background: "None", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
      }
    >
      {data[index][ind]}
    </div>
  )}
</td>

      
      
      :
      
      <td
  key={ind}
  id='values'
  style={
    ind === 0
      ? { background: "None", paddingRight: "5px" }
      : item === ''
      ? { background: "rgba(51,102,255,255)" }
      : item === false
      ? { background: "red" }
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
    <img src={data[index][ind]} alt='asset' height="40px" width="50px" onClick={e => handleClicked(index, ind, e)} />
  ) : (
    <div
      id='value-input'
      onClick={e => handleClicked(index, ind)}
      style={
        item === false
          ? { background: "red", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : item === ""
          ? { background: "rgba(51,102,255,255)", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : { background: "None", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
      }
    >
      {data[index][ind]}
    </div>
  )}
</td>
}</>))}
      {/* {status != "Certified"?<><span className='delete' style={{float:"left"}} onClick={e=>handleDeleteRequirement(index)}><IoRemoveCircleOutline color='#c71e29' size={20}/></span></>:<></>} */}
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

</PDFExport>
{/* button for show grid comments */}
<div className='commentshow'>
<button className='btn' onClick={e=>setShowAttached(true)}>
<span className='visible'><FaCommentAlt  fill='white' size={21}/></span> Comments
</button>
</div>

<SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>

{/* button for show grid atttachments */}
<div className='attachmentshow'>
<button className='btn' onClick={e=> setTopRightModal(true)}>
  <span className='visible'><CgAttachment  fill='#00ad54' size={22}/></span>
 Attachment
</button>
</div>

{/* button for show chat window*/}
<div className='chatshow'>
<button className='btn' onClick={e=>setShowChat(true)}>
<IoIosChatbubbles  fill='white' size={19}/> Chat
</button>
</div>

{/* pop for confiramtion of delete grid value */}
<div>
<Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
       <Modal.Title>CONFIRM DELETION</Modal.Title>
        </Modal.Header>
          <Modal.Body>
           <Form onSubmit={handleSubmitComment}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Are you sure to delete the value {isValidURL(edit) ? "asset":edit} ?</Form.Label><br></br>
            <Form.Label>Reason :</Form.Label>
           <Form.Control type='text' value = {comment} onChange={e=>setComment(e.target.value)} autoComplete='off'/>
          {validatecomment && <label className='error'>*comment required for deletion</label>}
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


<NotificationContainer/>
{/* pop up for duplicate grid */}
<MainGridShowContext.Provider value={{maingrid,setMainGrid}}>
<DuplicatePopUpContext.Provider value={{duplicate,setDuplicate}}>
  <DuplicateGridInfos.Provider value={{duplicateInfo,setDuplicateInfo}}>
    <GridDuplicatePopUp/>
  </DuplicateGridInfos.Provider>
</DuplicatePopUpContext.Provider>
</MainGridShowContext.Provider>
{/* pop up box for adding new language to grid */}

<LanguageAddShowContext.Provider value={{showLan,setShowLan}}>
  <LanguageAddContext.Provider value={{language,setLanguage}}>
   <AddLanPop prop={{lanedited,AddNewLanguage}}/>
  </LanguageAddContext.Provider>
</LanguageAddShowContext.Provider>

{/* pop up for attch file and comment to grid */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
<AttachFileContext.Provider value={{showattach,setShowAttach}}>
  <AttachFile/>
</AttachFileContext.Provider>
</AttachShowFileContext.Provider>

{/* pop up window for view file attachments and gird comments */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
  <GridAttachment varient={prop.varient} />
</AttachShowFileContext.Provider>

{/* pop up window for export art work and grid as pdf */}
<GridExportContext.Provider value={{showGridExport,setShowGridExport}}>
  <GridExportComponent  prop={{data,languages,languagetrans,grouped,grid,exportdict}}/>
</GridExportContext.Provider>

{/* pop up for select additional requirements to grid */}
<ReqAddContext.Provider value={{requirement,setRequirement}}>
  <ReqAddShowContext.Provider value={{showreq,setShowReq}}>
   <GridAdditionalRequirement prop={AddNewRequirement}/>
  </ReqAddShowContext.Provider>
</ReqAddContext.Provider>

{/* pop up for chat winodw  */}
<GridChatContext.Provider value={{showchat,setShowChat}}>
 <GridChat prop={prop.varient}/>
</GridChatContext.Provider>

{/* pop up for view and add documents to grid */}
< GridDocumentsAttchmentContext.Provider value={{topRightModal, setTopRightModal}}>
  <DocumentView prop={prop.varient}/>
</GridDocumentsAttchmentContext.Provider>
<ValueCheckWarning vcShow={vcShow} setVcShow={setVcShow} message={"Record with the same value already exists in the language"}/>
{editshow && <TranslationVersionChange language={languages[col]} trans_id={data[rown][col]} editshow={editshow} setEditShow={setEditShow}  handleEditValues={handleEditValues}/>}

<div className='language-translation-btn' onClick={e=>setTranslationShow(true)}><h6>Language Translations</h6></div>
<translationViewContext.Provider value={{translationShow,setTranslationShow}}>
{translationShow &&<>{prop.duplicated? <LanguageTranslationDuplicated languages={languages} languagetrans={languagetrans} oldLanTrans={prop.oldLanTrans}/>:<LanguageTranslation languages={languages} languagetrans={languagetrans} />}</>}
</translationViewContext.Provider>
<div className='language-translation-btn' onClick={e=>setGroupedTranslationShow(true)}><h6>Grouped Translations</h6></div>
<GroupedtranslationViewContext.Provider value={{groupedTranslationShow,setGroupedTranslationShow}}>
{groupedTranslationShow &&<>{prop.duplicated? <GroupedTranslationDuplicated  grouped={grouped} oldGrid={prop.oldGrid}/> :<GroupedTranslation grouped={grouped}/>}</>}
</GroupedtranslationViewContext.Provider>
<div className='language-translation-btn '  onClick={e=>setSpecialTranslationShow(true)}><h6>Special Translations</h6></div>
<div className="w-100" style={{height:"30px"}}></div>
<SpecialtranslationViewContext.Provider value={{specialTrasnaltionShow,setSpecialTranslationShow}}>
 <Specialtranslation.Provider value={{specialTrasnaltion,setSpecialTranslation}}>
  {specialTrasnaltionShow && <SpecialTranslation prop={specialTrasnaltion}/>}
 </Specialtranslation.Provider>
</SpecialtranslationViewContext.Provider>

<EmailMessage2 emShow={emShow} setEmShow={setEmShow} email={email} setEmail={setEmail} handleSubmit={handleSubmit}/>
<EmailMessage3 emShow2={emShow2} setEmShow2={setEmShow2} email={email} setEmail={setEmail} handlePublish={handlePublish}/>
<ConfirmDesignStatus smShow={smShow} setSmShow={setSmShow} setEmShow={setEmShow}/>
<ConfirmPublish slShow={slShow} setSlShow={setSlShow} status={stat} setEmShow2={setEmShow2}/>
{status == 'Rejected' ?<button className='btn special-btn' style={{color:"white"}}onClick={e=>setSmShow(true)}>
  Submit</button>:status == 'Approved' ?<><button className='btn special-btn' style={{color:"white"}} onClick={e=>handleClick('Published')}>
  Publish</button><span> </span><button className='btn special-btn' style={{color:"white"}}onClick={e=>setSmShow(true)}>{approver ==='Graphics Team'? 'Publish':'Re-Submit'}</button></>:status=='Design Completed' ?<><button className='btn special-btn' style={{color:"white"}} onClick={e=>handleClick('Certified')}>Certify</button>
  <span> </span><button className='btn special-btn' style={{color:"white"}}onClick={e=>setSmShow(true)}>{approver ==='Graphics Team'? 'Publish':'Re-Submit'}</button></>:
  <button className='btn special-btn' style={{color:"white"}}onClick={he=>setSmShow(true)}>{approver ==='Graphics Team'? 'Publish':'Submit'}</button>}
  <div className="w-100" style={{height:"5vh"}}></div>
</div>
 }
{maingrid == false  && <MainGridShowContext.Provider value={{maingrid,setMainGrid}}>
<DuplicatedGrid prop={{languages,data,duplicateInfo,grid,values,specialTrasnaltion,grouped,languagetrans}}/>
</MainGridShowContext.Provider>}
    </div>
  </React.Fragment>
  )
}

function AdminGridView () {
    axios.defaults.headers.common['Authorization'] = Token
    const [showhistory, setHistoryShow] = useState(false)
    const historyClose = () => setHistoryShow(false)
    const [data,setData] = useState(false)
    const {varient} = useParams()
    useEffect(()=>{
        axios({
        method: 'get',
        url: Url+'grid/version',
        params:{
        var:varient
        },
      }).then(res=>{
        setData(res.data)
      })
    },[])
  return (
    <div className='admin-view-grid'>
        <MainNavbar prop='GRID MANAGEMENT'/>
{data && <AdminGridViewChild prop={data}/>}
<Modal show={showhistory} dialogClassName='custom-dialog' scrollable onHide={historyClose}>
      <Modal.Header closeButton>
        <Modal.Title>HISTORY</Modal.Title>
       </Modal.Header>
        <Modal.Body>
      <GridHistory prop={varient}/>
      </Modal.Body>
    </Modal>

        <footer style={{backgroundColor: "#f5faf5",position:"fixed", bottom: 0,width:"100vw",overlay:"true"}}>
          <div className='row'>
          <div className='col-3'>
          </div>
          <div className='col-6' id="footertag">
         <b><i>Graphics Language System</i></b>
          </div>
          <div className='col-3'>
          <b style={{color:"#08265aee",cursor: "pointer"}} onClick={e=>setHistoryShow(true)}><RiFileHistoryFill size={20}/>History</b> 
          </div>
          </div>
      </footer>
    </div>
  )
}

export default AdminGridView
