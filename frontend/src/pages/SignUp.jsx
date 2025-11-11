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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role: selectedRole,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
            const {data} = await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
                withCredentials: true // This allows cookies to be sent and received
            });
            if(data.success){
                console.log("User signed up successfully");
                toast.success("Signed up successfully");
                dispatch(setUserData(data.user));
                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    mobile: "",
                    role: selectedRole,
                });
                setError("");
                navigate("/"); // Navigate to home instead of signin
                setLoading(false);
            } else {
                console.log("Sign up failed:", data.message);
               toast.error(data.message);
               setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error signing up:", error);
            toast.error(error.message);
        }
    }

    const handleGoogleAuth = async () => {
      if(!formData.mobile){
        return alert("Please enter your mobile number");
      }
        try {
          setLoading(true);
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const {data} = await axios.post(`${BASE_URL}/api/auth/google-auth`, {
            email: user.email, 
            fullName: user.displayName, 
            mobile: formData.mobile,
            role: selectedRole
          }, {
            withCredentials: true // This allows cookies to be sent and received
          });
          if(data.success){
            console.log("User signed in with Google:", user);
            toast.success("Signed in with Google successfully");
            dispatch(setUserData(data.user));
            navigate("/"); // Navigate to home instead of signin
            setError("");
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
          Create your account to get started with delicious food deliveries.
        </p>

        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter Your Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
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
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword((pre) => !pre)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block font-medium text-gray-700 mb-1"
          >
            Mobile
          </label>
          <input
            type="number"
            id="mobile"
            className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter Your Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <div className="flex">
            {["user", "owner", "deliveryBoy"].map((role) => (
              <button
                key={role}
                type="button"
                className="border flex-1 cursor-pointer border-[#ddd] rounded-lg px-3 py-2 hover:bg-orange-500 hover:text-white text-center font-medium transition-colors mr-2"
                style={{
                  backgroundColor:
                    selectedRole === role ? "#ff4d2d" : "transparent",
                  color: selectedRole === role ? "white" : "#333",
                }}
                onClick={() => {
                  setSelectedRole(role);
                  setFormData((prevState) => ({
                    ...prevState,
                    role: role,
                  }));
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
              </button>
            ))}
          </div>
        </div>
      <button type="submit" className={`w-full font-semibold text-white bg-[#ff4d2d] hover:bg-[#e64323] mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer ${loading?"disabled":""}`}> {loading ? <ClipLoader size={20} color={"#fff"} /> : "Sign Up"}</button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>
      <button 
        className={`w-full font-semibold text-black hover:bg-gray-100 mt-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 transition duration-200 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color={"#000"} /> : <FcGoogle />} 
        {loading ? "Signing up..." : "Sign Up with Google"}
      </button>
      <p className="text-xs text-gray-500 mt-1 text-center">Make sure to allow popups for Google sign-in</p>
      <p className="mt-3 text-center">Already have an account ? <span onClick={() => navigate("/signin")} className="text-[#ff4d2d] cursor-pointer underline">Sign In</span></p>
    </div>
    </div>
  );
};

export default SignUp;
