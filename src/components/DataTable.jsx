import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

export const DataTable = ({ heading, data }) => {
  const [result,setResult] = useState(false)
//   useEffect(()=>{
//  const mappedList =  data.map(item => {
//   if (item === undefined) {
//     return undefined;
//   }
//   return item.toUpperCase();
// }).map(item => (item === undefined ? '' : item));
// setResult(mappedList)
//   },[data])

  return (
    <div className='lan  tableRow'>
    <table className='table'>
      <thead>
        <tr>
          {heading.map((title, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
       {data.map((row, rowIndex) => (<>
        { rowIndex !== 0 &&
          <tr key={rowIndex}>
            {heading.map((title, index) => (
            <td key={index}>{row[index]}</td>
          ))}
          </tr>
        }</> ))}
      </tbody>
    </table>
    </div>
  );
};




export const ExportReportDataTable = ({ heading, data }) => {
return (
  <div className='lan  tableRow' style={{width:"100%",height:"100%"}}>
  <table className='table'>
    <thead>
      <tr>
        {heading.map((title, index) => (
          <th key={index}>{title}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
         <td>{row.item}</td>
         <td>{row.varient}</td>
         <td>{row.Description}</td>
         <td>{row.status}</td>
         <td>{row.user}</td>
         <td>{row.user_group}</td>
         <td>{row.date}</td>
        </tr>
        ))}
    </tbody>
  </table>
  </div>
);
};

export default DataTable;