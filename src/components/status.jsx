import React from 'react'
import { propTypes } from 'react-mui-multiselect-dropdown'

const Status= ({prop}) => {
  return (
    <div>
        <div style={{position: "fixed",
            top:"50%",
            bottom:" 500px",

            left:"40%",

            Zindex: "10000",

            fontSize:"50px",
            fontFamily:"futura",

            color:"green",

            transform:"rotate(-30deg)",
            opacity:"0.2"}}>
  {prop}
</div>

    </div>
  )
}

export default Status