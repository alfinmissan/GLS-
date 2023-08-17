import React, { useContext, useEffect, useState } from 'react'
import {SpecialtranslationViewContext,Specialtranslation} from '../context/Context';
import {GrFormClose} from 'react-icons/gr';
import { Button } from 'react-bootstrap';
const SpecialTranslations = ({prop}) => {
    const {specialTrasnaltionShow,setSpecialTranslationShow} = useContext(SpecialtranslationViewContext)
    const {specialTrasnaltion,setSpecialTranslation} = useContext(Specialtranslation)
    const onClose = () => setSpecialTranslationShow(false)
    const [sepacialRequirement,setSpecialRequirement] = useState(specialTrasnaltion)
    const [text,setText] = useState('Edit')
    const [editable,isEditable] = useState(true)
    useEffect(()=>{
      if(prop == ''){
        document.getElementById('textarea').readOnly = false 
      }else{
        document.getElementById('textarea').readOnly = true
      }
    },[])
 
    // const handleAdd = ()=>{
    //     setSpecialTranslation([...specialTrasnaltion,sepacialRequirement])
    //     setSpecialRequirement('')
    // }
  return (
   <div className='language-tranlation' style={{textAlign:"left"}}>
   <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
   <div>
   <div className="row">
   <div className="col-6">
   <textarea id='textarea' style={{width:"35vw",height:"30vh"}} value={specialTrasnaltion} onChange={e=>setSpecialTranslation(e.target.value)}>
    </textarea><br></br>
   {sepacialRequirement ==''? <button className='btn special-btn special-translation-btn' style={{color:"white"}} onClick={e=>{
    document.getElementById('textarea').readOnly = true;setSpecialRequirement(specialTrasnaltion)
    }}
    >
    Save
   </button>:<button className='btn special-btn special-translation-btn' style={{color:"white"}} onClick={e=>{  document.getElementById('textarea').readOnly = false;
    setSpecialRequirement('')}}>
    Edit
   </button>}
   </div>
   </div>
   </div>
   </div>
  )
}

export default SpecialTranslations