import React from "react";
import { data, useNavigate } from "react-router-dom";

const UserOrderCard = ({ order }) => {
  const navigate = useNavigate();
  console.log(order);
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">order #{order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {order.paymentMethod?.toUpperCase()}
          </p>
          <p className="font-medium text-blue-500">
            {order.shopOrder?.[0].status}
          </p>
        </div>
      </div>
      {order?.shopOrder?.map((shopO, index) => (
        <div
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          key={index}
        >
          <p>{shopO?.shop?.name}</p>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopO?.shopOrderItems?.map((item, idx) => (
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
          <div className="flex justify-between border-t pt-2 items-center">
            <p className="font-semibold">Subtotal: ₹{shopO?.subtotal}</p>
            <span className="text-sm font-medium text-blue-600">
              {shopO?.status}
            </span>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold">Total: ₹{order.totalAmount}</p>
        <button className="px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e64528] cursor-pointer" onClick={()=>navigate(`/track-order/${order._id}`)}>
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
