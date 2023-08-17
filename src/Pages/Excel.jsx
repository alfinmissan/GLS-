import React, { Component } from 'react';
import '../App.css';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { InputGroup, FormGroup, Button, Fade, FormFeedback, Container, Card,Col } from 'reactstrap';
import axios from 'axios';
import MainNavbar from '../Pages/mainNavbar';
import {Token,Url} from '../context/ApiVariables';
import DataTable from '../components/DataTable';
export class Excelimport extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      file:null,
      rows: null,
      duplicates:null,
      duplicateLoaded:false,
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
      // just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if(err){
          console.log(err);            
        }
        else{
          console.log(resp.cols)
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
    const url = Url+'excel/import';
    const formData = new FormData();
    formData.append('files',this.state.file)
    formData.delete('_method');
    const config = {
        headers: {
            'Authorization':Token,
            'content-type': 'multipart/form-data'
        }
    }
    axios.post(url, formData,config).then(res=>{
      if(res.status==200){
        this.setState({
          dataLoaded: false,
          duplicateLoaded:true,
          duplicates: res.data,
        })    
        // console.log(res.data)  
      }else if(res.status==204){
        window.location.replace('/language')
      }
    }) 
  
  }

  render() {
    return (
      <div style={{"marginTop":"13vh"}} className='import'>
        <MainNavbar prop='Import Language'/>
        <div className="container import-input">
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
        <div >
          <p style={{color:"red"}}>Import Rejected Languages aleady present in Database</p>
          <Card body outline color="secondary" className="restrict-card">
            <div className='lan tableRow'>
              <table className='table' border="1">
                <thead>
                  <tr>
                    <th>code</th>
                    <th>name</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                    </tr>))
                  }
                </tbody>
              </table>
              </div>
          </Card>  
        </div>}
        </Container>
        </div>
        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
       <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
        </div>
        </div>
       </footer>
    
     </div>

    );
  }
}

//importing excel 
export class MasterCodeImport extends Component {
  constructor(props){
    super(props);
    this.state={
      isOpen: false,
      dataLoaded: false,
      isFormInvalid: false,
      file:null,
      rows: null,
      duplicates:null,
      duplicateLoaded:false,
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
    const url = Url+'mastercode/import';
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
      if(res.status==200){
        this.setState({
          dataLoaded: false,
          duplicateLoaded:true,
          duplicates: res.data,
        })    
        // console.log(res.data)  
      }else if(res.status==204){
        window.location.replace('/mastercode')
      }
    }) 
   
  
  }

  render() {
    return (
      <div style={{"marginTop":"13vh"}}>
        <MainNavbar prop='Import MasterCode'/>
       
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
          <p style={{color:"red"}}>Import Rejected Master Code already present in Database</p>
          <Card body outline color="secondary" className="restrict-card">
            <div className='lan tableRow'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>text</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.id}</td>
                      <td>{item.text}</td>
                    </tr>))
                  }
                </tbody>
              </table>
              </div>
          </Card>  
        </div>}
        </Container>

        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
       <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
        </div>
        </div>
      </footer>

      </div>
      
    );
  }
}

