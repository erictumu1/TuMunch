import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Navbar from './components/Navbar/Navbar'
import './components/Toastify/Toaststyles.css'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import MyOrders from './pages/MyOrders/MyOrders'
import OrderTracking from './pages/OrderTracking/OrderTracking'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Verify from './pages/Verify/Verify'

const App = () => {

  const [category, setCategory] = useState("All");
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} setCategory={setCategory}/>  
        <Routes>
          <Route path='/' element={<Home category={category} setCategory={setCategory} />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path="/track-order" element={<OrderTracking />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App