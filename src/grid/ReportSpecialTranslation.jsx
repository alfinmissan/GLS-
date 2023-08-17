import React,{useContext} from 'react'
import {SpecialtranslationViewContext,Specialtranslation} from '../context/Context';
import {GrFormClose} from 'react-icons/gr';

const ReportSpecialTranslation = ({prop}) => {
    const {specialTrasnaltionShow,setSpecialTranslationShow} = useContext(SpecialtranslationViewContext)
    const onClose = () => setSpecialTranslationShow(false)
  return (
    <div className='language-tranlation' style={{textAlign:"left"}}>
        <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
        <div className="card border-dark mb-3" style={{maxWidth: "20rem"}}>
        <div className="card-header">Special Translation</div>
        <div className="card-body text-dark">
        <p className="card-text">{prop}</p>
         </div>
       </div>
    </div>
  )
}

export default ReportSpecialTranslation