import axios from 'axios';
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:5000";
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true); // new loading state
  const [food_list,setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token){
      await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  };

  const clearCart = async () => {
  setCartItems({});
  if (token) {
    await axios.post(url + "/api/cart/clear", {}, { headers: { token } });
  }
};


const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      let itemInfo = food_list.find((product) => product._id === item);
      if (itemInfo) { // ✅ Check if the item exists in food_list
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
};


  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data)
  }

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      const cartData = response.data.cartData || {};  // default to empty object if null/undefined
      setCartItems(cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setCartItems({});
    }
  };
  
const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      const storedName = localStorage.getItem("userName");
      if (storedToken && storedName) {
        setToken(storedToken);
        setUserName(storedName);
        await loadCartData(storedToken);
      }
      setLoading(false);
    }
    loadData();
  }, []);


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    clearCart,
    url,
    token,
    setToken,
    userName,
    setUserName,
    isLoggedIn: !!token && !!userName
  };

  // delay reloading of the screen until token is ready
  if (loading) return null;

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;