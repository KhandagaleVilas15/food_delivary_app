import React, { useRef, useState, useEffect } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { setShopData } from '../redux/slices/shopSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BASE_URL } from '../config/constant';

const AddItem = () => {
    const navigate = useNavigate();
    const { itemId } = useParams(); // Get itemId from URL params
    const { shopInfo } = useSelector((state) => state.shop);
    const dispatch = useDispatch();
    const categories = ["Snacks","Main Course","Dessert","Beverages","Pizza","Burger","Sandwich","South Indian","North Indian","Chinese","Fast Food","Others"]
    const [loading, setLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);
    const [itemError, setItemError] = useState('');
    const [itemToEdit, setItemToEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    
    // Check if we're in edit mode
    const isEditMode = Boolean(itemId);
    
    const [formData, setFormData] = useState({
        name: "",
        image: null,
        price: "",
        category: "",
        foodType: "veg"
    });

    const [imagePreview, setImagePreview] = useState(null);

    // Form validation rules
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Food name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Food name must be at least 2 characters';
        }
        
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        } else if (formData.price > 10000) {
            newErrors.price = 'Price must be less than ₹10,000';
        }
        
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }
        
        if (!formData.foodType) {
            newErrors.foodType = 'Please select food type';
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

    // Fetch item data if in edit mode
    useEffect(() => {
        const fetchItemData = async () => {
            if (isEditMode && itemId) {
                try {
                    setItemLoading(true);
                    setItemError('');
                    const { data } = await axios.get(`${BASE_URL}/api/item/getItem/${itemId}`, {
                        withCredentials: true
                    });
                    
                    if (data.success) {
                        const item = data.data;
                        setItemToEdit(item);
                        setFormData({
                            name: item.name || "",
                            image: item.image || null,
                            price: item.price || "",
                            category: item.category || "",
                            foodType: item.foodType || "veg"
                        });
                        setImagePreview(item.image || null);
                    } else {
                        setItemError(data.message || "Failed to load item data");
                    }
                } catch (error) {
                    console.error("Error fetching item:", error);
                    if (error.response?.status === 404) {
                        setItemError("Item not found");
                    } else if (error.response?.status >= 500) {
                        setItemError("Server error. Please try again later.");
                    } else {
                        setItemError("Failed to load item data");
                    }
                } finally {
                    setItemLoading(false);
                }
            }
        };

        fetchItemData();
    }, [itemId, isEditMode, navigate]);



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
            
            // Handle file input
            setFormData((prevState) => ({
                ...prevState,
                [id]: file,
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle text inputs
            let processedValue = value;
            
            // Special handling for price field
            if (id === 'price') {
                // Remove any non-numeric characters except decimal point
                processedValue = value.replace(/[^0-9.]/g, '');
                // Ensure only one decimal point
                const parts = processedValue.split('.');
                if (parts.length > 2) {
                    processedValue = parts[0] + '.' + parts.slice(1).join('');
                }
            }
            
            setFormData((prevState) => ({
                ...prevState,
                [id]: processedValue,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        console.log(formData)
        try {
            setLoading(true);
            let requestData;
            let url;
            let method = 'post';
            let headers = {};

            // Determine URL and method based on mode
            if (isEditMode) {
                url = `${BASE_URL}/api/item/editItem/${itemId}`;
                method = 'put';
            } else {
                url = `${BASE_URL}/api/item/addItem`;
                method = 'post';
            }

            if (formData.image && typeof formData.image === 'object') {
                // New image file selected
                requestData = new FormData();
                requestData.append('name', formData.name.trim());
                requestData.append('image', formData.image);
                requestData.append('price', parseFloat(formData.price));
                requestData.append('category', formData.category);
                requestData.append('foodType', formData.foodType);
            } else {
                // No new image, send JSON
                requestData = {
                    name: formData.name.trim(),
                    price: parseFloat(formData.price),
                    category: formData.category,
                    foodType: formData.foodType,
                };
                headers['Content-Type'] = 'application/json';
            }

            const { data } = await axios({
                method,
                url,
                data: requestData,
                withCredentials: true,
                headers
            });

            if (data.success) {
                console.log(`Item ${isEditMode ? 'updated' : 'created'} successfully`);
                dispatch(setShopData(data.data));
                navigate("/");
            } else {
                console.log(`Failed to ${isEditMode ? 'update' : 'create'} item:`, data.message);
                setSubmitError(data.message || `Failed to ${isEditMode ? 'update' : 'create'} item`);
            }
        } catch (error) {
            console.error(`Error occurred while ${isEditMode ? 'updating' : 'creating'} item:`, error);
            
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

    const handleRetryItemLoad = () => {
        setItemError('');
        // Re-trigger the useEffect by changing a dependency
        window.location.reload(); // Simple way to retry loading
    };



    return (
        <div className='flex flex-col justify-center items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <IoArrowBackOutline size={35} className='text-[#ff4d2d]'/>
            </div>
            <div className='max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 border border-orange-100'>

                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <FaUtensils className='text-[#ff4d2d] mb-4 w-14 h-14 sm:w-18 sm:h-18' />
                    </div>
                    <div className='text-3xl font-extrabold text-gray-900'>
                        {isEditMode ? "Edit Food" : "Add Food"}
                    </div>
                </div>

                {itemLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoadingSpinner message="Loading item information..." />
                    </div>
                ) : itemError ? (
                    <div className="py-8">
                        <ErrorMessage 
                            message={itemError}
                            onRetry={handleRetryItemLoad}
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
                                placeholder='Enter Food Name' 
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
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
                        
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Price (₹) <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                id="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                placeholder='Enter price (e.g., 150.00)' 
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                                }`}
                                disabled={loading}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category <span className="text-red-500">*</span></label>
                                <select 
                                    name="category" 
                                    id="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.category ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                                    }`}
                                    disabled={loading}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type <span className="text-red-500">*</span></label>
                                <select 
                                    name="foodType" 
                                    id="foodType" 
                                    value={formData.foodType} 
                                    onChange={handleChange} 
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.foodType ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                                    }`}
                                    disabled={loading}
                                >
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non-Veg</option>
                                </select>
                                {errors.foodType && <p className="text-red-500 text-sm mt-1">{errors.foodType}</p>}
                            </div>
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
                                    {isEditMode ? "Updating..." : "Adding..."}
                                </div>
                            ) : (
                                isEditMode ? "Update Food" : "Add Food"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}


export default AddItem