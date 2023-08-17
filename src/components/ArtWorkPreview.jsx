import React from 'react'
import '../css/grid.css'
import { saveAs } from 'file-saver';

const ArtWorkPreview = (props) => {
    const {preview,filename} = props
    function download(){
      const fileUrl =preview;
      fetch(fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          saveAs(blob, filename);
        })
        .catch((error) => {
          console.error('Error downloading the file:', error);
        });
    };
  return (<>

   {preview && <div className='artpreview'>
   <div className="img-container">
  <img src={preview} className="rounded  fit-image" alt="..."/>
  </div> 
   <div className=" d-btn pointer" onClick={e=>download()}>Download</div>
          </div>}
        </>)
}

export default ArtWorkPreview