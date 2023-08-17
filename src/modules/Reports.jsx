import React,{useState,useContext, useEffect} from "react";
import MainNavbar from "../Pages/mainNavbar";
import { Form } from 'react-bootstrap'
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import GridListTable from "../Pages/GridListTable";
import axios from "axios";
import {Token,Url} from '../context/ApiVariables';
import {ReportSetGridDataContext} from '../context/Context'
import Footer from "../components/Footer";
import ExportReport from "../exportpages/ExportReport";

function Reports() {
  axios.defaults.headers.common['Authorization'] = Token;
  const [grid, setGrid] = useState([]);
  const [type, setType] = useState('');
  const [gridType, setGridType] = useState('');
  const [item, setItem] = useState('');
  const [varient, setVarient] = useState('');
  const [usergroup, setUserGroup] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [show, setShow] = useState(false);
  const [stat, setStat] = useState(false);

  useEffect(() => {
    const storedStartDate = sessionStorage.getItem('re-sdate');
    const storedEndDate = sessionStorage.getItem('re-edate');

    try {
      if (storedStartDate) {
        const parsedStartDate = new Date(storedStartDate);
        if (!isNaN(parsedStartDate.getTime())) {
          setStartDate(parsedStartDate);
        } else {
          throw new Error('Invalid start date');
        }
      } else {
        setStartDate();
      }

      if (storedEndDate) {
        const parsedEndDate = new Date(storedEndDate);
        if (!isNaN(parsedEndDate.getTime())) {
          setEndDate(parsedEndDate);
        } else {
          throw new Error('Invalid end date');
        }
      } else {
        setEndDate();
      }
    } catch (error) {
      // Handle the error appropriately, such as setting default values or showing an error message to the user.
      console.error(error);
    }

    
const reStat = sessionStorage.getItem("re-stat");
const reItem = sessionStorage.getItem("re-item");
const reType = sessionStorage.getItem("re-type");
const reUserGroup = sessionStorage.getItem("re-usergroup");
const reVar = sessionStorage.getItem("re-var");

if (reStat !== null) {
  setType(reStat)
}

if (reItem !== null) {
  setItem(reItem)
}

if (reType !== null) {
 setGridType(reType);
}

if (reUserGroup !== null) {
 setUserGroup(reUserGroup)
}

if (reVar !== null) {
  setVarient(reVar)
}


  setTimeout(()=>{
 axios({
      method: 'post',
      url: Url + 'grid/report',
      params: {
        status:reStat,
        varient:reVar ,
        item: reItem,
        type:reType ,
        from:startDate,
        to:endDate ,
        usergroup:reUserGroup  ,
      },
    })
      .then((res) => {
        setGrid(res.data);
      })
  },3000)
  clearSessionStorageAfter20Minutes();
  }, []);

  function clearSessionStorageAfter20Minutes() {
    setTimeout(function () {
      sessionStorage.clear();
    }, 20 * 60 * 1000); // 20 minutes in milliseconds (1 minute = 60 seconds, 1 second = 1000 milliseconds)
  }

  const setValues = () => {
    if (type !== '') {
      sessionStorage.setItem('re-stat', type);
    } else {
      sessionStorage.removeItem('re-stat');
    }
    if (item !== '') {
      sessionStorage.setItem('re-item', item);
    } else {
      sessionStorage.removeItem('re-item');
    }

    if (gridType !== '') {
      sessionStorage.setItem('re-type', gridType);
    } else {
      sessionStorage.removeItem('re-type');
    }

    if (startDate) {
      sessionStorage.setItem('re-sdate', startDate);
    } else {
      sessionStorage.removeItem('re-sdate');
    }

    if (endDate) {
      sessionStorage.setItem('re-edate', endDate);
    } else {
      sessionStorage.removeItem('re-edate');
    }

    if (usergroup !== '') {
      sessionStorage.setItem('re-usergroup', usergroup);
    } else {
      sessionStorage.removeItem('re-usergroup');
    }

    if (varient !== '') {
      sessionStorage.setItem('re-var', varient);
    } else {
      sessionStorage.removeItem('re-var');
    }
  };

  const handleSubmit = (event) => {
    setValues();
    axios({
      method: 'post',
      url: Url + 'grid/report',
      params: {
        status: type,
        varient: varient,
        item: item,
        type: gridType,
        from: startDate,
        to: endDate,
        usergroup: usergroup,
      },
    })
      .then((res) => {
        setGrid(res.data);
      })
      .catch((error) => {
        // Handle the error appropriately
        console.error(error);
      });
  };

  return (
  <div className="report">
<MainNavbar prop='REPORTS'/>
<div style={{marginTop:"4rem",paddingTop:"10px"}}>
</div>
    <div className="report-search">
<div className="report-heading" style={{marginTop:"5px",textAlign:"left",paddingLeft:"20px",marginBottom:"10px"}}>Search Grids</div>

<div style={{textAlign:"left",paddingLeft:"20px"}} >
<Form>
    <div className="row">
        <div className="col-sm-6">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <div className="row">
                <div className="col-sm-3">
                <Form.Label>Item Number </Form.Label>
                </div>
                <div className="col-sm-8">
                <Form.Control type='text' value={item} onChange={e=>setItem(e.target.value)}/>
                </div>
            </div>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <div className="row">
            <div className="col-sm-3">
            <Form.Label>Varient Code  </Form.Label>
            </div>
            <div className="col-sm-8">
            <Form.Control type='text' value={varient} onChange={e=>setVarient(e.target.value)}/>
            </div>
        </div>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <div className="row">
            <div className="col-sm-3">
            <Form.Label>DATE </Form.Label>
            </div>
            <div className="col-sm-3">
            <DatePicker
      showIcon
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      placeholderText="from"
                  />
                
            </div>
          <div className="col-sm-1"></div>
            <div className="col-sm-3">
            <DatePicker
                 showIcon
                    selected={endDate}
                 onChange={(date) => setEndDate(date)}
                 placeholderText="to"
                  />
            </div>
        </div>
    </Form.Group>

        </div>
        {
           window.localStorage.getItem("userGroup") !=='Viewer' &&  <div className="col-sm-6">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <div className="row">
                    <div className="col-sm-3">
                    <Form.Label>Status  </Form.Label>
                    </div>
                    <div className="col-sm-8">
             <Form.Select aria-label="Default select example"
               name="status"
               value={type}
               onChange={e=>setType(e.target.value)}
              >
                    <option value=''>All</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Created">Created</option>
                    <option value="Modified">Modified</option>
                    <option value="Artwork Completed">Artwork Completed</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Design Completed">Design Completed</option>
                </Form.Select> 
                </div>
                </div>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <div className="row">
            <div className="col-sm-3">
            <Form.Label>User Group</Form.Label>
            </div>
            <div className="col-sm-8">
            <Form.Select aria-label="Default select example"
               name="role"
               value={usergroup}
               onChange={e=>setUserGroup(e.target.value)}
              >     
                    <option value=''>All</option>
                    {/* <option value="Viewer">Viewer</option> */}
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                    <option value="Language Approver">Language Approver</option>
                    <option value="UK Sales">UK Sales</option>
                    <option value="Graphics Team">Graphics Team</option>
                </Form.Select>
            </div>
        </div> 
        </Form.Group>
    
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <div className="row">
                <div className="col-sm-3">
                <Form.Label>Type Of Grid  </Form.Label>
                </div>
                <div className="col-sm-8">
                    <Form.Select aria-label="Default select example"
               name="type"
               value={gridType}
               onChange={e=>setGridType(e.target.value)}
              >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="Certified">Certified</option>
                </Form.Select> 
                  </div>
               </div>
            </Form.Group>
           </div>
       }
      
    </div> 
   </Form>
      <div style={{textAlign:"center",marginTop:"10px",marginBottom:"0px"}}><button className="btn btns btn-sh" onClick={e=>handleSubmit()}>Search</button>
      </div>
 </div>
 <div className="ex-rp" style={{textAlign:"right",paddingRight:"50px",paddingBottom:"5px",}}>
     <button style={{color:"white"}} className="btn special-btn" onClick={e=>setShow(true)}>Export Report</button>
 </div>
 </div>
{show && <ExportReport values={grid} show={show} setShow={setShow}/>}
  
        <GridListTable grid={grid}/>
  
        <Footer/>
    
</div>
    )
}
export default Reports