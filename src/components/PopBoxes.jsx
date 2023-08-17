import React, { useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdDoneOutline} from "react-icons/md";
import { ImCross} from "react-icons/im";
import { FcCandleSticks } from 'react-icons/fc';
import { Form } from 'react-bootstrap'
import ArtWorkPreview from './ArtWorkPreview';
import { useNavigate } from 'react-router-dom';

export const ConfirmGirdSubmission= (props) => {
    const {smShow,setSmShow,checkSalesReport} = props
    const onclick = ()=>{
        checkSalesReport()
    }
  return (
    <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton className='pop-up-header'>
          <Modal.Title id="example-modal-sizes-title-sm">
           Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Are sure want to sumbit grid ?</h6>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={e=>setSmShow(false)}>No</Button>
            <Button onClick={onclick}>Yes</Button>
        </Modal.Footer>
      </Modal>
  )
}

export const SalesReportConfirmation = (props) =>{
    const {slShow, setSlShow, setTopRightModal,setEmShow} = props;
    const onclick = ()=>{
        setTopRightModal(true)
        setSlShow(false)
    }
    const handleClose = ()=>{
       setEmShow(true)
       setSlShow(false)
    }
    return(
        <Modal
        size="sm"
        show={slShow}
        onHide={() => setSlShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton className='pop-up-header'>
          <Modal.Title id="example-modal-sizes-title-sm">
           Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Attach sales report and Click submit again</h6>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={e=>handleClose()}>Cancel</Button>
            <Button onClick={onclick}>Yes</Button>
        </Modal.Footer>
      </Modal>
    )

}

export const ConfirmTaskCompleted= (props) => {
  const {smShow,setSmShow, setEmShow} = props
  const onclick = ()=>{
    setEmShow(true)
    setSmShow(false)
  }
return (
  <Modal
      size="sm"
      show={smShow}
      onHide={() => setSmShow(false)}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton className='pop-up-header'>
        <Modal.Title id="example-modal-sizes-title-sm">
         Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Are sure want to sumbit grid ?</h6>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={e=>setSmShow(false)}>No</Button>
          <Button onClick={onclick}>Yes</Button>
      </Modal.Footer>
    </Modal>
)
}

export const ConfirmDesignStatus = (props) => {
  const {smShow,setSmShow, setEmShow,status} = props
  const onclick = ()=>{
    setEmShow(true)
    setSmShow(false)
  }
return (
  <Modal
      size="sm"
      show={smShow}
      onHide={() => setSmShow(false)}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton className='pop-up-header'>
        <Modal.Title id="example-modal-sizes-title-sm">
         Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Are you sure want to {status == 'Acknowledged'?<>Acknowledge</>:"submit"} grid ?</h6>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={e=>setSmShow(false)}>No</Button>
          <Button onClick={onclick}>Yes</Button>
      </Modal.Footer>
    </Modal>
)
}




export const ConfirmDelete = (props) => {
  const {smShow,setSmShow, handleSubmit} = props
  const onclick = ()=>{
    handleSubmit()
    setSmShow(false)
  }
return (
  <Modal
      size="sm"
      show={smShow}
      onHide={() => setSmShow(false)}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton className='pop-up-header'>
        <Modal.Title id="example-modal-sizes-title-sm">
        Delete Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Are you sure want to Delete ?</h6>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={e=>setSmShow(false)}>No</Button>
          <Button onClick={onclick} style={{background:"red"}}>Yes</Button>
      </Modal.Footer>
    </Modal>
)
}


export const ConfirmPublish = (props) => {
  const {slShow,setSlShow, setEmShow2 ,status} = props
  const onclick = ()=>{
    setEmShow2(true) 
    setSlShow(false)
  }
return (
  <Modal
      size="sm"
      show={slShow}
      onHide={() => setSlShow(false)}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton className='pop-up-header'>
        <Modal.Title id="example-modal-sizes-title-sm">
       Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Are you sure want to {status=='Certified' ? <>certify grid</>:<>publish grid</>} ?</h6>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={e=>setSlShow(false)}>No</Button>
          <Button onClick={onclick} style={{background:"red"}}>Yes</Button>
      </Modal.Footer>
    </Modal>
)
}


export const SuccessMessage= (props) => {
  const {ssShow,setSsShow,message} = props
  useEffect(()=>{
     setTimeout(function() { setSsShow(false)}, 5000)
  },[ssShow])
return (
 <Modal
    size="md-down"
    show={ssShow}
    onHide={() => setSsShow(false)}
    aria-labelledby="example-modal-sizes-title-sm"
    style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
  >
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
      {message.type =='error' ?<>
      <ImCross size={30} fill="red" />
          <h4 style={{color:"red"}}>ERROR</h4>
      <h6 style={{color:"black"}}>{message.message}</h6>
    </>:<>
      <MdDoneOutline size={30} fill="green" />
             <h4 >SUCCESS</h4>
      <h6 style={{color:"black"}}>{message.message}</h6>
    </>}
  
  </Modal.Body>
</Modal>
)
}




export const ValueCheckWarning= (props) => {
  const {vcShow,setVcShow,message} = props
  useEffect(()=>{
     setTimeout(function() { setVcShow(false)}, 5000)
  },[vcShow])
return (
 <Modal
  size="sm"
  show={vcShow}
  onHide={() => setVcShow(false)}
  aria-labelledby="example-modal-sizes-title-sm"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
  
      <h6 style={{color:"black"}}>{message}</h6>
   
  </Modal.Body>
</Modal>
)
}

export const EmailMessage= (props) => {
  const {emShow,setEmShow,email,setEmail,handleSubmit} = props
 const  handleClose = () =>{
    setEmail("")
    setEmShow(false)
    handleSubmit()
  }
  const onclick = () =>{
   setEmShow(false)
   handleSubmit()
  }

return (
 <Modal
  size="md-down"
  show={emShow}
  onHide={() => setEmShow(false)}
  aria-labelledby="example-modal-sizes-title-sm"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
   <Modal.Header>
     <Modal.Title>
      Add message to email
     </Modal.Title>
  </Modal.Header>
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Message</Form.Label>
        <Form.Control value={email} as="textarea" rows={3} onChange={e=>setEmail(e.target.value)}/>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
          <Button onClick={e=>handleClose()}>Cancel</Button>
          <Button onClick={e=>onclick()} style={{background:"red"}}>Add</Button>
      </Modal.Footer>
</Modal>
)
}

export const EmailMessage2= (props) => {
  const {emShow,setEmShow,email,setEmail,handleSubmit} = props
 const  handleClose = () =>{
    setEmail("")
    setEmShow(false)
    handleSubmit()
  }
  const onclick = () =>{
   setEmShow(false)
   handleSubmit()
  }

return (
 <Modal
  size="md-down"
  show={emShow}
  onHide={() => setEmShow(false)}
  aria-labelledby="example-modal-sizes-title-sm"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
   <Modal.Header>
     <Modal.Title>
      Add message to email
     </Modal.Title>
  </Modal.Header>
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Message</Form.Label>
        <Form.Control value={email} as="textarea" rows={3} onChange={e=>setEmail(e.target.value)}/>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
          <Button onClick={e=>handleClose()}>Cancel</Button>
          <Button onClick={e=>onclick()} style={{background:"red"}}>Add</Button>
      </Modal.Footer>
</Modal>
)
}

export const EmailMessage3= (props) => {
  const {emShow2,setEmShow2,email,setEmail,handlePublish} = props
 const  handleClose = () =>{
    setEmail("")
    setEmShow2(false)
    handlePublish()
  }
  const onclick = () =>{
   setEmShow2(false)
   handlePublish()
  }

return (
 <Modal
  size="md-down"
  show={emShow2}
  onHide={() => setEmShow2(false)}
  aria-labelledby="example-modal-sizes-title-sm"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
   <Modal.Header>
     <Modal.Title>
      Add message to email
     </Modal.Title>
  </Modal.Header>
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Message</Form.Label>
        <Form.Control value={email} as="textarea" rows={3} onChange={e=>setEmail(e.target.value)}/>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
          <Button onClick={e=>handleClose()}>Cancel</Button>
          <Button onClick={e=>onclick()} style={{background:"red"}}>Add</Button>
      </Modal.Footer>
</Modal>
)
}


export const ArtWorkPreviewPopup= (props) => {
  const {showartpreview,setShowartpreview, preview,filename} = props
 
return (
 <Modal
  size="lg"
  show={showartpreview}
  onHide={() => setShowartpreview(false)}
  aria-labelledby="example-modal-sizes-title-lg"
  scrollable
>
  <Modal.Body style={{width:"100%",height:"100%"}}>
  
  <ArtWorkPreview preview={preview} filename={filename}/>
   
  </Modal.Body>
</Modal>
)
}


export const SuccessMessageLogin= (props) => {
  const {ssShow,setSsShow,message,Navigate} = props
  useEffect(()=>{
     setTimeout(function() { 
      setSsShow(false)
      Navigate()
      }, 3000)
  },[ssShow])
return (
 <Modal
    size="md-down"
    show={ssShow}
    onHide={() => setSsShow(false)}
    aria-labelledby="example-modal-sizes-title-sm"
    style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
  >
  <Modal.Body className="sucess-message" style={{ textAlign: "center", fontFamily: "futura", color: "green",paddingTop:"30px",paddingBottom:"30px"}}>
      {message.type =='error' ?<>
      <ImCross size={30} fill="red" />
          <h4 style={{color:"red"}}>ERROR</h4>
      <h6 style={{color:"black"}}>{message.message}</h6>
    </>:<>
      <MdDoneOutline size={30} fill="green" />
             <h4 >SUCCESS</h4>
      <h6 style={{color:"black"}}>{message.message}</h6>
    </>}
  
  </Modal.Body>
</Modal>
)
}



export default ConfirmGirdSubmission