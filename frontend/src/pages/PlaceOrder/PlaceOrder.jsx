import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './PlaceOrder.css'

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",  
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };  // avoid mutating original item
        orderItems.push(itemInfo);
      }
    }
  );

    let orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
      deliveryFee: deliveryFee,
      taxAmount: taxAmount,
      discountAmount: localStorage.getItem("discountApplied") ? (localStorage.getItem("getdiscount") * 1) : 0
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        const { session_url } = response.data;
        localStorage.removeItem("discountApplied");
        console.log("Redirecting to Stripe:", session_url);
        window.location.replace(session_url);
      } else {
        alert("Error");
      }
    } catch (error) {
      alert("An error occurred while placing the order.");
      console.error(error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  const totalbefore = getTotalCartAmount();
  const subtotal = localStorage.getItem("discountApplied") ? (getTotalCartAmount() - localStorage.getItem("getdiscount")) : getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 5;
  const taxAmount = subtotal * 0.13;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${totalbefore.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className={`${localStorage.getItem("discountApplied") ? "" : "discountapplied"}`}>
            <div className={`cart-total-details`}>
              <p>Discount(<span className='tumu-discount'>Tumu</span>)</p>
              <p>-${(localStorage.getItem("getdiscount") * 1).toFixed(2)}</p>
            </div>
            <hr />
            </div>
            <div className="cart-total-details">
              <p>Tax (13%)</p>
              <p>${taxAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder