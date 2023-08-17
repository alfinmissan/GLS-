import  {GraphPage,  Diagram, PieComponent } from "../Pages/GraphComponents"
import MainNavbar from "../Pages/mainNavbar"

export function Statistics(){

    return(<div className="stat">
   <MainNavbar prop='STATISTICS'/>
   <div className="container charts">
   <div className="w-100">
    <div className="row" >
        <div className="col">
        <PieComponent/>
        </div>
        <div className="col">
        <Diagram/>
        </div>
    </div>
   </div>
<div className="row">
<GraphPage/>
</div>
   </div>
   {/* <footer style={{backgroundColor: "#f5faf5", position: "fixed", bottom: 0,width:"100vw",overlay:"true"}}>
        <div className='row'>
        <div className='col-3'>
        </div>
        <div className='col-6'>
        <b><i>Graphics Language System</i></b>
        </div>
        <div className='col-3'>
      
        </div>
        </div>
</footer> */}
          </div>)
}