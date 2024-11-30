import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import './FoodItem.css'

const FoodItem = ({id,name,price,description,image}) => {
const {cartItems,addToCart,removeFromCart} = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
         <img className='food-item-image' src = {image} alt="" />
         {
          !cartItems[id] ?   <img className='add' onClick={() =>addToCart(id)} src={assets.add_icon_white} alt="" /> : <div className="food-item-counter">
              <button className='decrease-btn'><img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" /></button>
              <p>{cartItems[id]}</p>
              <button className='increase-btn'><img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" /> </button>
          </div>
         }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem