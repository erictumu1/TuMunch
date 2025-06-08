import { useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

const FoodItem = ({id, name, price, description, image}) => {
  const { cartItems, addToCart, removeFromCart, url, token } = useContext(StoreContext);

  const isLoggedIn = !!token;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.warn("Sign in to add items to cart.", {
        toastId: 'login-required-add',
        style: {
          background: 'white',
          color: 'red',
        },
      });
      return;
    }
  
    addToCart(id);
    toast.success("Item added to cart!", {
      toastId: 'add-to-cart',
    });
  };

  const handleRemoveFromCart = () => {
    if (!isLoggedIn) {
      toast.warn("Please login first to remove items from your cart.", {
        toastId: 'login-required-remove'
      });
      return;
    }
  
    removeFromCart(id);
    toast.info("Item removed from cart.", {
      toastId: 'remove-from-cart',
    });
  };

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        {
          !cartItems[id] ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              {/* <img src={assets.shopping_icon} className='shopping-icon'/> */} Add to Cart
            </button>
        ) : (
            <div className="food-item-counter">
              <button className='decrease-btn'>
                <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="Remove" />
              </button>
              <p>{cartItems[id]}</p>
              <button className='increase-btn'>
                <img onClick={handleAddToCart} src={assets.add_icon_green} alt="Add More" />
              </button>
            </div>
          )
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem
