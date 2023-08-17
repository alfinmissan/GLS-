import React,{useContext, useEffect, useRef, useState} from 'react'
// import {data,groupedTrans,lanTrans } from './testdata.js'
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { isAsset } from '../IsValueModified';
import {GridExportContext,} from '../context/Context'
import Modal from 'react-bootstrap/Modal';
import { isValuePresent } from '../IsValueModified';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import nato1 from '../fonts/NotoSans-Regular.ttf'
import nato2 from '../fonts/NotoSerif-Regular.ttf'
import nato3 from '../fonts/NotoSerif_SemiCondensed-Regular.ttf'
const GridExportComponent = ({prop}) =>{
  const {showGridExport,setShowGridExport} = useContext(GridExportContext)
  const {data,languages,languagetrans,grouped,grid,exportdict} = prop
  const [links,setLinks] = useState([])
  // useEffect(()=>{
  //   let lnik = isAsset(data)
  //   setLinks(lnik)
  //   console.log(links)
  // },[data])
  // useEffect(() => {
  //   // Assuming 'data' is obtained from a pop-in or any other source
  //   const values = data; // Replace [...] with the actual data array

  //   const validLinks = isasset(values);
  //   console.log(validLinks); // You can do whatever you want with the valid links here
  // }, []);

  // function isasset(values) {
  //   const validLinks = [];

  //   values.map((item, index) => {
  //     if (isValidURL(item)) {
  //       validLinks.push(item);
  //     }
  //   });
  //   console.log(validLinks)
  //   return validLinks;
  // }

  // function isValidURL(string) {
  //   if (Number(string)) {
  //     return null;
  //   } else {
  //     var res = string.match(
  //       /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  //     );
  //     return res !== null;
  //   }
  // }
   
  return(<div className='exportgrid'>
    <Modal show={showGridExport} fullscreen={showGridExport} onHide={() => setShowGridExport(false)} scrollable>
       <div style={{ overflowX: 'scroll' }}>
        <Modal.Header closeButton style={{position:"absolute",width:"100%",background:"white",zIndex:"999"}}>
          {/* <Modal.Title >Modal</Modal.Title> */}
        </Modal.Header>
        <Modal.Body className='export-grid-body'>
         
             <GridExport prop={{data,languages,grid,exportdict}}/>
             <GridArtWork prop={{grouped,languages,languagetrans,grid,exportdict,links}}/>
        
        </Modal.Body>
          </div>
      </Modal>
  </div>)
}




const GridExport = ({prop}) => {
const reportTemplateRef = useRef(null);
const {data,languages,grid,exportdict} = prop
const [wid,setWidth] = useState({})
  useEffect(()=>{
    if(languages.length > 20){
      setWidth({width:"100%"})
    }
  })

// function for check passed value is valid url
    function isValidURL(string) {
        if(Number(string)){
          res=null
        }else{
          var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
          return (res !== null)
        }   
      }

      const handleGeneratePdf = () => {
        const contentElement = reportTemplateRef.current;
        const contentHeight = contentElement.offsetHeight;
        const doc = new jsPDF({
          orientation: 'l', // landscape
          unit: 'pt', // points, pixels won't work properly
          format: [2180,5120] // set needed dimensions for any element
    });

          
        // Adding the fonts.
        doc.setFont('Inter-Regular', 'normal');
        doc.setFontSize(16)
        doc.internal.write(0, "Tw")
        doc.html(reportTemplateRef.current, {
          async callback(doc) {
            await doc.save(`${grid.varient}-${grid.Description}`);
          },
        });
      };

  return (
    <div style={{margin:"10px",marginTop:"30px",padding:"10px"}}>
    <div  ref={reportTemplateRef}>
        <div className='export-grid' style={{ maxWidth: '100vw'}}>
        <h3 style={{textAlign:"center" ,fontFamily:"futura",marginBottom:"20px"}}>{grid.Description}</h3>  
        <div className="w-100" style={{textAlign:"center",wordSpacing:"4px",fontFamily:"futura",marginBottom:"10px",paddingLeft:"20px"}}>
          <div className="row" style={{textAlign:"center"}}>
            <div className="col-4" style={{textAlign:"left"}}>
              <div className="row"><div className="col">JOB NO</div><div className="col">:{grid.job}</div></div>
              <div className="row"><div className="col">ITEM NO</div><div className="col">:{grid.item}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>VARIENT CODE</div><div className="col">:{grid.varient}</div></div>
            </div>

            <div className="col-5" style={{textAlign:"left"}}>
              <div className="row"><div className="col">FACTORY</div><div className="col">:{grid.factory.label}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>CREATED BY</div><div className="col">:{grid.user}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>CREATED DATE</div><div className="col">:{grid.date}</div></div>
            </div>
          </div>
        </div>
  { data && <table  id="id" className='export-table' >
    <thead ><tr>
    {
      languages.map((item,index)=>(<th key={index}>{
        item  == 'heading' ? '' : item
            }</th>))
        }
    </tr>
    </thead>
    <tbody>
    {
    data.map((element,index)=>(<tr key={index}>
      {element.map((item,ind)=>(<>{
        grid.duplicated ?
        <td key={ind} style={ind ==0?{textAlign:"left"}:ind !== 0 && item !='' && isValuePresent(grid.oldGrid,data,index,ind)?{color:"white",background:"#C202E8FF",width:"60px"}:ind !== 0 && item !=''?{width:"60px"}: ind !== 0 && item !==false ?{width:"60px",backgroundColor:"rgba(51,102,255,255)"}:ind !== 0?{backgroundColor:"red"}:{}}>
      {ind == 0 ? item: data[index][ind] === false ?<div style={{backgroundColor:"red"}}></div>: isValidURL(data[index][ind])?
      <img src={data[index][ind]} alt='asset' height="40px" width="50px"/>:<div>
        {data[index][ind]} </div>
       }
      </td>
    
       :
     <td key={ind} style={ind ==0?{textAlign:"left"}:ind !== 0 && item !='' ? {width:"60px"}:ind !== 0 && item !==false ?{width:"60px",backgroundColor:"rgba(51,102,255,255)"}:ind !== 0?{backgroundColor:"red"}:{}}>
      {ind == 0 ? item: data[index][ind] === false ?<div style={{backgroundColor:"red"}}></div>: isValidURL(data[index][ind])?
      <img src={data[index][ind]} alt='asset' height="40px" width="50px"/>:<div>
        {data[index][ind]} </div>
       }
      </td>} </>))}
      </tr>))
    }
    </tbody>
</table>}
<div className='grid-info-box  export-info'>
  <span className="input-group-text">Grid Information</span>
    <div className="input-group" style={{whiteSpace:"pre-line"}}>
      {exportdict.gridinformation}
    </div>
 </div>

</div>
    </div>
    <div className="w-100" style={{textAlign:"center"}}> <button className='btn export-grid-btn' onClick={handleGeneratePdf}>Export Grid</button></div>
    </div>
  )
}


const GridArtWork = ({prop})=>{
 console.log("test",prop)
  const reportTemplateRef = useRef(null);
  const {grouped,languages,languagetrans,grid,exportdict,links} = prop

const handleGeneratePdf = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [1200, 1500]
  });

  doc.setFont('helvetica');
  doc.setFontSize(12);

  doc.internal.write(0, 'Tw');

  doc.html(reportTemplateRef.current, {
    async callback(doc) {
      await doc.save(`${grid.varient}-${grid.Description}`);
    },
  });
};


const handleConvertToPDF = () => {
  const content = reportTemplateRef.current;
  const options = {
    filename: 'converted.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { 
      unit: 'pt', 
      format: 'a3', 
      orientation: 'l', 
      margin: { top: "10px", right: "10px", bottom: "10px", left: "10px" },
      font: "helvetica", // Set the font to Helvetica
      html2canvas: {
        allowTaint: true,
        useCORS: true
      }
    },
  };

  html2pdf().set(options).from(content).save(`${grid.varient}-${grid.Description}`);
};



// const handleConvertToPDF = async () => {
//   const content = reportTemplateRef.current;

//   // Create a new PDF document
//   const pdfDoc = await PDFDocument.create();

//   // Set the font to Helvetica
//   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   // Create a new page
//   const page = pdfDoc.addPage();

//   // Set the text content on the page
//   const { width, height } = page.getSize();
//   const textContent = {
//     text: content.innerText, // Extract the plain text from the HTML content
//     font: helveticaFont,
//     size: 12,
//     x: 50,
//     y: height - 50,
//     maxWidth: width - 100,
//     maxHeight: height - 100,
//     lineHeight: 15,
//     wordBreak: 'break-word',
//   };
//   page.drawText(textContent);

//   // Generate the final PDF as a binary array
//   const pdfBytes = await pdfDoc.save("file");

//   // Create a blob from the PDF data
//   const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

//   // Download the PDF
//   const downloadLink = document.createElement('a');
//   downloadLink.href = URL.createObjectURL(pdfBlob);
//   downloadLink.download = 'converted.pdf';
//   downloadLink.click();
// };

// Invoke the function to generate the PDF
// handleConvertToPDF();


  return(<div style={{border:"1px solid red",width:"100%",margin:"10px",padding:"10px"}}>
     <div  ref={reportTemplateRef}>
     <div className='export-grid'>
        <h3 style={{textAlign:"center" ,marginBottom:"20px",fontFamily:"futura"}}>{grid.Description}</h3>  
        <div className="w-100" style={{textAlign:"center",wordSpacing:"4px",fontFamily:"futura",fontSize:"12px"}}>
          <div className="row">
            <div className="col-4" style={{textAlign:"left"}}>
              <div className="row"><div className="col">JOB NO</div><div className="col">:{grid.job}</div></div>
              <div className="row"><div className="col">ITEM NO</div><div className="col">:{grid.item}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>VARIENT CODE</div><div className="col">:{grid.varient}</div></div>
            </div>

            <div className="col-4" style={{textAlign:"left"}}>
              <div className="row"><div className="col">FACTORY</div><div className="col">:{grid.factory.label}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>CREATED BY</div><div className="col">:{grid.user}</div></div>
              <div className="row"><div className="col" style={{wordSpacing:"10px"}}>CREATED DATE</div><div className="col">:{grid.date}</div></div>
            </div>
            <div className="col-4"  style={{textAlign:"center"}}>
                <h6>E-mail: info@ahmadtea.com, www.ahmadtea.com</h6>
                 <h6>© AHMAD TEA LTD 2023</h6>
          </div>
          </div>
        </div>

       <div className="row" style={{marginTop:"50px",wordSpacing:"4px"}}>
        <div className="col">
      {languages.map((item, index) => (
  <div key={index}>
    {item !== '' && languagetrans[index - 1] && (
      <div style={languagetrans[index - 1].length > 0 ? { maxWidth: "auto", border: "1px solid black", margin: "10px" } : {}}>
       {languagetrans[index - 1].map((el, ind) => {
  if (el && el.length > 0) {
    return (
      <div key={ind}>
        <div style={{ display: "flex", flexDirection: "row", margin: "0", padding: "0", height: "auto" }}>
          <div style={{ width: "8rem", margin: "0", padding: "0", color: "red" }}>
            <p>({el[0]})</p>
          </div>
          <div style={{ margin: "0", padding: "0" }}>
            <p>{el[1]}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
})}

      </div>
    )}
  </div>
))}


            
       
        </div>
        <div className="col">
        {Object.keys(grouped).map((items,index)=>(<>
    {grouped[items].length > 0 && <div>
      <table className='ex-lan-translation-table'  id="id" style={{"marginBottom":"20px"}}>
        <thead>
          <tr>
            <th colSpan={2} style={{textAlign:"center",color:"red"}}>{items}</th>
          </tr>
        </thead>
        <tbody>
        {grouped[items].map((item,ind)=>(<tr>
             <td style={{width:"100px",color:"red",wordSpacing:"10px"}}>{item[0]}</td>
             <td style={{ wordBreak: "break-all" , overflowWrap: "break-word",padding:"3px"}}>{item[1]}</td>
          </tr>))}
        </tbody>
      </table>
      </div>}
   </>))}
           
{/* <div className='grid-info-box export-info1'>
  <span className="input-group-text">Assets</span>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
    {links.map((item, index) => (
      <img src={item} alt='asset' height="40px" width="50px" style={{ margin: '5px' }} />
    ))}
  </div>   
</div> */}


 <div className='grid-info-box export-info1'>
  <span className="input-group-text">Special Translations</span>
    <div className="input-group" style={{whiteSpace:"pre-line"}}>
      {exportdict.additionalrequirement}
    </div>
 </div>

           
       </div>
       </div>

        </div>
        </div>
        <div className="w-100" style={{textAlign:"center"}}><button className='btn export-grid-btn' onClick={e=> handleConvertToPDF()}>Export Language</button></div>
        </div>)
}
export default GridExportComponent;

