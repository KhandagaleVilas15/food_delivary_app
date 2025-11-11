import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOrderById } from '../hooks/useGetOrderById';
import { useSelector } from 'react-redux';
import { IoIosArrowRoundBack } from 'react-icons/io';
import DeliveryboyTracking from '../components/DeliveryboyTracking';
import { connectSocket } from '../utils/socket';

const TrackOrderPage = () => {
    const {orderId} = useParams();
    useGetOrderById(orderId);

    useEffect(() => {
        if (!orderId) return;
        const socket = connectSocket();
        socket.emit('order:subscribe', orderId);
        return () => {
            socket.emit('order:unsubscribe', orderId);
        };
    }, [orderId]);

    const { orderDetailsById } = useSelector((state) => state.user);
    console.log(orderDetailsById)
    const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
        <div className='relative top-[20px] flex items-center left-[20px] z-[10px] mb-[10px]' onClick={() => navigate(-1)}>
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d] cursor-pointer" />
            <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
        </div>
        {
            orderDetailsById?.shopOrder?.map((shopO, index) => (
                <div className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4" key={index}>
                    <div>
                        <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>{shopO?.shop?.name}</p>
                        <p className='font-semibold'><span>Items: </span> {shopO.shopOrderItems.map((i)=>i.name).join(", ")} </p>
                        <p className='font-semibold'><span>Subtotal: </span> ₹{shopO?.subtotal?.toFixed(2)}</p>
                        <p className='mt-6'><span>Delivery Address: </span> {orderDetailsById?.deliveryAddress?.text}</p>
                    </div>

                    {shopO?.status !== "delivered" ? (
                        <>
                        {shopO?.assignedDeliveryBoy ? (<div className='text-sm text-gray-700'>
                            <p className='font-semibold'><span>Delivery Boy Name:</span> {shopO.assignedDeliveryBoy.fullName}</p>
                            <p className='font-semibold'><span>Mobile:</span> {shopO.assignedDeliveryBoy.mobile}</p>
                        </div>):(<p className='font-semibold'>Delivery Boy Not Assigned Yet.</p>)}

                        </>
                    ):(<p className='text-green-600 text-lg font-semibold'>Delivered</p>)}

                    {shopO?.assignedDeliveryBoy && 
                    <div className='h-[400px] rounded-2xl w-full overfow-hidden shadow-md'>

<DeliveryboyTracking data={{
                        deliveryBoyLocation: {lat: shopO?.assignedDeliveryBoy.location.coordinates[1], long: shopO?.assignedDeliveryBoy.location.coordinates[0]},
                        customerLocation: {lat: orderDetailsById?.deliveryAddress?.latitude, long: orderDetailsById?.deliveryAddress?.longitude}
                    }} />

                    </div>
                    }

                </div>
            ))
        }


    </div>
  )
}

export default TrackOrderPage