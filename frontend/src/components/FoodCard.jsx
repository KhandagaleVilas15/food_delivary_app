import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../redux/slices/userSlice";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 0));
  };

  console.log(data,"data in FoodCart")

  return (
    <div className="w-[270px] rounded-2xl border-2 border-[#fff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        {data.foodType === "Veg" ? (
          <FaLeaf
            className="absolute z-10 top-2 right-2 text-green-500 bg-white p-1 rounded-full"
            size={20}
          />
        ) : (
          <FaDrumstickBite
            className="absolute top-2 right-2 text-red-500 bg-orange-200 p-1 rounded-full z-10"
            size={20}
          />
        )}
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <h1 className="font-medium text-gray-500 text-[12px] truncate">
          {data.shop.name}
        </h1>
        <div className="mt-1 flex items-centern">
          {renderStars(data.rating?.average || 0)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-3">
        <span className="font-bold text-gray-900 text-lg"> ₹{data.price}</span>
        <div className="flex items-center border rounded-full overflow-hidden shadow-md">
          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleDecrease}
          >
            <FaMinus size={12} />
          </button>
          <span>{quantity}</span>
          <button
            className="px-2 py-1 hover:bg-gray-100 transition"
            onClick={handleIncrease}
          >
            <FaPlus size={12} />
          </button>
          <button
            className={`${
              cartItems.some((item) => item.id === data._id)
                ? "bg-gray-800"
                : "bg-[#ff4d2d] text-white"
            } px-2 py-2 transition-colors`}
            onClick={() => {
                if (quantity === 0) return;
              dispatch(
                setCartItems({
                  id: data._id,
                  name: data.name,
                  price: data.price,
                  image: data.image,
                  shop: data.shop,
                  foodType: data.foodType,
                  quantity: quantity,
                })
              );
              setQuantity(0);
            }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
