import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { removeFromCart, updateQuantity } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();

  const handleDecrease = ({ id, quantity }) => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id, quantity: quantity - 1 }));
    } else {
      dispatch(removeFromCart(id));
    }
  };
  const handleIncrease = ({ id, quantity }) => {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
  };
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-border">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div className="">
          <h1 className="font-medium text-gray-800">{data.name}</h1>
          <p className="text-sm text-gray-500">
            ₹{data.price}x{data.quantity}
          </p>
          <p className="font-bold text-gray-800">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() =>
            handleDecrease({ id: data.id, quantity: data.quantity })
          }
        >
          <FaMinus size={12} />
        </button>
        <span className="text-center font-bold">{data.quantity}</span>
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() =>
            handleIncrease({ id: data.id, quantity: data.quantity })
          }
        >
          <FaPlus size={12} />
        </button>
        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
          onClick={() => dispatch(removeFromCart(data.id))}
        >
          <CiTrash size={12} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
