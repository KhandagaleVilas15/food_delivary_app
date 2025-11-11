import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import AuthProvider from './components/AuthProvider'
import { useGetCity } from './hooks/useGetCity'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import { useUpdateLocation } from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import { Toaster } from 'react-hot-toast'
import { useSocketListeners } from './hooks/useSocketListeners'

const App = () => {
  // Only location-related hooks in App.js
  useUpdateLocation();
  useGetCity();
  useSocketListeners();
  const { userInfo } = useSelector((state) => state.user);
  return (
    <Router>
            <Toaster  
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName="toast-container"
        containerStyle={{
          top: 80,
          right: 20,
        }}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '380px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            marginTop: '8px',
          },
          
          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#fff',
              border: 'none',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          
          loading: {
            duration: Infinity,
            style: {
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: '#fff',
              border: 'none',
            },
          },
        }}
      />
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={!userInfo ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/signup" element={!userInfo ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!userInfo ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path="/" element={userInfo ? <Home /> : <Navigate to="/signin" />} />
          <Route path="/create-shop" element={userInfo ? <CreateEditShop /> : <Navigate to="/signin" />} />
          <Route path="/add-food" element={userInfo ? <AddItem /> : <Navigate to="/signin" />} />
          <Route path="/edit-food/:itemId" element={userInfo ? <AddItem /> : <Navigate to="/signin" />} />
          <Route path="/cart" element={userInfo ? <CartPage /> : <Navigate to="/signin" />} />
          <Route path="/checkout" element={userInfo ? <Checkout /> : <Navigate to="/signin" />} />
          <Route path="/order-placed" element={userInfo ? <OrderPlaced /> : <Navigate to="/signin" />} />
          <Route path="/my-orders" element={userInfo ? <MyOrders /> : <Navigate to="/signin" />} />
          <Route path="/track-order/:orderId" element={userInfo ? <TrackOrderPage /> : <Navigate to="/signin" />} />

        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App