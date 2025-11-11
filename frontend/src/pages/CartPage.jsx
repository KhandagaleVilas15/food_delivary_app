import React from "react";
import { IoIosArrowBack, IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  console.log(cartItems);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-[20px] mb-6">
          <div
            className="z-[10] text-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>
        {cartItems?.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-2xl">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <CartItemCard key={index} data={item} />
              ))}
            </div>
            <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
              <h2 className="font-bold text-lg text-gray-800">Total Amount</h2>
              <span className="text-xl font-bold text-[#ff4d2d]">
                ₹{totalAmount}
              </span>
            </div>
            <div className="mt-4 flex justify-end" onClick={() => navigate("/checkout")}>
              <button className="bg-[#ff4d2d] cursor-pointer text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
