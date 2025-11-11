import React, { useState } from "react";
import { IoLocation } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearUserData } from "../redux/slices/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { BASE_URL } from "../config/constant";

const Nav = () => {
  const { userInfo, city, cartItems } = useSelector((state) => state.user);
  const { shopInfo } = useSelector((state) => state.shop);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Use POST method to match backend route
      const res = await axios.post(
        `${BASE_URL}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log("User logged out successfully");
        dispatch(clearUserData());
        navigate("/signin");
      } else {
        console.log("Logout failed:", res.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if backend fails, clear frontend state
      dispatch(clearUserData());
      navigate("/signin");
    }
  };

  return (
    <div className="w-full h-[60px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Vingo</h1>
      {userInfo.role === "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg hidden md:flex items-center gap-[20px]">
          <div className="flex items-center gap-[10px] w-[30%] overflow-hidden px-[10px] border-r-[2px] border-gray-400">
            <IoLocation size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search Delicious Food"
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-[20px]">
        {userInfo.role === "user" &&
          (!showSearch ? (
            <IoIosSearch
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ) : (
            <RxCross2
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ))}

        {userInfo.role === "owner" ? (
          <>
            {shopInfo && (
              <>
                <button
                  onClick={() => navigate("/add-food")}
                  className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                >
                  <FaPlus size={20} />
                  <span>Add Food Item</span>
                </button>
                <button className="flex md:hidden items-center cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
                  <FaPlus size={20} />
                </button>
              </>
            )}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-2  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 size={25} className="text-[#ff4d2d]" />
              <span>My Orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
            <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-2  rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium">
              <TbReceipt2 size={25} className="text-[#ff4d2d]" />
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {userInfo.role == "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <FiShoppingCart size={25} className="text-[#ff4d2d]" />
                <span className="text-[#ff4d2d] absolute right-[-9px] top-[-12px]">
                {cartItems?.length}
              </span>
            </div>)}
            <button
              onClick={() => navigate("/my-orders")}
              className="hidden cursor-pointer md:block px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium text-sm"
            >
              My Orders
            </button>
          </>
        )}

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-[40px] h-[40px] rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-[18px] font-semibold cursor-pointer"
        >
          {userInfo?.fullName.slice(0, 1).toUpperCase()}
        </div>
        {isOpen && (
          <div
            className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[20%] w-[180px] bg-white shadow-2xl rounded-lg p-[20px] flex flex-col gap-[10px] z-[9999]"
            id="cart"
          >
            <div className="text-[17px] font-semibold">
              {userInfo?.fullName}
            </div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer" onClick={() => navigate("/my-orders")}>
              My Orders
            </div>
            <div className="text-[#ff4d2d] font-semibold cursor-pointer">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}

        {showSearch && userInfo.role === "user" && (
          <div className="w-[90%] h-[70px] fixed bg-white shadow-xl rounded-lg top-[80px] left-[5%] flex items-center gap-[20px] md:hidden">
            <div className="flex items-center gap-[10px] w-[30%] overflow-hidden px-[10px] border-r-[2px] border-gray-400">
              <IoLocation size={25} className="text-[#ff4d2d]" />
              <div className="w-[80%] truncate text-gray-600">Jhansi</div>
            </div>
            <div className="w-[80%] flex items-center gap-[10px]">
              <IoIosSearch size={25} className="text-[#ff4d2d]" />
              <input
                type="text"
                placeholder="Search Delicious Food"
                className="px-[10px] text-gray-700 outline-0 w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
