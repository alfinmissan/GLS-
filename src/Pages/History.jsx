import React,{useEffect, useState} from 'react'
import axios from 'axios'
import {Token,Url} from '../context/ApiVariables';
const History = ({prop}) =>{
   const data = prop
   function DateConvert(string){
        
    let date = new Date(string)
    let month = date.getMonth() + 1    // 11
    let dt =  date.getDate()      // 29
    let year =  date.getFullYear()

    return(dt +'-'+month+'-'+year)
   //  return date
 
 }
    return(
        <div>
            {data.map((item,index)=>(
            <div className="row list" style={{borderBottom:"1px solid #e6dbbe"}} key={index}>
                <div className="col" style={{ textAlign: "left", wordWrap: "break-word", wordBreak: "break-word" }}>
                                {item.user + "  " + item.action}
                </div>
                <div className="col-4" style={{textAlign:"right"}}>
                {DateConvert(item.date.$date)}
                </div>
            </div>
            ))}
        </div>
    )
}
export const LanguageHistory = () => {
    const [history,setHistory] = useState([])
    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = Token
        axios({
          method: 'get',
          url: Url+'inputModule/log',
          params: {
              module:"language"
          }
      }).then(res=>(
            // console.log(res.data)
            setHistory(res.data)
          ))
    },[])
  return (
    <div>
         {history ? <History prop={history}/>:<></>}
    </div>
  )
}


export const TranslationHistory = () => {
  const [history,setHistory] = useState([])
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"translation"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}


export const MastercodeHistory = () => {
  const [history,setHistory] = useState()
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"mastercode"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}

export const RequirementHistory = () => {
  const [history,setHistory] = useState()
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"requirement"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}


export const CountryHistory = () =>{
  const [history,setHistory] = useState()
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"country"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}

export const FactoryHistory = () =>{
  const [history,setHistory] = useState()
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"factory"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}

export const AssetHistory = () =>{
  const [history,setHistory] = useState()
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"asset"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history ? <History prop={history}/>:<></>}
  </div>
)
}

export const BlendHistory = () =>{
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"blend"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}

export const ItemNoHistory = () =>{
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"itemNo"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}

export const LegalNameHistory = () =>{
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'inputModule/log',
        params: {
            module:"legalname"
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}

export const RegNoHistory = (props) =>{
  const {itemno} = props
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'inputModule/reg/log',
        params: {
            module:"registrationNo",
            item:itemno
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}




export const GridHistory = ({prop}) =>{
  const [history,setHistory] = useState(false)
  function DateConvert(string){
        
    let date = new Date(string)
    let month = date.getMonth() + 1  // 11
    let dt =  date.getDate()      // 29
    let year =  date.getFullYear()

    return(dt +'-'+month+'-'+year)
   //  return date
 
 }
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'get',
        url: Url+'grid/history',
        params: {
            varient:prop
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history &&  <div>
            {history.map((item,index)=>(
            
            <div className="row list" style={{borderBottom:"1px solid #e6dbbe",height:"45px"}} key={index}>
            <div className="col" style={{textAlign:"left"}}>
         {item.user +"  "+ item.action +" "} 
            </div>
            <div className="col-3" style={{textAlign:"right"}}>
            {DateConvert(item.date.$date)}
            </div>
        </div>
            ))}
        </div>}
  </div>
)
}

export const ItemNoReqHistory = (props) =>{
  const {itemno} = props
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'inputModule/reg/log',
        params: {
            module:"Item_requirement",
            item:itemno
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}
export const BlenReqNoHistory = (props) =>{
  const {blend} = props
  const [history,setHistory] = useState(false)
  useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = Token
      axios({
        method: 'post',
        url: Url+'inputModule/blend/log',
        params: {
            module:"blend_requirement",
            blend:blend
        }
    }).then(res=>(
          // console.log(res.data)
          setHistory(res.data)
        ))
  },[])
return (
  <div>
       {history && <History prop={history}/>}
  </div>
)
}