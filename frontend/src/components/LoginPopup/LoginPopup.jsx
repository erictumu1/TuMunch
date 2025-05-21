import axios from "axios"
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import './LoginPopup.css'


const LoginPopup = ({setShowLogin}) => {

    const { url, setToken, setUserName } = useContext(StoreContext);

    const [currState,setCurrState] = useState("Login")
    const [loading, setLoading] = useState(false);
    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data=>({...data,[name]:value}))
    }

const onLogin = async (event) => {
  event.preventDefault();
  setLoading(true);

  const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

  try {
    const response = await axios.post(url + endpoint, data);

  if (response.data.success) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userName", response.data.name);
    setToken(response.data.token);
    setUserName(response.data.name);

    toast.success(`Welcome, ${response.data.name}!`, {
    style: {
      background: 'white',
      color: 'green',
    },
    });

    setShowLogin(false);
  } else {
    toast.error(response.data.message,{
      style: {
            background: 'white',
            color: 'red',
          },
    });
  }
  } catch (error) {
      console.error("Login/Register error:", error);
      toast.error("Something went wrong. Please try again.", {
        style: {
            background: 'white',
            color: 'red',
          },
      }); 
  }
 finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'; 
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className='login-popup-container'>
            <img src={assets.logo} className="login-img" alt="" />
            <div className="login-popup-title">
                <h2>
                    {currState}
                </h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
            {currState === "Login" ? null : (
              <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
            )}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>
           <button type='submit' disabled={loading}>
                {loading ? (
                  <span className="spinner"></span> 
                ) : (
                  currState === "Sign up" ? "Create account" : "Login"
                )}
          </button>
          {currState === "Sign up" && (
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
          )}
          
          {currState === "Login"
            ? <p>Create a new account? <span onClick={() => setCurrState("Sign up")}>Click here</span></p>
            : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
          }
        </form>
    </div>
  )
}

export default LoginPopup