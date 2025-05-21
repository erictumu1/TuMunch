import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../../context/StoreContext';
import './Verify.css';


const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();
    

    const verifyPayment = async () => {
      try {
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        if (response.data.success) {
          toast.success("Payment verified successfully!", {
            style: {
              background: 'white',
              color: 'green',
            },
          });
          navigate("/myorders");
        } else {
          toast.error("Payment verification failed.", {
            style: {
              background: 'white',
              color: 'red',
            },
          });
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred while verifying payment.", {
          style: {
            background: 'white',
            color: 'red',
          },
        });
        navigate("/");
      }
    };

    useEffect(() => {
        verifyPayment();
    },[])

  return (
    <div className='verify' >
        <div className="spinner">
            
        </div>
    </div>
  )
}

export default Verify