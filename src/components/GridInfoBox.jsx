import React, { useContext } from 'react'
import { GridInfoBoxContext } from '../context/Context'

const GridInfoBox = () => {
    const {gridinformation,setGridInformation} = useContext(GridInfoBoxContext)
  return (<div className='grid-info-box'>
             <span className="input-group-text">Grid Information</span>
               <div className="input-group">
                 <textarea className="form-control" value={gridinformation} aria-label="With textarea"
                    onChange={e=>setGridInformation(e.target.value)}
                 >
               </textarea>
             </div>
          </div>)
    
}

export const GridInfoBoxView =({prop})=>{
    return(<div className='grid-info-box'>
            <span className="input-group-text">Grid Information</span>
              <div className="input-group">
                <textarea id='textarea' onInput='this.style.height = "";this.style.height = this.scrollHeight + "px"' className="form-control" value={prop} aria-label="With textarea" readOnly/>
            </div>
          </div>)
}
export default GridInfoBox