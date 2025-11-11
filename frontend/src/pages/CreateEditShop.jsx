import React, { useRef, useState, useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { setShopData } from '../redux/slices/shopSlice';
import { useGetShopByOwner } from '../hooks/useGetMyShop';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BASE_URL } from '../config/constant';

const CreateEditShop = () => {
  // Fetch shop data for editing
  const fetchShop = useGetShopByOwner();
  
  const navigate = useNavigate();
  const { shopInfo, loading: shopLoading, error: shopError } = useSelector((state) => state.shop);
  const { city, state, currentAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    city: "",
    state: "",
    address: ""
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  // Form validation rules
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Shop name must be at least 2 characters';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }
    
    if (formData.image && typeof formData.image === 'object') {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(formData.image.type)) {
        newErrors.image = 'Please upload a valid image file (JPEG, PNG, WebP)';
      }
      
      if (formData.image.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.image = 'Image size must be less than 5MB';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Update form data when shopInfo changes
  useEffect(() => {
    if (shopInfo) {
      setFormData({
        name: shopInfo.name || "",
        image: shopInfo.image || null,
        city: shopInfo.city || city || "",
        state: shopInfo.state || state || "",
        address: shopInfo.address || currentAddress || ""
      });
      setImagePreview(shopInfo.image || null);
    } else {
      // Set default values from user data when creating new shop
      setFormData({
        name: "",
        image: null,
        city: city || "",
        state: state || "",
        address: currentAddress || ""
      });
    }
  }, [shopInfo, city, state, currentAddress]);

  console.log("shopInfo:", shopInfo);
  console.log("formData:", formData);


  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    // Clear existing errors for this field
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    
    if (submitError) {
      setSubmitError('');
    }
    
    if (files && files[0]) {
      // Handle file input
      const file = files[0];
      
      // Validate file immediately
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [id]: 'Please upload a valid image file (JPEG, PNG, WebP)'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          [id]: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      setFormData((prevState) => ({
        ...prevState,
        [id]: file,
      }));
      
      // Set image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle text inputs
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setSubmitError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    console.log(formData);

    try {
      // Create FormData if image is present, otherwise send JSON
      let requestData;
      let headers = {};
      
      if (formData.image && typeof formData.image === 'object') {
        // If image is a File object, use FormData
        requestData = new FormData();
        requestData.append('name', formData.name.trim());
        requestData.append('city', formData.city.trim());
        requestData.append('state', formData.state.trim());
        requestData.append('address', formData.address.trim());
        requestData.append('image', formData.image);
      } else {
        // If no new image, send JSON (for edit without changing image)
        requestData = {
          name: formData.name.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          address: formData.address.trim()
        };
        headers['Content-Type'] = 'application/json';
      }

      const {data} = await axios.post(`${BASE_URL}/api/shop/create-edit`, requestData, {
        withCredentials: true,
        headers
      });
      
      if(data.success){
        console.log("Shop created/edited successfully");
        dispatch(setShopData(data.data));
        navigate("/");
      } else {
        console.log("Failed to create/edit shop:", data.message);
        setSubmitError(data.message || "Failed to save shop information");
      }
    } catch (error) {
      console.error("Error occurred while creating/editing shop:", error);
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.response?.status === 413) {
        setSubmitError("Image file is too large. Please choose a smaller image.");
      } else if (error.response?.status >= 500) {
        setSubmitError("Server error. Please try again later.");
      } else if (error.code === 'NETWORK_ERROR') {
        setSubmitError("Network error. Please check your connection and try again.");
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleRetryShop = () => {
    fetchShop();
  };


  return (
    <div className='flex flex-col justify-center items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer' onClick={() => navigate("/")}>
        <IoArrowBackOutline size={35} className='text-[#ff4d2d]'/>
      </div>
      <div className='max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 border border-orange-100'>

        <div className='flex flex-col items-center mb-6'>
          <div className='bg-orange-100 p-4 rounded-full mb-4'>
            <FaUtensils className='text-[#ff4d2d] mb-4 w-14 h-14 sm:w-18 sm:h-18'/>
          </div>
          <div className='text-3xl font-extrabold text-gray-900'>
            {shopInfo?"Edit Shop":"Add Shop"}
          </div>
        </div>

        {shopLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner message="Loading shop information..." />
          </div>
        ) : shopError ? (
          <div className="py-8">
            <ErrorMessage 
              message="Failed to load shop information"
              onRetry={handleRetryShop}
            />
          </div>
        ) : (
          <form className='space-y-5' onSubmit={handleSubmit}>
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder='Enter Shop Name' 
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                }`}
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
              <input 
                type="file" 
                id="image" 
                accept='image/jpeg,image/png,image/webp,image/jpg' 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.image ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                }`}
                disabled={loading}
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              )}
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder='City' 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  disabled={loading}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>State <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  placeholder='State' 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.state ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  disabled={loading}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder='Enter Shop Address' 
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                }`}
                disabled={loading}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            
            <button 
              type='submit' 
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
                loading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#ff4d2d] text-white hover:bg-orange-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Shop'
              )}
            </button>
          </form>
        )}


      </div>



    </div>
  )
}


export default CreateEditShop