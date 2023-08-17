import React, { useState } from 'react'
import Footer from '../components/Footer'
import MainNavbar from '../Pages/mainNavbar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TeabagForm from '../components/TeabagForm';
import Weight from '../components/Weight';
import Fonts from '../components/Fonts';
import NoOfTeabag from '../components/NoOfTeabag';
import AssetType from '../components/AssetType';

const Admin = () => {
    const [active,setActive] = useState({
        teabag:true,
        weight:false,
        no_teabag:false,
        fonts:false

    })
    const handleChange =(event)=>{
        setActive({
            teabag:false,
            weight:false,
            no_teabag:false,
            fonts:false,
            asset:false
          })
          setActive({[event]:true})
    }
  return (
    <div>
        <MainNavbar prop='DATA  ACCESS'/>
        <div className='admin container-fluid'>
        <div className="container admin-box"> 
        <div className="row heading-box pointer">
        <div className={`col heading" ${active.teabag && 'active'}`}  onClick={e=>handleChange('teabag')}>Teabag Form</div>
        <div className={`col heading" ${active.weight && 'active'}`} onClick={e=>handleChange('weight')}> Weight</div>
        <div className={`col heading" ${active.no_teabag && 'active'}`} onClick={e=>handleChange('no_teabag')}>No of Teabags</div>
        <div className={`col heading" ${active.asset && 'active'}`} onClick={e=>handleChange('asset')}>Asset Type</div>
        <div className={`col heading" ${active.fonts && 'active'}`} onClick={e=>handleChange('fonts')}>Fonts</div>
        </div>
        </div>

       <div className="container extra-element-box">
            {active.teabag && <TeabagForm/>} 
             {active.weight && <Weight/> }  
             {active.no_teabag && <NoOfTeabag/>}
             {active.asset && <AssetType/>}
             {active.fonts && <Fonts/>}
       </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Admin