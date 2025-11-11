import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useGetUserOrders } from '../hooks/getUserOrders';
import { useGetMyOrders } from '../hooks/useGetMyOrders';
import DataState from '../components/DataState';
import LoadingSpinner from '../components/LoadingSpinner';
import { useGetOwnerOrders } from '../hooks/useGetOwnerOrder';

const MyOrders = () => {
    // Fetch orders data specific to MyOrders page
    const fetchOwnerOrders = useGetOwnerOrders();
    const fetchMyOrders = useGetMyOrders();
    
    const { 
        myOrders, 
        userInfo, 
        ownerOrders,
        ordersLoading,
        ordersError
    } = useSelector((state) => state.user);
    
    console.log(ownerOrders)
    const navigate = useNavigate();

    const handleRetry = () => {
        fetchMyOrders();
        fetchOwnerOrders();
    };
  return (
    <div
    className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'
    >
      <div className='w-full max-w-[800px] p-4'>
        <div className='flex items-center gap-[20px] mb-6'>
          <div className='z-[10] ' onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className='text-[#ff4d2d] cursor-pointer' />
          </div>
          <h1 className='text-2xl font-bold text-start'>My Orders</h1>
        </div>

        <div className='space-y-6'>
          {userInfo?.role === "user" && (
            <DataState
              loading={ordersLoading}
              error={ordersError}
              data={myOrders}
              onRetry={handleRetry}
              emptyMessage="No orders found"
              emptySubtitle="Your orders will appear here once you make a purchase"
            >
              {myOrders?.map((order) => (
                <UserOrderCard key={order?.id} order={order} />
              ))}
            </DataState>
          )}
          
          {userInfo?.role === "owner" && (
            <DataState
              loading={ordersLoading}
              error={ordersError}
              data={ownerOrders}
              onRetry={handleRetry}
              emptyMessage="No shop orders found"
              emptySubtitle="Orders for your shop will appear here"
            >
              {ownerOrders?.map((order) => (
                <OwnerOrderCard key={order?.id} data={order} />
              ))}
            </DataState>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders