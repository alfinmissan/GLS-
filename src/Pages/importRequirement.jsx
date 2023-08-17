import React, { Component } from 'react';
import '../App.css';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import {InputGroup, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import axios from 'axios';
import MainNavbar from './mainNavbar';
import {Token,Url} from '../context/ApiVariables';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import DataTable from '../components/DataTable';

export class RequirementExcelimport extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      file:null,
      duplicateLoaded:false,
      duplicates:null,
      master_code:null,
      masterCodeLoaded:false,
      rows: null,
      cols: null
    }
    this.fileHandler = this.fileHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openFileBrowser = this.openFileBrowser.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.openNewPage = this.openNewPage.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.fileInput = React.createRef();
  }
  
  renderFile = (fileObj) => {
    this.setState({
      file:fileObj
    })
      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          this.setState({
            dataLoaded: true,
            cols: resp.cols,
            rows: resp.rows
          });
          // console.log(resp.cols)
          // console.log(resp.rows)
        }
      }); 
  }

  fileHandler = (event) => {    
    if(event.target.files.length){
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      
      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }    
      else{
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }               
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  openFileBrowser = () => {
    this.fileInput.current.click();
  }

  openNewPage = (chosenItem) => {
    const url = chosenItem === "github" ? "https://github.com/ashishd751/react-excel-renderer" : "https://medium.com/@ashishd751/render-and-display-excel-sheets-on-webpage-using-react-js-af785a5db6a7";
    window.open(url, '_blank');
  }

  handleImport = (event) =>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    const url = Url+'importexport/requirements';
    const formData = new FormData();
    formData.append('files',this.state.file)
    formData.delete('_method');
    const config = {
        headers: {
            'Authorization':Token,
            'content-type': 'multipart/form-data'
        }
    }
    return  axios.post(url, formData,config).then(res=>{
      console.log(res.data)
      if(res.status==200){
        this.setState({
          dataLoaded: false,
          duplicateLoaded:true,
          duplicates: res.data,
        })    
        // console.log(res.data)  
      }else if(res.status==201){
        this.setState({
          dataLoaded: false,
          master_code:res.data,
          masterCodeLoaded:true,
        })
      }else if(res.status==208){
        window.location.replace('/requirements')
      }else if(res.status == 202){
        NotificationManager.error("Import rejected ,country Code " +res.data +" not present in database")
      }
    })
  
  }

  render() {
    return (
      <div style={{"marginTop":"13vh"}}>
        <MainNavbar prop='Import Requirement'/>
        {/* <div>
          <div className="jumbotron">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>  
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"github")}>GitHub</Button>{' '}
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"medium")}>Medium</Button>                      
              <hr className="my-2" />
              <p>Developed with <span className="fa fa-heart"></span> by Ashish Deshpande</p>
          </div>
        </div> */}
        <Container>
        <form>
          <FormGroup row>
            {/* <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>           */}
                 <div className="box">
                                             
              <InputGroup>
          
                  <Button color="info" size='lg' style={{color: "white", zIndex: 0,top:"0px"}} onClick={this.openFileBrowser.bind(this)}>Choose</Button>
                  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }}  />                           
              
                <input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} /> 
                <Button type ='submit' onClick={this.handleImport} style={{color: "white", zIndex: 0,top:"0px"}}>Import</Button>                                          
                <FormFeedback>    
                  <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                    Please select a .xlsx file only !
                  </Fade>                                                                
                </FormFeedback>
              </InputGroup>     
          </div>
          </FormGroup>   
        </form>

        {this.state.dataLoaded && 
        <div>
          <Card body outline color="secondary" className="restrict-card">
          <DataTable heading={this.state.rows[0]} data={this.state.rows} />
              {/* <OutTable data={this.state.rows} columns={this.state.cols}  tableClassName="ExcelTable2007"/> */}
          </Card>  
        </div>}

        {this.state.duplicateLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected Requiremet already present in Database</p>
          <Card body outline color="secondary" className="restrict-card">
            <div className="lan tableRow">
              <table className='table'>
                <thead>
                  <tr>
                    <th>Requirement</th>
                    <th>Type</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.requirement}</td>
                      <td>{item.type}</td>
                      <td>{item.value}</td>
                    </tr>))
                  }
                </tbody>
              </table>
              </div>
          </Card>  
        </div>}
        {this.state.masterCodeLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected</p>
          <Card body outline color="secondary" className="restrict-card">
        values 
          {this.state.master_code.map((item,index)=>(<p style={{color:"red"}} key={index}>{item},</p>)) 
          }<p> not present in master code</p>
          </Card>  
        </div>}
        </Container>
        <NotificationContainer/>
      </div>
    );
  }
}


export class BlendRequirementExcelimport extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      file:null,
      duplicateLoaded:false,
      duplicates:null,
      master_code:null,
      masterCodeLoaded:false,
      rows: null,
      cols: null
    }
    this.fileHandler = this.fileHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openFileBrowser = this.openFileBrowser.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.openNewPage = this.openNewPage.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.fileInput = React.createRef();
  }
  
  renderFile = (fileObj) => {
    this.setState({
      file:fileObj
    })
      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          this.setState({
            dataLoaded: true,
            cols: resp.cols,
            rows: resp.rows
          });
        }
      }); 
  }

  fileHandler = (event) => {    
    if(event.target.files.length){
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      
      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }    
      else{
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }               
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  openFileBrowser = () => {
    this.fileInput.current.click();
  }

  openNewPage = (chosenItem) => {
    const url = chosenItem === "github" ? "https://github.com/ashishd751/react-excel-renderer" : "https://medium.com/@ashishd751/render-and-display-excel-sheets-on-webpage-using-react-js-af785a5db6a7";
    window.open(url, '_blank');
  }

  handleImport = (event) =>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    const url = Url+'import/exportBlendRequirements';
    const formData = new FormData();
    formData.append('files',this.state.file)
    formData.delete('_method');
    const config = {
        headers: {
            'Authorization':Token,
            'content-type': 'multipart/form-data'
        }
    }
    return  axios.post(url, formData,config).then(res=>{
      console.log(res.data)
      if(res.status==200){
        this.setState({
          dataLoaded: false,
          duplicateLoaded:true,
          duplicates: res.data,
        })    
        // console.log(res.data)  
      }else if(res.status==201){
        this.setState({
          dataLoaded: false,
          master_code:res.data,
          masterCodeLoaded:true,
        })
      }else if(res.status==208){
        window.location.replace('/blends')
      }else if(res.status == 202){
        NotificationManager.error("Import rejected ,country Code " +res.data +" not present in database")
      }
    })
  
  }

  render() {
    return (
      <div style={{"marginTop":"13vh"}}>
        <MainNavbar prop='Import Blend Requirement'/>
        {/* <div>
          <div className="jumbotron">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>  
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"github")}>GitHub</Button>{' '}
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"medium")}>Medium</Button>                      
              <hr className="my-2" />
              <p>Developed with <span className="fa fa-heart"></span> by Ashish Deshpande</p>
          </div>
        </div> */}
        <Container>
        <form>
          <FormGroup row>
            {/* <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>           */}
                 <div className="box">
                                             
              <InputGroup>
          
                  <Button color="info" size='lg' style={{color: "white", zIndex: 0,top:"0px"}} onClick={this.openFileBrowser.bind(this)}>Choose</Button>
                  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }}  />                           
              
                <input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} /> 
                <Button type ='submit' onClick={this.handleImport} style={{color: "white", zIndex: 0,top:"0px"}}>Import</Button>                                          
                <FormFeedback>    
                  <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                    Please select a .xlsx file only !
                  </Fade>                                                                
                </FormFeedback>
              </InputGroup>     
          </div>
          </FormGroup>   
        </form>

        {this.state.dataLoaded && 
        <div>
          <Card body outline color="secondary" className="restrict-card">
          <DataTable heading={this.state.rows[0]} data={this.state.rows} />
              {/* <OutTable data={this.state.rows} columns={this.state.cols}  tableClassName="ExcelTable2007"/> */}
          </Card>  
        </div>}

        {this.state.duplicateLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected Requiremet already present in Database</p>
          <Card body outline color="secondary" className="restrict-card">
            <div className="lan tableRow">
              <table className='table'>
                <thead>
                  <tr>
                    <th>Requirement</th>
                    <th>Type</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.requirement}</td>
                      <td>{item.type}</td>
                      <td>{item.value}</td>
                    </tr>))
                  }
                </tbody>
              </table>
              </div>
          </Card>  
        </div>}
        {this.state.masterCodeLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected</p>
          <Card body outline color="secondary" className="restrict-card">
        values 
          {this.state.master_code.map((item,index)=>(<p style={{color:"red"}} key={index}>{item},</p>)) 
          }<p> not present in master code</p>
          </Card>  
        </div>}
        </Container>
        <NotificationContainer/>
      </div>
    );
  }
}




export class ItemRequirementExcelimport extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      file:null,
      duplicateLoaded:false,
      duplicates:null,
      master_code:null,
      masterCodeLoaded:false,
      rows: null,
      cols: null
    }
    this.fileHandler = this.fileHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.openFileBrowser = this.openFileBrowser.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.openNewPage = this.openNewPage.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.fileInput = React.createRef();
  }
  
  renderFile = (fileObj) => {
    this.setState({
      file:fileObj
    })
      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          this.setState({
            dataLoaded: true,
            cols: resp.cols,
            rows: resp.rows
          });
        }
      }); 
  }

  fileHandler = (event) => {    
    if(event.target.files.length){
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      
      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if(fileName.slice(fileName.lastIndexOf('.')+1) === "xlsx"){
        this.setState({
          uploadedFileName: fileName,
          isFormInvalid: false
        });
        this.renderFile(fileObj)
      }    
      else{
        this.setState({
          isFormInvalid: true,
          uploadedFileName: ""
        })
      }
    }               
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  openFileBrowser = () => {
    this.fileInput.current.click();
  }

  openNewPage = (chosenItem) => {
    const url = chosenItem === "github" ? "https://github.com/ashishd751/react-excel-renderer" : "https://medium.com/@ashishd751/render-and-display-excel-sheets-on-webpage-using-react-js-af785a5db6a7";
    window.open(url, '_blank');
  }

  handleImport = (event) =>{
    event.preventDefault()
    axios.defaults.headers.common['Authorization'] = Token
    const url = Url+'import/exportItemRequirements';
    const formData = new FormData();
    formData.append('files',this.state.file)
    formData.delete('_method');
    const config = {
        headers: {
            'Authorization':Token,
            'content-type': 'multipart/form-data'
        }
    }
    return  axios.post(url, formData,config).then(res=>{
      console.log(res.data)
      if(res.status==200){
        this.setState({
          dataLoaded: false,
          duplicateLoaded:true,
          duplicates: res.data,
        })    
        // console.log(res.data)  
      }else if(res.status==201){
        this.setState({
          dataLoaded: false,
          master_code:res.data,
          masterCodeLoaded:true,
        })
      }else if(res.status==208){
        window.location.replace('/itemno')
      }else if(res.status == 202){
        NotificationManager.error("Import rejected ,country Code " +res.data +" not present in database")
      }
    })
  
  }

  render() {
    return (
      <div style={{"marginTop":"13vh"}}>
        <MainNavbar prop='Import Item Requirement'/>
        {/* <div>
          <div className="jumbotron">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>  
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"github")}>GitHub</Button>{' '}
              <Button className="primary jumbotron-button" onClick={this.openNewPage.bind(this,"medium")}>Medium</Button>                      
              <hr className="my-2" />
              <p>Developed with <span className="fa fa-heart"></span> by Ashish Deshpande</p>
          </div>
        </div> */}
        <Container>
        <form>
          <FormGroup row>
            {/* <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>           */}
                 <div className="box">
                                             
              <InputGroup>
          
                  <Button color="info" size='lg' style={{color: "white", zIndex: 0,top:"0px"}} onClick={this.openFileBrowser.bind(this)}>Choose</Button>
                  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }}  />                           
              
                <input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} /> 
                <Button type ='submit' onClick={this.handleImport} style={{color: "white", zIndex: 0,top:"0px"}}>Import</Button>                                          
                <FormFeedback>    
                  <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                    Please select a .xlsx file only !
                  </Fade>                                                                
                </FormFeedback>
              </InputGroup>     
          </div>
          </FormGroup>   
        </form>

        {this.state.dataLoaded && 
        <div>
          <Card body outline color="secondary" className="restrict-card">
          <DataTable heading={this.state.rows[0]} data={this.state.rows} />
              {/* <OutTable data={this.state.rows} columns={this.state.cols}  tableClassName="ExcelTable2007"/> */}
          </Card>  
        </div>}

        {this.state.duplicateLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected Requiremet already present in Database</p>
          <Card body outline color="secondary" className="restrict-card">
            <div className="lan tableRow">
              <table className='table'>
                <thead>
                  <tr>
                    <th>Requirement</th>
                    <th>Type</th>
                    <th>value</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.requirement}</td>
                      <td>{item.type}</td>
                      <td>{item.value}</td>
                    </tr>))
                  }
                </tbody>
              </table>
              </div>
          </Card>  
        </div>}
        {this.state.masterCodeLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected</p>
          <Card body outline color="secondary" className="restrict-card">
        values 
          {this.state.master_code.map((item,index)=>(<p style={{color:"red"}} key={index}>{item},</p>)) 
          }<p> not present in master code</p>
          </Card>  
        </div>}
        </Container>
        <NotificationContainer/>
      </div>
    );
  }
}

export default RequirementExcelimport
