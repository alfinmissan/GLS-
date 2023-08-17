import React, { useEffect,useRef } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ExportReportDataTable } from '../components/DataTable';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Url,Token } from '../context/ApiVariables';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';

const ExportReport = (props) => {
    const reportTemplateRef = useRef(null);
    const {show,setShow,values} = props
    const [jsonData,setJsonData] = useState([])
    const row = ["Item No","Varient Code","Product","Status","User","User Group","Date"]
    function removeKeysFromJson(jsonData, keysToRemove) {
        return JSON.parse(JSON.stringify(jsonData, (key, value) => {
          if (keysToRemove.includes(key)) {
            return undefined; // Remove the key from the JSON object
          }
          return value; // Keep the key-value pair in the JSON object
        }));
      }

      function DateConvert(string){
        
        let date = new Date(string)
        let month = date.getMonth() + 1    // 11
        let dt =  date.getDate()      // 29
        let year =  date.getFullYear()
  
        return(dt +'-'+month+'-'+year)
       //  return date
     
     }
      useEffect(()=>{
      let dat = removeKeysFromJson(values,["_id"])
      const convertedJsonData = dat.map(obj => {
        const dateString = obj.date.$date;
        obj.date = DateConvert(dateString);
        return obj;
      });
      setJsonData(convertedJsonData)
      },[])
  function download(val) {
  axios.defaults.headers.common['Authorization'] = Token
  axios({
      method: 'post',
      url: Url+'get/report',
      data:{
         data:values
      }
    }).then((res)=>{
        handleConvertToPdf(res.data.file)
    })

}
const handleConvertToPdf = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const data = new Uint8Array(response.data);

  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const head = [[sheetData[0][1], sheetData[0][2], sheetData[0][3], sheetData[0][4], sheetData[0][5], sheetData[0][6], sheetData[0][7]]]; // include first column header
  const body = sheetData.slice(1).map((row) => [row[1],row[2], row[3], row[4], row[5], row[6], row[7]]); // include only first column data

  const doc = new jsPDF();

  doc.autoTable({
    head: head,
    body: body,
  });

  const headingDoc = new jsPDF();
  const headingText = 'My Heading';
  headingDoc.setFontSize(18);
  headingDoc.text(headingText, 20, 20);

  // Merge the heading PDF with the generated PDF
  doc.internal.events.subscribe('postProcess', () => {
    doc.addPage();
    doc.setPage(doc.internal.pages.length);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    doc.addPage(headingDoc.output('array', 'blob'));
  });

  doc.save('Report.pdf');
};

  return (
    <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
    <Modal.Header closeButton style={{textAlign:"center",background:"#eeee",fontFamily:"futura",fontSize:"14px",fontWeight:"600"}}>
      <Modal.Title>EXPORT REPORT</Modal.Title> 
    </Modal.Header>
    <Modal.Body>
      <div className="w-100" style={{textAlign:"left",paddingLeft:"50px",paddingBottom:"5px",}}>
      <button style={{color:"white"}} className="btn special-btn" onClick={e=>download()}>Export PDF</button>
      </div>
      <div ref={reportTemplateRef} style={{padding:"20px",textAlign:"centers"}}>
      <div className='w-100' style={{textAlign:"center"}}><h4 style={{fontFamily:"futura"}}>REPORT</h4></div>
      <ExportReportDataTable heading={row} data={jsonData}/>
      </div>
    </Modal.Body>
  </Modal>
  )
}

export default ExportReport