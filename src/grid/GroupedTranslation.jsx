import React,{useState,useContext} from 'react'
import {GroupedtranslationViewContext } from '../context/Context';
import {GrFormClose} from 'react-icons/gr';

export const GroupedTranslation = (props) => {
  const {grouped,oldGrouped} = props
  const {groupedTranslationShow,setGroupedTranslationShow} =useContext(GroupedtranslationViewContext)
  const onClose = () => setGroupedTranslationShow(false)
  return (
    <div className='language-tranlation' style={{textAlign:"left"}}>
    <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
   <div>
   {Object.keys(grouped).map((items,index)=>(<>
    {grouped[items].length > 0 && <div>
      <table className='lan-translation-table' id="id">
        <thead>
          <tr>
            <th colSpan={2} style={{textAlign:"center"}}>{items}</th>
          </tr>
        </thead>
        <tbody>
        {grouped[items].map((item,ind)=>(<tr>
             <td style={{width:"100px"}}>{item[0]}</td>
             <td>{item[1]}</td>
          </tr>))}
        </tbody>
      </table>
      </div>}
   </>))}
   </div>
   </div>
  )
}



export const GroupedTranslationDuplicated = (props) => {
  const {grouped,oldGrouped} = props
  const {groupedTranslationShow,setGroupedTranslationShow} =useContext(GroupedtranslationViewContext)
  const onClose = () => setGroupedTranslationShow(false)


  // function isValueMatchingAtIndex(key, rowIndex) {
  //   if (key in grouped && key in oldGrouped) {
  //     const value1 = grouped[key][rowIndex][0];
  //     const value2 = oldGrouped[key][rowIndex][0];
  //     return value1 === value2;
  //   }
  //   return false; // Key not found in both dictionaries
  // }
  return (
    <div className='language-tranlation' style={{textAlign:"left"}}>
    <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
   <div>
   {Object.keys(grouped).map((items,index)=>(<>
    {grouped[items].length > 0 && <div>
      <table className='lan-translation-table' id="id">
        <thead>
          <tr>
            <th colSpan={2} style={{textAlign:"center"}}>{items}</th>
          </tr>
        </thead>
        <tbody>
        {grouped[items].map((item,ind)=>(<tr >
             <td style={{width:"100px"}}>{item[0]}</td>
             <td>{item[1]}</td>
          </tr>))}
        </tbody>
      </table>
      </div>}
   </>))}
   </div>
   </div>
  )
}

export default GroupedTranslation