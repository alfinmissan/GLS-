import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainNavbar from '../Pages/mainNavbar'
import { Url,Token } from '../context/ApiVariables'
import axios from 'axios'
import {FaEdit} from 'react-icons/fa';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {Form} from 'react-bootstrap'
import {Modal}from 'react-bootstrap';
import {Button} from 'reactstrap';
import Select from "react-select"
import {RiFileHistoryFill} from 'react-icons/ri';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { ItemNoHistory } from '../Pages/History'
import { SuccessMessage } from '../components/PopBoxes'
import DeleteButton from '../components/DeleteButton'

export const ItemNoModule = () => {
    axios.defaults.headers.common['Authorization'] = Token
    const [data,setData] = useState([])
    const [id,setId] = useState([])
    const [row,setRow] = useState(false)
    const [show,setShow] = useState(false)
    const [modshow,setModShow] = useState(false)
    const [category,setCategory] = useState()
    const [message,setMessage] = useState('')
    const [ssShow,setSsShow] = useState(false)
    const [teabag,setTeabag] = useState()
    const [dropdown,setDropDown] = useState([])
    const [dropdownTeabag,setDropDownTeabag] = useState([])
    const [dropdownWeight,setDropDownWeight] = useState([])
    const [showhistory, setShowhistory] = useState(false);
    const historyShow = () => setShowhistory(true);
    const historyClose = () =>setShowhistory(false)
    const [excelData, setExcelData] = React.useState(null);
    const [searchKey,setSearchKey] = useState('')
    const [key,setKey] = useState('')
    const [count,setCount] = useState(0)

    useEffect(()=>{
        axios({
          method: 'get',
          url: Url+'itemNo',
        }).then(res=>{   
          setData(res.data)
        })
        axios.get(Url+'grid/dropdown',{
          'headers':{
            'Authorization': Token
          }
          }).then((res)=>{
            setDropDown(res.data)
          })
    },[id,modshow,show,count]) 

useEffect(()=>{
        axios.get(Url+'grid/dropdown',{
          'headers':{
            'Authorization': Token
          }
          }).then((res)=>{
            setDropDownTeabag(res.data.no_of_teabag)
          })
    },[])


    const handleCheck = (e) => {
 
        // Destructuring
        const { value, checked } = e.target;
        const obj  = id;
          
        console.log(`${value} is ${checked}`);
      
        // Case 1 : The user checks the box
        if (checked) {
          setId([...obj, value]);
        }
      
        // Case 2  : The user unchecks the box
        else {
          setId(obj.filter((e) => e !== value))
        }
          };
    const handleDelete =()=>{
        if (window.confirm('Are you sure you want to delete selected items?')) {
            axios.defaults.headers.common['Authorization'] = Token
            axios({
              method: 'delete',
              url: Url+'itemNo',
              data: {
                  id:id
              }
          }).then(res=>{
            setMessage({
              type:"success",
              message:res.data.message
            })
            setSsShow(true)
            setId('')
          }
          )
              
              // window.location.reload()
           
          } else {
            //do nothing
          }
    }

    const handleModify = (item) =>{
        setRow(item);
        if(item.category==='loose tea'){
            setCategory({
                label:"Loose Tea",value:"loose tea"
            })
        }else{
            setCategory({
                label:"Tea Bag",value:"teabag"
            })
        }
        dropdownTeabag.map(element=>{
          if(element.value==item.noTeabag){
            setTeabag(element)
          }
        })
        setModShow(true)
        
    }
    function download(val) {
        axios.get(Url+'importexport/itemNo',{
          'headers':{
            'Authorization': Token
          }
          }).then((res)=>{
            if(val=='pdf'){
              handleConvertToPdf(res.data.file)
            }else if(val=='excel'){
               window.location.href = res.data.file;
            }
          })
      
      }

      const handleConvertToPdf = async (url) => {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
      
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      
        // sheetData = sheetData.map((row) => {
        //   return row.filter((_, index) => index !== 0 && index !== 1 && index !== 2);
        // });
      
        setExcelData(sheetData);
        const head = [[sheetData[0][1],sheetData[0][2],sheetData[0][3],sheetData[0][4]]]; // include first column header
        const body = sheetData.slice(1).map((row) => [row[1],row[2],row[3],row[4]]); // include only first column data
      
        const doc = new jsPDF();
    
        doc.autoTable({
          head: head ,
          body: body,
        });
        doc.save('Item Number.pdf');
      };
  useEffect(()=>{
      searchData()
    },[searchKey])
    
      const searchData = ()=>{
        let copy = [...data]
        if(searchKey == null || searchKey == undefined || searchKey ==''){
          setData([...copy])
          setCount(count+1)
      }else {
        const pattern = new RegExp(`^${searchKey}\\w+`,"i")
        let filtered = copy.filter(obj=>{
          return pattern.test(obj[key])
        })
      setData([...filtered])
        }
        }

  return (
    <div className='hd'>
      <DeleteButton module="itemNo" param=""/>
        <MainNavbar prop="ITEM NUMBER"/>
        <NotificationContainer/>
         <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
        <div style={{"marginTop":"15vh","marginBottom":"10px",position:"fixed"}} className='container-fluid'>
            <div className="container">
                <div className="w3-show-inline-block" style={{float:"left"}}>
                    <div className="w3-bar">
                        <button className="w3-btn hd-btns" onClick={e=>setShow(true)}>ADD </button>
                        <button className="w3-btn hd-btns" onClick={e=>handleDelete()}>DELETE </button>
                    </div>
                </div>
                <div className="w3-show-inline-block" style={{float:"right"}}>
                    <div className="w3-bar">
                        <Link to='/item/number/import' ><button className="w3-btn hd-btns">IMPORT</button></Link>
                            <select className='w3-btn  hd-btns select-format' name="subject" id="subject"  onChange={e=>{download(e.target.value)}}>
                                <option value="" >EXPORT</option>
                                <option value="pdf" >EXPORT PDF</option>
                                <option value="excel" >EXPORT EXCEL</option>
                            </select>
                      </div>
                </div>
            </div>
            <div  className='container lan'>
                <div  className='container lan tableRow' style={{marginTop:"30px"}}>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>
                                    <span>Item No </span><br></br>
                                    <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("item")}} placeholder='search'/>
                                </th>
                                {/* <th>
                                    <span>Product</span><br></br>
                                    <input type='text' style={{width:"100%"}} className='input' onInput={e=>{setSearchKey(e.target.value);setKey("product")}} placeholder='search'/>
                                </th>  */}
                                <th>Category</th>
                                {/* <th>Weight</th> */}
                                <th>Number of Teabag</th>
                                <th>Blend Name</th>
                                <th>Registration No</th>
                                <th>Requirements</th>
                                <th>MODIFY</th>
                            </tr>
                        </thead>
                        <tbody>
                           {data.map((item,index)=>(<tr key={index}>
                            <td><input type='checkbox' onClick={handleCheck} value={item._id.$oid} name='check'/></td>
                            <td>{item.item}</td>
                           
                            <td>{item.category}</td>
                         
                            <td>{item.noTeabag}</td>
                            <td> {item.blend_name.map(el=>(<tr>
                                {el.label},
                                </tr>))}</td>
                            <td className='view'><Link to={`/reg/number/${item.item}`}>View</Link></td>
                            <td className='view'><Link to={`/itemno/requirement/${item.item}`}>View</Link></td>
                            <td style={{textAlign:"center"}} className='pointer'><i onClick={e=>handleModify(item)}><FaEdit size={30}/></i></td>
                           </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddItemNo show={show} setShow={setShow}/>
            {row &&<ModifyItemNo modshow={modshow} setModShow={setModShow} item={row} cat={category} teabag={teabag}/>}
        </div>
        <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
            <div className='row'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <b><i>Graphics Language System</i></b>
                </div>
                <div className='col-3'>
                    <b style={{color:"#08265aee",cursor: "pointer"}} onClick={e=>setShowhistory(true)}><RiFileHistoryFill size={20}/>History</b>
                 </div>
            </div>
       </footer>

       <Modal show={showhistory} onHide={historyClose} dialogClassName='custom-dialog-history' scrollable>
          <Modal.Header closeButton>
              <Modal.Title>HISTORY</Modal.Title>
          </Modal.Header>
        <Modal.Body>
       <ItemNoHistory/>
      </Modal.Body>
    </Modal>
    </div>
  )
}

const AddItemNo =(props)=>{
    const {show,setShow} = props
    const [itemNo,setItemNo] = useState()
    const [blend,setBlendName] = useState()
    const [category,setCategory] = useState('')
    const [teabag,setTeabag] = useState()
    const [message,setMessage] = useState({})
    const [ssShow,setSsShow] = useState(false)
    const [dropdown,setDropDown] = useState([])
    const [blendDropdown,setBlendDropdown] = useState([])
    const [catDropdown,setCatDropdown] = useState([{
                                            label:"Loose Tea",value:"loose tea"
                                                     },{
                                            label:"Tea Bag",value:"teabag"
                                                       }])
    const [error,setError] = useState({})
    const handleSelectCategory = (e) =>setCategory(e)
    const handleSelectBlend =(e) =>setBlendName(e)
    const handleSelectTeabag =(e) =>{
      if(e.value==="loose tea"){
        setTeabag({label:"",value:""})
      }
      setTeabag(e)}
    const handleClose = () =>setShow(false)
    const handleAdd = (event)=>{
        let category_val = ''
        let we = ''
        let noTeabag = ''
        if (category&& category.value) {
          category_val = category.value;
        }
        if (teabag&& teabag.value) {
          noTeabag = teabag.value;
        }
        axios({
            method: 'post',
            url: Url+'itemNo',
            data:{
              item:itemNo,
              blend_name:blend,
              category:category_val,
              noTeabag:noTeabag,
            },
          }).then(res=>{
            setMessage({
              type:"success",
              message:res.data.message
            })
            setSsShow(true)
            setBlendName([])
            setItemNo('')
            setCategory('')
            setTeabag('')
            setError({})
            setTimeout(()=>{setShow(false)},5000)
          }).catch(error=>{
            setError(error.response.data)
          }) 
        }

    useEffect(()=>{
        axios.get(Url+'grid/dropdown',{
          'headers':{
            'Authorization': Token
          }
          }).then((res)=>{
            let black_tea = res.data.blend_name_black
            let green_tea = res.data.blend_name_green
            let blends = black_tea.concat(green_tea)
            setBlendDropdown(blends)
            setDropDown(res.data)
          })
      },[])
    return(<Modal show={show} onHide={handleClose} scrollable>
             <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <Modal.Header closeButton>
                    <Modal.Title>ADD ITEM NUMBER</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Item Number</Form.Label>
                            <Form.Control type='text' autoComplete='off' style={{width:'100%'}} onChange={e=>setItemNo(e.target.value)}/>
                            {Object.keys(error).includes("item")?<label className='error'>*{error.item[0]}</label>:<></>}
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Blend Name</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                    options={blendDropdown}
                                    placeholder="Select blend"
                                    value={blend}
                                    onChange={handleSelectBlend}
                                    isSearchable={true}
                                    isMulti
                                 />
                                {Object.keys(error).includes("blend_name")?<label className='error'>*{error.blend_name[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Category</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                    options={catDropdown}
                                    placeholder="Select category"
                                    value={category}
                                    onChange={handleSelectCategory}
                                    isSearchable={true}
                                    // isMulti
                                 />
                                {Object.keys(error).includes("category")?<label className='error'>*{error.category[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                        {category.value == 'teabag' &&
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">     
                                    <Form.Label>Number of Teabag</Form.Label>
                                      <div className="col-sm-8">
                                      <Select
                                      options={dropdown.no_of_teabag}
                                      placeholder="Number of teabag"
                                      value={teabag}
                                      onChange={handleSelectTeabag}
                                      isSearchable={true}
                                      // isMulti
                                      /> 
                              </div>

                            </Form.Group>
                              }
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" type='button' onClick={handleAdd}>Add</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
           </Modal>)
}





const ModifyItemNo =(props)=>{
    const {modshow,setModShow,item,cat,teabag} = props
    const [itemNo,setItemNo] = useState(item.item)
    const [blend,setBlendName] = useState(item.blend_name)
    const [category,setCategory] = useState(cat)
    const [blendDropdown,setBlendDropdown] = useState([])
    const [message,setMessage] = useState({})
    const [ssShow,setSsShow] = useState(false)
    const [tea_bag,setTeabag] = useState(teabag)
    const [dropdown,setDropDown] = useState([])
    const [catDropdown,setCatDropdown] = useState([{
                                            label:"Loose Tea",value:"loose tea"
                                                     },{
                                            label:"Tea Bag",value:"teabag"
                                                       }])
    const [error,setError] = useState({})
    const handleSelectCategory = (e) =>{
      if(e.value==="loose tea"){
        setTeabag({label:"",value:""})
      }
      setCategory(e)
      }
    const handleSelectBlend =(e) =>setBlendName(e)
    const handleSelectTeabag =(e) =>setTeabag(e)
    const handleClose = () => setModShow(false)

    const handleModify = () =>{
      let noTeabag = ''
      let we = ''
       if (tea_bag&& tea_bag.value) {
          noTeabag = tea_bag.value;
        }
  
        axios({
            method: 'put',
            url: Url+'itemNo',
            data:{
              id:item._id.$oid,
              item:itemNo,
              blend_name:blend,
              category:category.value,
              noTeabag:noTeabag
            },
          }).then(res=>{
          setMessage({
              type:"success",
              messsage:res.data.message
            })
            setSsShow(true)
          }).catch(error=>{
            setError(error.response.data)
          }) 
        }
    useEffect(()=>{
        axios.get(Url+'grid/dropdown',{
          'headers':{
            'Authorization': Token
          }
          }).then((res)=>{
            let black_tea = res.data.blend_name_black
            let green_tea = res.data.blend_name_green
            let blends = black_tea.concat(green_tea)
            setBlendDropdown(blends)
            setDropDown(res.data)
          })
      },[])
    return(<Modal show={modshow} onHide={handleClose} scrollable>
       <SuccessMessage ssShow={ssShow} setSsShow={setSsShow} message={message}/>
                <Modal.Header closeButton>
                    <Modal.Title>MODIFY ITEM NUMBER</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleModify}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Item Number</Form.Label>
                            <Form.Control type='text' value={itemNo} autoComplete='off' style={{width:'100%'}} onChange={e=>setItemNo(e.target.value)}/>
                            {Object.keys(error).includes("item")?<label className='error'>*{error.item[0]}</label>:<></>}
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Blend Name</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                        options={blendDropdown}
                                        placeholder="Select blends"
                                        value={blend}
                                        onChange={handleSelectBlend}
                                        isSearchable={true}
                                        isMulti
                                />
                                {Object.keys(error).includes("blend_name")?<label className='error'>*{error.blend_name[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Category</Form.Label>
                            <div className="dropdown-container">
                                <Select color="green"
                                    options={catDropdown}
                                    placeholder="Select category"
                                    value={category}
                                    onChange={handleSelectCategory}
                                    isSearchable={true}
                                    // isMulti
                                 />
                                {Object.keys(error).includes("category")?<label className='error'>*{error.category[0]}</label>:<></>}
                            </div>
                        </Form.Group>
                        {category.value == 'teabag' &&
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">     
                                    <Form.Label>Number of Teabag</Form.Label>
                                      <div className="col-sm-8">
                                      <Select
                                      options={dropdown.no_of_teabag}
                                      placeholder="Number of teabag"
                                      value={tea_bag}
                                      onChange={handleSelectTeabag}
                                      isSearchable={true}
                                      // isMulti
                                      /> 
                              </div>

                            </Form.Group>
                              }  
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={handleModify}>Modify</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>)
}


export default ItemNoModule