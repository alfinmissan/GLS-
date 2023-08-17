import React, { useEffect, useState } from 'react';
import {  slide as Menu } from 'react-burger-menu';
import '../css/sideBar.css'
import {Link } from 'react-router-dom'; 

export default props => {
  const [group,setGroup] = useState('')
    const List = {
        '':[],
      Admin:[
        {label:'HOME',link:"/"},
        {label:'LANGUAGES',link:"/language"},
        {label:'MASTER CODES',link:"/mastercode"},
        {label:'COUNTRIES',link:"/country"},
        {label:'REQUIREMENTS',link:"/requirements"},
        {label:'BLENDS',link:"/blends"},
        {label:'LEGAL NAME',link:"/legalname"},
        {label:'FACTORY',link:"/factory"},
        {label:'ASSETS',link:"/asset"},
        {label:'REPORTS',link:"/reports"},
        {label:'USER MANAGEMENT',link:"/usermanagement"},
        {label:'GRID MANAGEMENT',link:"/gridmanagement"},
        {label:'CUSTOM CONDITION',link:"/customcondition"},
        {label:'ADMIN',link:"/admin"},
        {label:'TASK LIST',link:"/task"},
        {label:'ITEM NUMBER',link:"/itemno"},
        {label:'STATISTICS',link:"/statistics"}
      ],
      Viewer:[
        {label:'HOME',link:"/"},
        {label:'REPORTS',link:"/reports"},
      ],
      "UK Sales":[
        {label:'HOME',link:"/"},
        {label:'REPORTS',link:"/reports"},
        {label:'TASK LIST',link:"/task"},
      ],
      "Language Approver":[
        {label:'HOME',link:"/"},
        {label:'REPORTS',link:"/reports"},
        {label:'TASK LIST',link:"/task"},
      ],
      "Graphics Team":[
        {label:'HOME',link:"/"},
        {label:'REPORTS',link:"/reports"},
        {label:'TASK LIST',link:"/task"},
      ],
      "Editor":[
        {label:'HOME',link:"/"},
        {label:'REPORTS',link:"/reports"},
        {label:'TASK LIST',link:"/task"},
      ]

    }
    useEffect(()=>{
      if(window.localStorage.getItem('userGroup')==null){
        setGroup('')
      }else{
        setGroup(window.localStorage.getItem('userGroup'))
      }
      })
     
    
  return (
    <Menu>
       <div style={{marginTop:"30px",fontFamily:"futura"}}>
      {
        List[group].map((item,index)=>(<Link to={item.link}><div className='sidebar-items'><h6>{item.label}</h6></div></Link>))
      }
      </div>
    </Menu>
  );
};