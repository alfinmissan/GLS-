import React, { Component } from 'react';
import '../App.css';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { InputGroup, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import axios from 'axios';
import MainNavbar from './mainNavbar';
import {Token,Url} from '../context/ApiVariables';
import DataTable from '../components/DataTable';

class LegalNameExcelimport extends Component {
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
    const url =Url+ 'importexport/legalname';
    const formData = new FormData();
    formData.append('files',this.state.file)
    formData.append('language',sessionStorage.getItem("language"))
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
      }else if(res.status==204){
        // window.location.replace('/legalname')
      }
    })
  
  }
  

  render() {
    return (
      <div style={{"marginTop":"13vh"}}>
        <MainNavbar prop='Import Legal Name'/>
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
          <p style={{color:"red"}}>Import Rejected Legal </p>
          <Card body outline color="secondary" className="restrict-card">
            <p>Legal Names already exist</p>
              {/* <table>
                <thead>
                  <tr>
                    <th>translation_ID</th>
                    <th>text</th>
                    <th>translation</th>
                  </tr>
                </thead>
                <tbody>
                   {this.state.duplicates.map((item,index)=>(<tr key={index} style={{color:"red"}}>
                      <td>{item.translation_ID}</td>
                      <td>{item.text}</td>
                      <td>{item.translation}</td>
                    </tr>))
                  }
                </tbody>
              </table> */}
          </Card>  
        </div>}
        {this.state.masterCodeLoaded && 
        <div>
          <p style={{color:"red"}}>Import Rejected</p>
          <Card body outline color="secondary" className="restrict-card">

          {this.state.master_code.map((item,index)=>(<p style={{color:"red"}} key={index}>{index+1}:{item['LEGAL NAME']}</p>)) 
          }<p>Master Code values missing for translations</p>
          </Card>  
        </div>}
        </Container>
      </div>
    );
  }
}

export default LegalNameExcelimport;