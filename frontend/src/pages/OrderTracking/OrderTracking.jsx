import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './OrderTracking.css';

const steps = [
  'Order placed',
  'Food processing',
  'Out for delivery',
  'Delivered',
];

const statusToStepIndex = {
  'Order placed': 0,
  'Food processing': 1,
  'Out for delivery': 2,
  'Delivered': 3,
};

const stepImages = {
  'Order placed': assets.order_placed,
  'Food processing': assets.food_processing,
  'Out for delivery': assets.out_for_delivery,
  'Delivered': assets.delivered,
};

const OrderTracking = () => {
  const { url, token } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrder = location.state?.order;

  const [order, setOrder] = useState(initialOrder);

      useEffect(() => {
        if (!initialOrder) {
          navigate('/myorders');
          return;
        }
      
        let intervalId;
      
        const fetchUserOrdersAndFindMatch = async () => {
          try {
            const response = await axios.post(
              url + "/api/order/useorders",
              {},
              { headers: { token } }
            );
          
            const allOrders = response.data.data;
            const matchingOrder = allOrders.find(o => o._id === initialOrder._id);
          
            if (matchingOrder) {
              setOrder(matchingOrder);
            } else {
              console.warn('Order not found in user orders');
            }
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
      
        if (token && initialOrder?._id) {
          fetchUserOrdersAndFindMatch();
          intervalId = setInterval(fetchUserOrdersAndFindMatch, 5000);
        }
        return () => clearInterval(intervalId);
      
      }, [initialOrder, token, url, navigate]);

  if (!order) return null;

  const currentStep = statusToStepIndex[order.status] ?? 1;

  const aggregatedItems = order.items.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ name: item.name, quantity: item.quantity });
    }
    return acc;
  }, []);

  return (
    <div className="order-tracking-container">
      <h2>Tracking Order</h2>

      <div className="order-items-list">
        <h3>Items in your order:</h3>
        {aggregatedItems.length > 0 ? (
          <ul>
            {aggregatedItems.map((item, idx) => (
              <li key={idx}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>

      <div className="steps-vertical">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isNextCompleted = index < currentStep;
          const isCurrentStep = index === currentStep;
          const isNextStep = index === currentStep + 1;

          return (
            <div key={step} className="step-wrapper">
              <div className={`step-item ${isCompleted ? 'completed' : ''}`}>
                <img
                  src={stepImages[step]}
                  alt={step}
                  className={`step-image 
                    ${isCompleted ? 'completed' : ''} 
                    ${isCurrentStep ? 'current' : ''} 
                    ${isNextStep ? 'blinking-border' : ''}`}
                />
                <p>{step}</p>
              </div>
                {index < steps.length - 1 && (
                  <div
                    className={`step-line ${
                      isNextCompleted ? 'completed' : (index === currentStep ? 'next-blinking' : '')
                    }`}
                  />
                )}
            </div>
          );
        })}
      </div>

      {order.status === 'Delivered' && (
        <div className="delivered-message">
          <h3>Thank you for your order, and Enjoy!!!</h3>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
