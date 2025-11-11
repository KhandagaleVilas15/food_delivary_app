import React from 'react'
import { useState } from 'react';
import { MdPhone } from 'react-icons/md'
import { useSelector } from 'react-redux';
import { useUpdateStatus } from '../hooks/useUpdateStatus';
import { useEffect } from 'react';
import { useGetAvailableDeliveryBoys } from '../hooks/useGetAvailableDeliveryBoy';

const OwnerOrderCard = ({data}) => {
  const [status, setStatus] = useState(data?.shopOrder?.[0]?.status || 'pending');
  const {availableBoys} = useSelector((state) => state.user);
  const updateStatus = useUpdateStatus();

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    if (!newStatus) return;
    setStatus(newStatus);
    try {
      const resp = await updateStatus(data?._id, data?.shopOrder?.[0]?._id, newStatus);
      // Capture available delivery boys if backend responds with them
      if (resp?.data?.availableDeliveryBoys) {
        console.log("resp.data.availableDeliveryBoys",resp.data)
      }
    } catch (err) {
      console.log(err?.message);
    }
  }

useGetAvailableDeliveryBoys();
  

  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
      <div>
      <p className='text-lg font-semibold text-gray-800'>{data?.userId?.fullName}</p>
      <p className='text-sm text-gray-500'>{data?.userId?.email}</p>
      <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><MdPhone /> <span>{data?.userId?.mobile}</span></p>
      </div>
      <div className='flex flex-col items-start gap-2 text-gray-600 text-sm'>
        <p>{data?.deliveryAddress?.text}</p>
        <p className='text-xs text-gray-500'>lat: {data?.deliveryAddress?.latitude}, long: {data?.deliveryAddress?.longitude}</p>
      </div>

       <div className="flex space-x-4 overflow-x-auto pb-2">
            {data?.shopOrder?.[0]?.shopOrderItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-40 rounded-lg p-2 bg-white"
              >
                <img
                  src={item?.item?.image}
                  alt={item?.item?.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold mt-1">{item?.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{item?.price} x {item?.quantity}
                </p>
              </div>
            ))}
      </div>

      <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
        <span className='text-sm'>Status: <span className='font-semibold capitalize text-[#ff4d2d]'>{status}</span></span>

        <select value={status} onChange={handleStatusChange} className='rounded-md border px-3 py-1 
        text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]'>
          <option value="">Change</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out-for-delivery">Out for Delivery</option>
        </select>

      </div>

      {
        data?.shopOrder?.[0].status === "out-for-delivery" && data?.shopOrder?.[0]?.assignedDeliveryBoy===null ? (
        <div className='mt-3 p-3 border rounded-lg text-sm bg-orange-50'>
          <p>Available Delivery Boys: </p>
          {
            availableBoys?.length > 0 ? (
              availableBoys.map((b,index)=>(
                <div key={index} className='text-gray-800'>{b.fullName}-{b.mobile}</div>
              ))
            ):(
              <div>No Available Delivery Boys</div>
            )
          }

        </div>):(
          <div className='mt-3 p-3 border rounded-lg text-sm bg-orange-50'>
            <p>{data?.shopOrder?.[0]?.assignedDeliveryBoy ? `Assigned to: ${data.shopOrder[0].assignedDeliveryBoy.fullName}` : "Not Assigned"}</p>
          </div>
        )
      }
      <div className='text-right font-bold text-gray-800 text-sm'>
        Total: ₹{data?.totalAmount}
      </div>
    </div>
  )
}

export default OwnerOrderCard