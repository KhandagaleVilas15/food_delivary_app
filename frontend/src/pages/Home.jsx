import React from 'react'
import { useSelector } from 'react-redux';
import UserDashboard from '../components/UserDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import DeliveryBoy from '../components/DeliveryBoy';

const Home = () => {
    const {userInfo} = useSelector((state) => state.user);
    console.log(userInfo)
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col bg-[#fff9f6]'>
{userInfo?.role === 'user' && <UserDashboard />}
{userInfo?.role === 'owner' && <OwnerDashboard />}
{userInfo?.role === 'deliveryBoy' && <DeliveryBoy />}
    </div>
  )
}

export default Home