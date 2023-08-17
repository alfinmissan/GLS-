import React,{useEffect,useRef,useState,useContext}from 'react'
import '../css/grid.css'  
import {Token,Url} from '../context/ApiVariables';
import axios from 'axios';
import {ReportGridViewContext,ReportSetGridDataContext,SpecialtranslationViewContext,Specialtranslation,
  translationViewContext,GroupedtranslationViewContext,GridExportContext} from '../context/Context';
import {HiOutlineDocumentDuplicate} from 'react-icons/hi';
import {TiExport} from 'react-icons/ti';
import {LanguageTranslation,LanguageTranslationDuplicated} from './LanguageTranslation';
import GroupedTranslation from './GroupedTranslation'
import SpecialTranslation from './SpecialTranslation'
import ReportSpecialTranslation from './ReportSpecialTranslation';
import GridExportComponent from '../exportpages/gridExport';
import { GridInfoBoxView } from '../components/GridInfoBox';
import { isValuePresent } from '../IsValueModified';
import {FiDownload,FiCheckCircle} from 'react-icons/fi';
import {BsPaletteFill} from 'react-icons/bs';
import { saveAs } from 'file-saver';
import MainNavbar from '../Pages/mainNavbar';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer'
import { ArtWorkPreviewPopup } from '../components/PopBoxes';
export const GridVersionViewParent = () =>{
  const [data,setData] = useState(false)
  const {varient,status} = useParams()
   axios.defaults.headers.common['Authorization'] = Token
   useEffect(()=>{
      axios({
          method: 'get',
          url: Url+'/grid/version',
          params: {
              var:varient
          }
      }).then(res=>{
        setData(res.data)
      })
   },[])
  

return (<div className='admin-view-grid'>
            <MainNavbar prop='GRID MANAGEMENT'/>
   {data && <GridVersionView prop={data} stat={status}/>}
             <Footer/>
        </div>)
}

const GridVersionView = (props) => {
    const {prop,stat} = props
    axios.defaults.headers.common['Authorization'] = Token
    const [showGridExport,setShowGridExport] = useState(false)
    const len = prop.version.length
    const reportTemplateRef = useRef(null);
    const {gridView,setGridView} = useContext(ReportGridViewContext)
    const [gridData,setGridData] = useState(prop.version[len-1])
    const [translationShow,setTranslationShow] = useState(false)
    const [specialTrasnaltion,setSpecialTranslation] = useState(gridData.special_requirement)
    const [specialTrasnaltionShow,setSpecialTranslationShow] = useState(false)
    const [groupedTranslationShow,setGroupedTranslationShow] = useState(false)
    const [languagetrans,setLanguageTrans]= useState(gridData.translation_values)
    const [grouped,setGrouped] = useState(gridData.grouped_translation)
    const [gridinformation,setGridInformation] = useState(gridData.gridinformations)
    const [data,setData]= useState(prop.version[len-1].grid)
    const [version,setVersion]= useState(prop.version)
    const [languages,setLanguages]= useState(prop.version[len-1].languages)
    const grid = prop 
    const [artwork,setArtWork] = useState(false)
    const [showartpreview,setShowartpreview] = useState(false)
    const [filename,setFilename] = useState('')
    const[exportdict,setExportdict] =useState({
      additionalrequirement:gridData.special_requirement,
      gridinformation:gridData.gridinformations
            })




    function isValidURL(string) {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
      }
          
      function download(){
        const filename =  `artwork-job${prop.job}-item${prop.item}-varient${prop.varient}`;
        const fileUrl = artwork.file;
    
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            saveAs(blob, filename);
          })
          .catch((error) => {
            console.error('Error downloading the file:', error);
          });
      };
    
    
      useEffect(()=>{
        let file =  `artwork-job${prop.job}-item${prop.item}-varient${prop.varient}`
        setFilename(file)
        axios({
          method: 'get',
          url: Url+'get_artwork',
          params:{
          var:prop.varient
          },
        }).then(res=>{
          setArtWork(res.data)
        })
       },[])  

  return (<div className='tasklist-grid'>
    <div className='container-fluid grid-container'  style={{paddingLeft:"20px",paddingRight:"20px"}}>
    <div className="row grid-info" style={{fontFamily: "Times New Roman, Times, serif"}}>
    <div className="w-100"> {stat?<div className="row"><div className="col"><h4 className ='product-description' style={{textAlign:"right"}}>{prop.Description}</h4></div>
    <div className="col" style={{textAlign:"left"}}><button className='btn btn-certified'>CERTIFIED <FiCheckCircle size={24}/></button></div></div>:<h4 className ='product-description' style={{textAlign:"center"}}>{prop.Description}</h4>}</div> 
    <div className="col-4" style={{textAlign:"left"}}>
    <div className="container">
<div className="row" >
  <div className="col"><h6>Job Number </h6></div>
  <div className="col">: {prop.job}</div>
  <div className="w-100"></div>
  <div className="col"><h6>Item Number   </h6></div>
  <div className="col">  : {prop.item}</div>
  <div className="w-100"></div>
  <div className="col"><h6>Varient Code </h6></div>
  <div className="col">  : {prop.varient}</div>
  {prop.category == 'tea bag' &&  <> <div className="w-100"></div>
  <div className="col"> <h6>Tea Form </h6></div>
  <div className="col"> <p style={{"fontSize":"14px"}}>: {prop.tea_form}</p></div>
    </>  }
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"left"}}>
    <div className="container">
<div className="row" >    
  <div className="col">  <h6>Factory </h6></div>
  <div className="col">  : {prop.factory.label}</div>
  <div className="w-100"></div>
  <div className="col"><h6>Created By </h6></div>
  <div className="col">  : {prop.user}</div>
  <div className="w-100"></div>
  <div className="col"> <h6>Created Date </h6></div>
  <div className="col"> <p style={{"fontSize":"14px"}}>: {prop.date}</p></div>
 
</div>
</div>
</div>
<div className="col-4" style={{textAlign:"right"}}>
<div className="row"style={{width:"30vw"}}>
  {/* <div className="col">
  <Dropdown>
    <Dropdown.Toggle variant="success" color='' id="dropdown-basic">
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-git" viewBox="0 0 16 16">
    <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
  </svg> Versions
    </Dropdown.Toggle>

    <Dropdown.Menu>
    {version.map((item,index)=>( <Dropdown.Item onClick={e=>handelChangeVersion(item)}>{index+1}</Dropdown.Item>))}
    </Dropdown.Menu>
  </Dropdown>
</div> */}
  {/* <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt'><HiOutlineDocumentDuplicate size={30}/> Duplicate</button>
 </div> */}
  <div className="w-100"></div>
  <div className="col">
  <button className='btn grid-bt' id='create_pdf gridbt1' onClick={e=>setShowGridExport(true)}><span className='visible'><TiExport size={30}/></span>Export</button>
</div>
  <div className="w-100"></div>
  </div>

</div>
</div>
<div className='tasklist-data' style={{width:"100%"}} id="id">
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
{artwork.file &&<ArtWorkPreviewPopup showartpreview={showartpreview} setShowartpreview={setShowartpreview} preview={artwork.file} filename={filename}/>}
{artwork.file && <div className='artwork' onClick={e=>setShowartpreview(true)}>
<button className='btn'>
  <div className="row">
    <div className='col'>
  <BsPaletteFill/>  Artwork
    </div>
  </div>
</button>
</div>
}

<GridInfoBoxView prop={gridinformation}/>
<GridExportContext.Provider value={{showGridExport,setShowGridExport}}>
  <GridExportComponent prop={{data,languages,languagetrans,grouped,grid,exportdict}}/>
</GridExportContext.Provider>
<div className='language-translation-btn' onClick={e=>setTranslationShow(true)}><h6>Language Translations</h6></div>
<translationViewContext.Provider value={{translationShow,setTranslationShow}}>
        {translationShow && <>{gridData.duplicated? <LanguageTranslationDuplicated languages={languages} languagetrans={languagetrans} oldLanTrans={gridData.oldLanTrans}/>:<LanguageTranslation languages={languages} languagetrans={languagetrans} />}</>}
</translationViewContext.Provider>

<div className='language-translation-btn' onClick={e=>setGroupedTranslationShow(true)}><h6>Grouped Translations</h6></div>
<GroupedtranslationViewContext.Provider value={{groupedTranslationShow,setGroupedTranslationShow}}>
        {groupedTranslationShow && <GroupedTranslation grouped={grouped}/>}
</GroupedtranslationViewContext.Provider>

<div className='language-translation-btn '  onClick={e=>setSpecialTranslationShow(true)}><h6>Special Translations</h6></div>
        <div className="w-100" style={{height:"30px"}}></div>
<SpecialtranslationViewContext.Provider value={{specialTrasnaltionShow,setSpecialTranslationShow}}>
        {specialTrasnaltionShow && <ReportSpecialTranslation prop={specialTrasnaltion}/>}
</SpecialtranslationViewContext.Provider>
</div>
{/* <div className="w-100" style={{height:"10vh"}}></div> */}

</div>
)
}

export default GridVersionViewParent