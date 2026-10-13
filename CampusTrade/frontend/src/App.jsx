import React from 'react'
import Navbar from './Component/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './Pages/Homepage/HomePage'
import ProductDetailsPage from './Pages/ProductDetails/ProductDetailsPage'
import SellPage from './Pages/Sell/SellPage'
import Cart from './Pages/Cart/Cart'
import Checkout from './Pages/Checkout/Checkout'
import Footer from './Component/Footer/Footer'
import { Toaster } from 'react-hot-toast'
import LoginPage from './Pages/Auth/LoginPage'
import SignupPage from './Pages/Auth/SignupPage'
import ForgotPass from './Pages/Auth/ForgotPass'
import Wishlist from './Pages/Wishlist/Wishlist'
import OrderHistory from './Pages/OrderHistory/OrderHistory'

const App = () => {
  const location = useLocation();
  const hideLayout = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} toastOptions={{
        style: {
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.12)',
          fontWeight: 700,
          fontSize: '0.9rem',
        },
      }} />
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient">
         <div className="blob-3" />
         <div className="blob-4" />
         <div className="blob-5" />
      </div>
      <div className='app'>
        {!hideLayout && <Navbar />}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductDetailsPage />} />
          <Route path='/sell' element={<SellPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Checkout />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/order-history' element={<OrderHistory />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forgot-password' element={<ForgotPass />} />
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
