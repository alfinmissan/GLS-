import React from "react";
import MainNavbar from "../Pages/mainNavbar";
import GridView from "./Grid";

function GridPage({item}){
    return(<div>
        <MainNavbar prop='GRID'/>
        <div className="grid">
           <GridView/>
        </div>
    </div>)
}

export default GridPage;