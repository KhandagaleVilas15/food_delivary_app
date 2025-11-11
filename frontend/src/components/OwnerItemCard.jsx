import axios from 'axios';
import React from 'react'
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setShopData } from '../redux/slices/shopSlice';
import { BASE_URL } from '../config/constant';

const OwnerItemCard = ({ item }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = () => {
    // Navigate to edit page with item ID
    navigate(`/edit-food/${item._id}`);
  };

  const handleDelete = async () => {
    // Handle delete action
    try {
      const {data} = await axios.delete(`${BASE_URL}/api/item/deleteItem/${item._id}`, {withCredentials: true});
      if(data.success){
        alert("Item deleted successfully");
        dispatch(setShopData(data.data));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl h-36'>
      <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
        <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className='text-base font-semibold text-[#ff4d2d]'>{item.name}</h2>
          <p className=''><span className='font-medium text-gray-700'>Food Category:</span> {item.category}</p>
          <p className=''><span className='font-medium text-gray-700'>Food Type:</span> {item.foodType}</p>
        </div>
        <div className='flex justify-between'>
          <div className="text-[#ff4d2d] font-bold"> ₹{item.price}</div>
          <div className='flex items-center gap-4'>
            <div className="p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer" onClick={handleEdit}>
              <MdEdit size={16} />
            </div>
            <div className="p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer" onClick={handleDelete}>
              <MdDeleteOutline size={16} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OwnerItemCard