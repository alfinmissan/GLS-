import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Language from './modules/language';
import TranslationTable from './Pages/translationTable';
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';  
import TranslationVersions from './Pages/translationVersions';
import AddTranslation from './Pages/addTranslation';
import {Excelimport,MasterCodeImport} from './Pages/Excel';
import TranslationExcelimport from './Pages/translationExcelimport';
import { Mastercode } from './modules/masterCode';
import Textranslation from './Pages/textranslation'
import Requirements from './modules/requirements';
import CountryChild from './modules/country';
import CountryRequirement from './Pages/countryrequirement';
import  Factory  from './modules/factory';
import Asset from './modules/asset';
import   CommentWrapper from './modules/home';
import  HomePage  from './modules/HomePage'
import ImportCountry from './Pages/ImportCountry'
import  {RequirementExcelimport, BlendRequirementExcelimport, ItemRequirementExcelimport } from './Pages/importRequirement'
import Blends from './modules/Blends';
import LegalName from './modules/LegalName';
import GridManageMent from './grid/GridManageMent';
import UserManagement from './usermodule/UserManagement';
import  Reports from './modules/Reports';
import ResetPassword, { PasswordResetLinkSent } from './Pages/PasswordReset';
import BlendExcelimport from './Pages/BlendImport';
import LegalNameExcelimport from './Pages/LegalNameImport';
import GridPage from './grid/Gridpage';
import { Statistics } from './modules/statistics';
import Admin from './modules/Admin';
import TaskManagement from './modules/TaskManagement';
import TaskListGrid from './grid/TaskListGrid';
import AdminGridView from './grid/AdminGridView';
import UserSettingsPage from './Pages/UserSettingsPage';
import CustomCondition from './modules/CustomCondition';
import { AddCustomCiondition, AddCountryCustomCiondition } from './Pages/AddCustomCondition';
import GridFlowDetails from './Pages/GridFlowDetails';
import AddNewPassWordPage from './Pages/AddNewPassWordPage';
import Notifications from './modules/Notification';
import GridExportComponent from './exportpages/gridExport';
import { useEffect, useState } from 'react';
import UnauthorizedAccess from './Pages/UnauthorizedAccess';
import TaskListCompletedGrid from './grid/TasklistCompletdGrid';
import {Token,Url} from './context/ApiVariables';
import axios from 'axios';
import CertifiedGrid from './grid/AdminCertifiedGrid';
import CountryCustomCondition from './Pages/CountryBasedCustomCondition';
import BlendBasedRequirement from './Pages/BlendBasedRequirement';
import GraphicsGrid from './grid/GraphicsTeamGrid';
import { trackPromise } from 'react-promise-tracker';
import ItemNoModule from './modules/ItemNoModule';
import RegistrationNo from './Pages/RegistrationNo';
import  {ItemNoImport, RegistrationNoImport } from './Pages/ItemNoImport';
import GridVersionView, { GridVersionViewParent } from './grid/gridVersionView';
import Redirect from './components/Redirect';
import ItemBasedRequirement from './Pages/ItembasedRequirements';
function App() {
  const languages = []
  const [role,setRole]= useState("")
  axios.defaults.headers.common['Authorization'] =Token
  useEffect(()=>{
    axios({
      method: 'get',
      url: Url+'auth/admin',
  }).then(res=>(
    setRole(res.data)
      ))   
  },[])
  const data = []
  return (
    <div className="App">
    <Router>  
         {/* <MainNavbar/> */}
         <Routes>  
                <Route exact path='/test' element={<GridExportComponent prop={{data,languages}}/>}></Route> 
                <Route exact path='/' element={ <HomePage/>}></Route> 
                <Route exact path='/language' element={role ? <Language/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>  
                <Route exact path='/translation' element={role ?  <TranslationTable/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>   
                <Route exact path='/version/:trans_id/:master_id/:language' element={ role  ? <TranslationVersions />:role ==""?<></>:<UnauthorizedAccess/>}></Route> 
                <Route exact path='/addtranslation' element={role  ?  <AddTranslation />:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/excel' element={ role  ? <Excelimport/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>  
                <Route exact path='/trans/excel' element={ <TranslationExcelimport/> }></Route>
                <Route exact path='/mastercode' element={role  ? <Mastercode/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>  
                <Route exact path='/textranslation' element={role  ? <Textranslation />:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/requirements' element={role  ? <Requirements />:role ==""?<></>:<UnauthorizedAccess/>}></Route>   
                <Route exact path='/mastercode/excel' element={role  ?  <MasterCodeImport/> :role ==""?<></>:<UnauthorizedAccess/>}></Route>    
                <Route exact path='/country' element={role  ?  <CountryChild/>:role ==""?<></>:<UnauthorizedAccess/> }></Route> 
                <Route exact path='/requirement' element={ role  ? <CountryRequirement/> :role ==""?<></>:<UnauthorizedAccess/>}></Route> 
                <Route exact path='/factory' element={ role  ? <Factory/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>
                <Route exact path='/asset' element={role  ? <Asset/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>
                <Route exact path='/country/excel' element={ role  ? <ImportCountry/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>   
                <Route exact path='requirement/import' element={role  ?  <RequirementExcelimport/> :role ==""?<></>:<UnauthorizedAccess/>}></Route>  
                <Route exact path='/blend/requirement/import' element={role  ?  <BlendRequirementExcelimport/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='/item/requirement/import' element={role  ?  <ItemRequirementExcelimport/> :role ==""?<></>:<UnauthorizedAccess/>}></Route>   
                <Route exact path='blends' element={role  ?  <Blends/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>         
                <Route exact path='legalname' element={role  ?  <LegalName/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='gridmanagement' element={role  ? <GridManageMent/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>      
                <Route exact path='usermanagement' element={ role  ? <UserManagement/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='reports' element={ <Reports/> }></Route>  
                <Route exact path='/import/blend' element={ role  ? <BlendExcelimport/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>  
                <Route exact path='/import/legalname' element={role  ?  <LegalNameExcelimport/>:role ==""?<></>:<UnauthorizedAccess/> }></Route>  
                <Route exact path='/passwordreset' element={ <ResetPassword/> }></Route> 
                <Route exact path='/resetpasswordlink' element={ <PasswordResetLinkSent/> }></Route> 
                <Route exact path='/grid' element={role  ?  <GridPage/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='/statistics' element={ role  ? <Statistics/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='/admin' element={ role  ? <Admin/>:role ==""?<></> :<UnauthorizedAccess/>}></Route>   
                <Route exact path='/task' element={ <TaskManagement/> }></Route>
                <Route exact path='/tasklist/grid/:varient' element={<TaskListGrid/>}></Route>  
                <Route exact path='/admin/grid/:varient' element={role  ? <AdminGridView/>:role ==""?<></>:window.localStorage.getItem("userGroup") == 'Editor' ?<AdminGridView/>:<UnauthorizedAccess/>}></Route>  
                <Route exact path='/usersettings' element={<UserSettingsPage/>}></Route>  
                <Route exact path='/tasklist/completed/grid' element={<TaskListCompletedGrid/>}></Route>  
                <Route exact path='/grid/view/:varient/:status' element={<GridVersionViewParent/>}></Route> 
                <Route exact path='/customcondition' element={role  ? <CustomCondition/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>  
                <Route exact path='/addcondition' element={role  ? <AddCustomCiondition/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/addCustionCondition/:country' element={role  ? <AddCountryCustomCiondition/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/gridflow' element={<GridFlowDetails/>}></Route>   
                <Route exact path='/setnewpassword' element={<AddNewPassWordPage/>}></Route> 
                <Route exact path='/notification'   element={<Notifications/>}></Route>   
                <Route exact path='/certified/:varient'   element={<CertifiedGrid/>}></Route>   
                <Route exact path='/countrycustom/conidtion/:paramValue'   element={<CountryCustomCondition/>}></Route> 
                <Route exact path='/blend/requirements/:blend'  element={<BlendBasedRequirement/>}></Route>   
                <Route exact path='/grph/tasklist/grid/:status/:varient'  element={<GraphicsGrid/>}></Route>   
                <Route exact path='/itemno' element={role  ? <ItemNoModule/>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/reg/number/:itemNo' element={role  ? <RegistrationNo/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/item/number/import' element={role  ? <ItemNoImport/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/reg/number/import' element={role  ? <RegistrationNoImport/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
                <Route exact path='/redirect/:status/:varient' element={<Redirect/>}></Route>
                <Route exact path='itemno/requirement/:item_no' element={role ? <ItemBasedRequirement/>:role ==""?<></>:<UnauthorizedAccess/>}></Route>
          </Routes>
    </Router>  
    {/* <Example/> */}
  </div>
  );
}

export default App;
