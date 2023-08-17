import React,{useEffect, useState} from 'react'
import Footer from '../components/Footer'
import MainNavbar from '../Pages/mainNavbar'
import Dropdown from 'react-bootstrap/Dropdown';
import {TiExport} from 'react-icons/ti';
import {Token,Url} from '../context/ApiVariables';
import {AttachShowFileContext,SpecialtranslationViewContext,Specialtranslation,GridDocumentsAttchmentContext,
  AttachFileContext, translationViewContext,GroupedtranslationViewContext ,GridChatContext,GridExportContext} from '../context/Context';
import ReportSpecialTranslation from './ReportSpecialTranslation';
import '../css/tasklist.css'
import {LanguageTranslation,LanguageTranslationDuplicated} from './LanguageTranslation';
import GroupedTranslation from './GroupedTranslation'
import axios from 'axios';
import AttachFile from '../components/AttachFile';
import GridChat from '../components/GridChat';
import DocumentView from '../components/DocumentsAttchment';
import GridAttachment from '../components/AttachmentShow';
import GridExportComponent from '../exportpages/gridExport';
import { GridInfoBoxView } from '../components/GridInfoBox';
import { isValuePresent } from '../IsValueModified';
const TaskListCompletedGrid = ({prop}) => {
    axios.defaults.headers.common['Authorization'] = Token
    const [showGridExport,setShowGridExport] = useState(false)
    const [showattach,setShowAttach] = useState(false)
    const [topRightModal, setTopRightModal] = useState(false);
    const [showattached,setShowAttached] = useState(false)
    const [showchat,setShowChat] = useState(false)
    const [gridData,setGridData] = useState(false)
    const [translationShow,setTranslationShow] = useState()
    const [specialTrasnaltion,setSpecialTranslation] = useState()
    const [specialTrasnaltionShow,setSpecialTranslationShow] = useState(false)
    const [gridinformation,setGridInformation] = useState('')
    const [groupedTranslationShow,setGroupedTranslationShow] = useState(false)
    const [languagetrans,setLanguageTrans]= useState()
    const [grouped,setGrouped] = useState()
    const [languages,setLanguages] = useState([])
    const [data,setData] = useState([])
    const [version,setVersion]= useState([0])
    const [action,setAction] = useState(true)
    const [grid,setGrid] = useState({})
    
    const[exportdict,setExportdict] =useState({
      additionalrequirement:'',
      gridinformation:''
            })
    useEffect(()=>{
            axios({
            method: 'get',
            url: Url+'grid/version',
            params:{
            var:window.localStorage.getItem("var")
            },
          }).then(res=>{
            setGridData(res.data)
            setGrid(res.data)
            setLanguages(res.data.version[res.data.version.length - 1].languages)
            setData(res.data.version[res.data.version.length - 1]['grid'])
            setSpecialTranslation(res.data.version[res.data.version.length - 1]['special_requirement'])
            setGrouped(res.data.version[res.data.version.length - 1]['grouped_translation'])
            setLanguageTrans(res.data.version[res.data.version.length - 1]['translation_values'])
            setGridInformation(res.data.version[res.data.version.length - 1]['gridinformations'])
            setVersion(res.data.version)
            setExportdict({
              ...exportdict,
              additionalrequirement:res.data.version[res.data.version.length - 1]['special_requirement'],
              gridinformation:res.data.version[res.data.version.length - 1]['gridinformations']
            })
          })
        
    },[])
   
    const handelChangeVersion = (event) => {
        console.log(event)
        setData(event.grid)
        setLanguages(event.languages)
        setSpecialTranslation(event.special_requirement)
        setExportdict({
          ...exportdict,
          additionalrequirement:event.special_requirement,
          gridinformation:event.gridinformations
        })
       }
    const isValidURL =(string) => {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return(res !== null)
    }
   
  return (
    <div className='tasklist-grid'>
        <MainNavbar prop='GRID MANAGEMENT'/>
        <div className='container-fluid grid-container'  style={{marginBottom:"40px",paddingLeft:"20px",paddingRight:"20px"}}>
    <div className="row grid-info" style={{fontFamily: "Times New Roman, Times, serif"}}>
    <div className="w-100"> <h4 className ='product-description' style={{textAlign:"center"}}>{gridData.Description}</h4></div> 
    <div className="col-4" style={{textAlign:"left",marginTop:"20px"}}>
    <div className="container">
<div className="row" >
  <div className="col"><h6>Job Number </h6></div>
  <div className="col">:{gridData.job} </div>
  <div className="w-100"></div>
  <div className="col"><h6>Item Number   </h6></div>
  <div className="col">  :{gridData.item} </div>
  <div className="w-100"></div>
  <div className="col"><h6>Varient Code </h6></div>
  <div className="col">  :{gridData.varient} </div>
  {/* {prop.category == 'tea bag' &&  <> <div className="w-100"></div>
  <div className="col"> <h6>Tea Form </h6></div>
  <div className="col"> <p style={{"fontSize":"14px"}}>:</p></div>
    </>  } */}
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"left",marginTop:"20px"}}>
    <div className="container">
<div className="row" >    
  <div className="col">  <h6>Factory </h6></div>
  <div className="col">  :{gridData && <>{gridData.factory.label}</>} </div>
  <div className="w-100"></div>
  <div className="col"><h6>Created By </h6></div>
  <div className="col">  :{gridData.user} </div>
  <div className="w-100"></div>
  <div className="col"> <h6>Created Date </h6></div>
  <div className="col"> <p style={{"fontSize":"14px"}}>:{gridData.date}  </p></div>
 
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"right"}}>
<div className="row"style={{width:"30vw"}}>
  <div className="col">
  <Dropdown>
    <Dropdown.Toggle variant="success" color='' id="dropdown-basic">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-git visible" viewBox="0 0 16 16">
    <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
  </svg> Versions
    </Dropdown.Toggle>

    <Dropdown.Menu>
    {version.map((item,index)=>( <Dropdown.Item onClick={e=>handelChangeVersion(item)}>{index+1}</Dropdown.Item>))}
    </Dropdown.Menu>
  </Dropdown>
</div>
  {/* <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt'><HiOutlineDocumentDuplicate size={30}/> Duplicate</button>
</div> */}
  <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt ' id='gridbt1' onClick={e=>setShowGridExport(true)}><span className='visible'><TiExport size={30}/></span> Export</button>
</div>
  <div className="w-100"></div>
  </div>
</div>
</div>
<div className='tasklist-data' style={{width:"100%"}}>
{ data && <table className='grid-table'>

  <thead><tr>
       {
         languages.map((item,index)=>(<th className='grid-heading' key={index} id={item  == '' ? 'requirement-head-main' :'requirement-head'} >{
            item  == 'heading' ? '' : item
          }</th>))
      }   
  </tr>
  </thead>
  <tbody>
  {
  data.map((element,index)=>(<tr key={index}>
    {element.map((item,ind)=>(<>{
     gridData.duplicated ?
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
      : isValuePresent(grid.oldGrid, data, index, ind)
      ? { color: "white", background: "#C202E8FF" }
      : { background: "None" }
  }
>
  {ind === 0 ? (
    <>
      {item}
     
    </>
  ) : data[index][ind] === false ? (
    <div style={{ width: "100%", height: "5vh", backgroundColor: "red" }}></div>
  ) : isValidURL(data[index][ind]) ? (
    <img src={data[index][ind]} alt='asset' height="40px" width="50px" />
  ) : (
    <div
      id='value-input'

      style={
        item === false
          ? { background: "red", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : item === ''
          ? { background: "rgba(51,102,255,255)", whiteSpace: "normal", overflowWrap: "break-word", width: "100px", minHeight: "20px" }
          : isValuePresent(gridData.oldGrid, data, index, ind)
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
      
    </>
  ) : data[index][ind] === false ? (
    <div style={{ width: "100%", height: "5vh", backgroundColor: "red" }}></div>
  ) : isValidURL(data[index][ind]) ? (
    <img src={data[index][ind]} alt='asset' height="40px" width="50px"  />
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
    >
      {data[index][ind]}
    </div>
  )}
</td>}</>))}
    </tr>))
  }
  </tbody>
 
</table>}
</div>
<GridInfoBoxView prop={gridinformation}/>
{/* button for show grid comments */}
{/* <div className='commentshow'>
<button className='btn' onClick={e=>setShowAttached(true)}>
<FaCommentAlt  fill='#00ad54' size={30}/> comments
</button>
</div> */}

{/* button for show grid atttachments */}
{/* <div className='attachmentshow'>
<button className='btn' onClick={e=> setTopRightModal(true)}>
<CgAttachment  fill='#00ad54' size={30}/> attchments
</button>
</div> */}

{/* button for show chat window*/}
{/* <div className='chatshow'>
<button className='btn' onClick={e=>setShowChat(true)}>
<IoIosChatbubbles  fill='#4287f5' size={30}/> chat
</button>
</div> */}

{/* pop up window for export art work and grid as pdf */}
<GridExportContext.Provider value={{showGridExport,setShowGridExport}}>
  <GridExportComponent prop={{data,languages,languagetrans,grouped,grid,exportdict}}/>
</GridExportContext.Provider>

<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
<AttachFileContext.Provider value={{showattach,setShowAttach}}>
  <AttachFile prop={window.localStorage.getItem("var")}/>
</AttachFileContext.Provider>
</AttachShowFileContext.Provider>

{/* pop up window for view file attachments and gird comments */}
<AttachShowFileContext.Provider value={{showattached,setShowAttached}}>
  <GridAttachment prop={window.localStorage.getItem("var")}/>
</AttachShowFileContext.Provider>

{/* pop up for chat winodw  */}
<GridChatContext.Provider value={{showchat,setShowChat}}>
 <GridChat prop={window.localStorage.getItem("var")}/>
</GridChatContext.Provider>

{/* pop up for view and add documents to grid */}
< GridDocumentsAttchmentContext.Provider value={{topRightModal, setTopRightModal}}>
  <DocumentView prop={window.localStorage.getItem("var")}/>
</GridDocumentsAttchmentContext.Provider>

<div className='language-translation-btn' onClick={e=>setTranslationShow(true)}><h6>Language Translations</h6></div>
<translationViewContext.Provider value={{translationShow,setTranslationShow}}>
        {translationShow &&  <>{gridData.duplicated? <LanguageTranslationDuplicated languages={languages} languagetrans={languagetrans} oldLanTrans={gridData.oldLanTrans}/>:<LanguageTranslation languages={languages} languagetrans={languagetrans} />}</>}
</translationViewContext.Provider>

<div className='language-translation-btn' onClick={e=>setGroupedTranslationShow(true)}><h6>Grouped Translations</h6></div>
<GroupedtranslationViewContext.Provider value={{groupedTranslationShow,setGroupedTranslationShow}}>
        {groupedTranslationShow && <GroupedTranslation  grouped={grouped}/>}
</GroupedtranslationViewContext.Provider>

<div className='language-translation-btn '  onClick={e=>setSpecialTranslationShow(true)}><h6>Special Translations</h6></div>
        <div className="w-100" style={{height:"30px"}}></div>
<SpecialtranslationViewContext.Provider value={{specialTrasnaltionShow,setSpecialTranslationShow}}>
        {specialTrasnaltionShow && <ReportSpecialTranslation prop={specialTrasnaltion}/>}
</SpecialtranslationViewContext.Provider>
<div className="w-100" style={{height:"10vh"}}></div>
</div>

        <Footer/>
    </div>
  )
}

export default TaskListCompletedGrid 