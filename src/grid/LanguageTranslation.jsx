import React, { useContext } from 'react'
import {translationViewContext } from '../context/Context';
import {GrFormClose} from 'react-icons/gr';
import { CheckPresent, isValuePresent } from '../IsValueModified';

export const LanguageTranslation = (props) => {
    const {languages,languagetrans} = props
    const {translationShow,setTranslationShow} = useContext(translationViewContext)
    const onClose = () => setTranslationShow(false)
  return (
    
    <div className='language-tranlation'>
        <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
        {languages.map((item,index)=>(<div key={index}>
            {item !== '' && <div>
                                 <h5 style={{textAlign:"left",margin:"10px"}}>{item}</h5> 
                       <table className='lan-translation-table'>
                        <thead>
                        <tr>
                            <th>Translation Id</th>
                            <th>Translation</th>
                        </tr>
                        </thead>
                       <tbody>
						  {Array.isArray(languagetrans[index - 1]) &&
							languagetrans[index - 1].map((el, ind) => {
							  if (el && el.length > 0) {
								return (
								  <tr key={ind}>
									<td style={{ width: "30%" }}>{el[0]}</td>
									<td style={{ width: "70%" }}>{el[1]}</td>
								  </tr>
								);
							  } else {
								return null;
							  }
							})}
						</tbody>

                      </table>
                        </div>}
        </div>   
        ))}
    </div>
  )
}

export const LanguageTranslationDuplicated = (props) => {
  const {languages,languagetrans,oldLanTrans} = props
  const {translationShow,setTranslationShow} = useContext(translationViewContext)
  const onClose = () => setTranslationShow(false)
return (
  
  <div className='language-tranlation'>
      <div onClick={onClose} className='close-btn'><GrFormClose size={50} color='#1d4934'/></div>
      {languages.map((item, index) => (
  <div key={index}>
    {item !== '' && languagetrans[index - 1] && languagetrans[index - 1].length > 0 && (
      <div>
        <h5 style={{ textAlign: "left", margin: "10px" }}>{item}</h5>
        <table className='lan-translation-table'>
          <thead>
            <tr>
              <th>Translation Id</th>
              <th>Translation</th>
            </tr>
          </thead>
          <tbody>
            {languagetrans[index - 1].map((el, ind) => (
              <tr style={CheckPresent(oldLanTrans, languagetrans, index - 1, ind) ? { color: "red" } : {}} key={ind}>
                <td style={{ width: "10rem" }}>{el[0]}</td>
                <td style={{ width: "20em" }}>{el[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
))}

  </div>
)
}

export default LanguageTranslation