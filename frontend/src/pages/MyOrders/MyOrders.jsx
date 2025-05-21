import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/useorders", {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  //For polling to ensure data is refreshed every 5 seconds from backend
  useEffect(() => {
    if (!token) return;

    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(intervalId);

  }, [token]);

  const noOrders = data.length === 0;

  return (
    <div className='my-orders'>
      <h2 className="my_orders">My Orders</h2>

      {loading ? (
        <div className="empty-orders-message">
          <h2>Loading...</h2>
        </div>
      ) : noOrders ? (
        <div className="empty-orders-message">
          <h2>You have no orders yet!</h2>
        </div>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <div className="order-images-container">
                {order.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={url + "/images/" + item.image}
                    alt={item.name}
                    className="order-icon"
                  />
                ))}
              </div>
              <p>{order.items.map((item, idx) => (
                idx === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              ))}</p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
              <p><span>&#x25cf;</span><b>{order.status}</b></p>
              <button onClick={() => navigate('/track-order', { state: { order } })}>
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
