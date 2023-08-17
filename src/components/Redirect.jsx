import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Redirect = () => {
    const {status,varient} = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        let userGroup = window.localStorage.getItem("userGroup")
        if(userGroup === 'Admin'){
            if(status === 'Certified'){
                navigate(`/certified/${varient}`)
            }else{
                navigate(`/admin/grid/${varient}`)
            }
        }else{
            if(status ==='Certified'){
                 navigate(`/reports`)
            }else{
                if(userGroup==='Graphics Team'){
                  navigate(`/grph/tasklist/grid/${status}/${varient}`)
                }else{
                  navigate(`/tasklist/grid/${varient}`)
                }
            }
        }
    })
  return (
    <div>
test
    </div>
  )
}

export default Redirect