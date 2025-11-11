import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import { BASE_URL } from "../config/constant";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form validation rules
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleChange = (e) => {
        const { id, value } = e.target;
        
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
        
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        console.log(formData);

        try {
          setLoading(true);
            const {data} = await axios.post(`${BASE_URL}/api/auth/signin`, {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            }, {withCredentials: true});
            
            if(data.success){
                toast.success("Signed in successfully");
                dispatch(setUserData(data.user));
                setFormData({
                    email: "",
                    password: "",
                }); 
                navigate("/"); // Navigate to home instead of profile
            } else {
                toast.error(data.message || "Sign in failed. Please try again.");
                setSubmitError(data.message || "Sign in failed. Please try again.");
            }
        } catch (error) {
            console.error("Error signing in:", error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 401) {
                toast.error("Invalid email or password");
            } else if (error.response?.status >= 500) {
                toast.error("Server error. Please try again later.");
            } else if (error.code === 'NETWORK_ERROR') {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleAuth = async () => {
        try {
          setLoading(true);
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const {data} = await axios.post(`${BASE_URL}/api/auth/google-auth`, {email: user.email},{withCredentials: true});
          if(data.success){
            console.log("User signed in with Google:", user);
            toast.success("Signed in with Google successfully");
            dispatch(setUserData(data.user));
            navigate("/"); // Navigate to home
          } else {
            console.log("Google sign in failed:", data.message);
            toast.error(data.message);
          }
        } catch (error) {
            console.error("Error with Google authentication:", error);
            
            // Handle specific Firebase auth errors
            if (error.code === 'auth/popup-closed-by-user') {
              console.log("User closed the popup, no action needed");
              // Don't show error message for user-cancelled action
              return;
            } else if (error.code === 'auth/popup-blocked') {
              toast.error("Popup was blocked by browser. Please allow popups and try again.");
            } else if (error.code === 'auth/cancelled-popup-request') {
              console.log("Popup request was cancelled");
              // Don't show error for cancelled requests
              return;
            } else if (error.code === 'auth/network-request-failed') {
              toast.error("Network error. Please check your internet connection and try again.");
            } else if (error.code === 'auth/too-many-requests') {
              toast.error("Too many failed attempts. Please try again later.");
            } else {
              toast.error("Failed to sign in with Google. Please try again.");
            }
        } finally {
          setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-[1px] border-[#ddd]">
        <h1 className="text-3xl font-black mb-2 text-[#ff4d2d]">Vingo</h1>
        <p className="text-gray-600 mb-8">
          SignIn to your account to get started with delicious food deliveries.
        </p>

        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {submitError}
            </div>
          )}
          
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#ddd] focus:border-orange-500'
              }`}
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full border rounded-lg px-3 py-2 pr-12 focus:outline-none ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#ddd] focus:border-orange-500'
                }`}
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword((pre) => !pre)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        <div className="text-right mb-4 text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-semibold text-white mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff4d2d] hover:bg-[#e64323]'
            }`}
          > 
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Sign In"}
          </button>
      </form>
      <button 
        className={`w-full font-semibold text-black hover:bg-gray-100 mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 transition duration-200 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color={"#000"} /> : <FcGoogle />} 
        {loading ? "Signing in..." : "Sign In with Google"}
      </button>
      <p className="text-xs text-gray-500 mt-1 text-center">Make sure to allow popups for Google sign-in</p>
      <p className="mt-3 text-center">Don't have an account ? <span onClick={() => navigate("/signup")} className="text-[#ff4d2d] cursor-pointer underline">Sign Up</span></p>
    </div>
    </div>
  );
};

export default SignIn;
