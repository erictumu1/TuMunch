import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import './LoginPopup.css'

const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState] = useState("Login")
    
      // Disables scrolling when the login page is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scrolling
    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when the popup is closed
    };
  }, []);

  return (
    <div className='login-popup'>
        <form className='login-popup-container'>
            <img src={assets.logo} className="login-img" alt="" />
            <div className="login-popup-title">
                <h2>
                    {currState}
                </h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==="login"?<></>:<input type="text" placeholder="Your name" required/>}
                <input type="email" placeholder='Your email' required />
                <input type="password" placeholder='Password' required />
            </div>
            <button>{currState==="Sign up"?"Create account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {currState==="Login"
            ?<p>Create a new account? <span onClick={()=>setCurrState("Sign up")}>Click here</span></p>
            :
            <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }

        </form>
    </div>
  )
}

export default LoginPopup