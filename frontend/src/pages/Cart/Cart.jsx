import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = getTotalCartAmount();
  const deliveryFee = 5;
  const discountAmount = discountApplied ? subtotal * 0.5 : 0;
  const taxAmount = (subtotal - discountAmount) * 0.13;
  const totalAmount = subtotal - discountAmount + taxAmount + deliveryFee;


  const isCartEmpty = getTotalCartAmount() === 0;

  const handlePromoSubmit = () => {
  if (promoCode.trim().toLowerCase() === 'tumu') {
    setDiscountApplied(true);
  } else {
    alert('Invalid promo code');
    setDiscountApplied(false);
  }
};

  return (
    <div className="cart">
      <h2 className="my_cart">My Cart</h2>
      {!isCartEmpty && (
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Delete</p>
          </div>
          <br />
          <hr />
          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url + "/images/" + item.image} alt="" />
                    <p className='title'>{item.name}</p>
                    <p>${item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p className='total_price'>${item.price * cartItems[item._id]}</p>
                    <button onClick={() => removeFromCart(item._id)} className='cross'>
                      <img src={assets.delete_icon} alt="" />
                    </button>
                  </div>
                  <hr />
                </div>
                );
            }
            return null;
          })}
          <div className="cart-clear">
            <button onClick={clearCart} className="clear-cart-btn">Clear All</button>
          </div>
        </div>
      )}

      {!isCartEmpty && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <hr />
              {discountApplied && (
                <>
                  <div className="cart-total-details">
                    <p>Discount (Tumu)</p>
                    <p>-${discountAmount.toFixed(2)}</p>
                  </div>
                  <hr />
                </>
              )}
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>
              <hr />
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
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>
              <div className="cart-promocode">
                <div>
                  <p>Have a promo code? <span>Enter it here.</span></p>
                  <form
                    className="cart-promocode-input"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePromoSubmit();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                  </form>
                  {discountApplied && (
                    <p className="promo-success">Promo code <span>"Tumu"</span> applied! 50% discount granted.</p>
                  )}
                </div>
              </div>
        </div>
      )}
      {isCartEmpty && (
        <div className="empty-cart-message">
          <h2>Your cart is empty!</h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
