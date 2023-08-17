import React, { useState ,useEffect} from 'react'
import { Button, Form } from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import axios from 'axios';
import { Url,Token } from '../context/ApiVariables';
import Select from "react-select"
import $, { error } from 'jquery'
const TranslationVersionChange = (props) => {
    axios.defaults.headers.common['Authorization'] =Token
    const [data,setData] = useState([])
    const [asset,setAsset] = useState([])
    const [img,setImg] = useState([])
    const [image,setImage] = useState(false)
    const {language,trans_id,editshow,setEditShow,handleEditValues} = props
    const [selected,setSelect] = useState({
                                version:true,
                                typin:false,
                                asset:false
                                            })
    const [trans,setTrans] = useState(trans_id)
    const [text,setText] = useState('')
    const handleClose = () =>setEditShow(false)

    function isValidURL(string) {
      if(Number(string)){
        res=null
      }else{
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
      }   
    }
    const handleSelect = (e) => {
        setSelect({
           version: false,
           typin: false,
           asset: false
                  });
        setSelect(prevState => ({
                 ...prevState,
                  [e.target.name]: true
                  }));
        if(e.target.name == 'version'){
            setTrans(trans_id)
        }else if(e.target.name =='asset'){
            setTrans(image)
        }else if(e.target.name == 'typin'){
            if(!isValidURL(trans_id))
            setTrans(trans_id)
        }
    }
    $("input:checkbox").on('click', function() {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
          // the name of the box is retrieved using the .attr() method
          // as it is assumed and expected to be immutable
          var group = "input:checkbox[name='" + $box.attr("name") + "']";
          // the checked state of the group/box on the other hand will change
          // and the current value is retrieved using .prop() method
          $(group).prop("checked", false);
          $box.prop("checked", true);
        } else {
          $box.prop("checked", false);
        }
      });
    
    useEffect(()=>{
        if(isValidURL(trans_id)){
             setSelect({
               version: false,
               typin: false,
               asset: false
                  });
             setSelect(prevState => ({
                 ...prevState,
                  asset: !prevState.asset
                  }));
                  setImage(trans_id)
        }else if(trans_id==''){
              setSelect({
               version: false,
               typin: false,
               asset: false
                  });
            setSelect(prevState => ({
                 ...prevState,
                  typin: !prevState.typin
                  }));
        }
        axios({
            method: 'get',
            url: Url+'trans/version',
            params:{
                language:language,
                trans_id:trans_id
            },
          }).then((res)=>(
            setData(res.data[0]['translation'][0])
          )).catch(error=>{

          })
       fetchassets()
       },[])

 const handleSubmit= ()=>{
    setEditShow(false)
    handleEditValues(trans,text)
 }
 const handleSetTrans =(e,txt)=>{
    setText(txt)
    let cleanString = trans_id.replace(/\[.*?\]/g, '');
    setTrans(cleanString+'['+e+']')
 }


 function fetchassets(){
 axios.get(Url+'req/dropdown',{
            'headers':{
              'Authorization': Token
            }
            }).then((res)=>{
                setAsset(res.data.asset)
            }).catch(error=>{

            })
 }
 function handleSelectAsset(data){
    setImg(data)
  axios({
        method: 'get',
       url: Url+`/url/ast/${data.value}/`,   
    }).then(res=>{
      setTrans(res.data.photo)
      setImage(res.data.photo)
      // console.log(res.data)
    })
 }
  return (
    <div>
  <Modal  show={editshow} onHide={handleClose} >
    <Modal.Header closeButton style={{fontFamily:"futura",background:"#eeee"}}>
        <Modal.Title>EDIT TRANSLATIONS</Modal.Title>
    </Modal.Header>
    <Modal.Body >
    <div className="row" style={{background:"#708090",height:"40px",paddingTop:"10px",color:"white"}}>
        <div className="col">
            <div className="form-check">
               <input className="form-check-input" type="radio" name="version" id="flexRadioDefault1" onChange={e=>handleSelect(e)} checked={selected.version}/>
               <label className="form-check-label" for="flexRadioDefault1">Select Version</label>
            </div>
        </div>
        <div className="col">
            <div className="form-check">
               <input className="form-check-input" type="radio" name="typin" id="flexRadioDefault2" onChange={e=>handleSelect(e)} checked={selected.typin}/>
               <label className="form-check-label" for="flexRadioDefault2">Type in</label>
           </div>
        </div>
        <div className="col">
            <div className="form-check">
               <input className="form-check-input" type="radio" name="asset" id="flexRadioDefault2" onChange={e=>handleSelect(e)} checked={selected.asset}/>
               <label className="form-check-label" for="flexRadioDefault2">Add asset</label>
           </div>
        </div>
    </div>
    <div style={{marginTop:"20px"}}>
        {selected.version?
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <th></th>
                    <th>Version</th>
                    <th>Translation</th>
                </tr>
            </thead>
            <tbody>
                {data&&data.map((item,ind)=>(<tr key={ind}>
                    <td><input className="form-check-input" name='check' type="checkbox" value="" id="flexCheckDefault" onClick={e=>handleSetTrans(item.version,item.trans)}/></td>
                    <td>{item.version}</td>
                    <td>{item.trans}</td>
                                         </tr>))}
            </tbody>
        </table>:selected.typin? <>
                    <input type="text" className="form-control" placeholder="enter value" onChange={e=>setTrans(e.target.value)} value={trans} aria-label="Username" aria-describedby="addon-wrapping"/>
                </>:<>
                
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Asset</Form.Label>
			   <div className="dropdown-container">
                <Select
                    options={asset}
                    placeholder="Select value"
                    value={img}
                    onChange={handleSelectAsset}
                    isSearchable={true}
                />
				</div>
            </Form.Group>
           { image &&
              <div style={{textAlign:"center", width:"10vw",height:"12vh"}}>
             <img style={{backgroundColor:"#e6e3e3",border:"1px solid #4f4d4d",marginTop:"4px"}} alt='asset' src={image} height="80px" width="80px"/>
            </div>
            }
    
                   </>}
    
    </div>
      </Modal.Body>
      <Modal.Footer>
     <Button onClick={handleSubmit}>Update</Button>
      </Modal.Footer>
  </Modal>
  </div>)
}

export default TranslationVersionChange