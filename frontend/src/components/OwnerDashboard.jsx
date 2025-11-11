import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import OwnerItemCard from './OwnerItemCard';
import { useGetShopByOwner } from '../hooks/useGetMyShop';
import { useGetOwnerOrders } from '../hooks/useGetOwnerOrder';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const OwnerDashboard = () => {
  // Fetch shop and order data specific to owner dashboard
  const fetchShop = useGetShopByOwner();
  const fetchOrders = useGetOwnerOrders();

  const { shopInfo, loading, error } = useSelector((state) => state.shop);
  const { ownerOrders, ownerOrdersLoading, ownerOrdersError } = useSelector((state) => state.user);
  console.log(ownerOrders,"owner orders in dashboard");
  const navigate = useNavigate();

  const handleRetryShop = () => {
    fetchShop();
  };

  const handleRetryOrders = () => {
    fetchOrders();
  };



  return (
    <div className='w-full bg-[#fff9f6] flex flex-col items-center'>
      <Nav />
      
      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <LoadingSpinner size="large" message="Loading your shop information..." />
        </div>
      ) : error ? (
        <div className='flex justify-center items-center py-20'>
          <ErrorMessage 
            message="Failed to load shop information"
            onRetry={handleRetryShop}
          />
        </div>
      ) : !shopInfo ? (
        <div className='flex justify-center itms-center p-4 sm:p-6' >
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl  transition-shadow duration-300'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils size={50} className='text-[#ff4d2d] mb-4 w-16 h-16 sm:w-20 sm:h-20' />
              <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Restaurant</h2>
              <p className='text-gray-400 mb-4 text-sm ms:text-base'>Join our food delivery platform and reach thousands of hungry customers every day.</p>
              <button onClick={() => navigate('/create-shop')} className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors cursor-pointer duration-200'>Get Started</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6'>

          <h1 className='text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center'>
            <FaUtensils size={50} className='text-[#ff4d2d] w-14 h-14' /> Welcome to {shopInfo.name}
          </h1>

          <div className='bg-white shadow-lg rounded-lg overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative'>
            <div className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer" onClick={() => navigate('/create-shop')}>
              <MdEdit size={15} />
            </div>
            <img src={shopInfo.image} alt={shopInfo.name} className="w-full h-48 sm:h-64 object-cover" />
            <div className="p-4 sm:p-6">
              <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{shopInfo.name}</h1>
              <p className='text-gray-500'>{shopInfo.city}, {shopInfo.state}</p>
              <p className='text-gray-500 mb-4'>{shopInfo.address}</p>
            </div>
          </div>

          {
            shopInfo.items.length === 0 && <div>
              <div className='flex justify-center itms-center p-4 sm:p-6' >
                <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl  transition-shadow duration-300'>
                  <div className='flex flex-col items-center text-center'>
                    <FaUtensils size={50} className='text-[#ff4d2d] mb-4 w-16 h-16 sm:w-20 sm:h-20' />
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Add Your Food Items</h2>
                    <p className='text-gray-400 mb-4 text-sm ms:text-base'>Share your delicious creation with our customers by adding them to menu.</p>
                    <button onClick={() => navigate('/add-food')} className='bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors cursor-pointer duration-200'>Add Food</button>
                  </div>
                </div>

              </div>
            </div>
          }

          {
            shopInfo?.items?.length > 0 &&
            <div className='flex flex-col items-center gap-4 w-full max-w-3xl mb-4'>
              {shopInfo?.items?.map((item, index) => {
                console.log(item,"shbshfgs");
                return (<OwnerItemCard key={index} item={item} />
                )
              })}
            </div>
          }

        </div>
      )}
    </div>
  )
}

export default OwnerDashboard