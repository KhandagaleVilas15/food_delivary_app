import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BASE_URL } from "../config/constant";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleSendOtp = async () => {
    // Logic to send OTP to the provided email
    try {
      setLoading(true);
      const {data} = await axios.post(`${BASE_URL}/api/auth/send-otp`, {email});
      if(data.success){
        toast.success("OTP sent to your email!");
        setLoading(false);
        setStep(2);
      } else {
        toast.error("Failed to send OTP. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  const handleVerifyOtp = async () => {
    // Logic to verify the entered OTP
    try {
      setLoading(true);
      const {data} = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {email, otp});
      if(data.success){
        toast.success("OTP verified successfully!");
        setStep(3);
        setLoading(false);
      } else {
        toast.error("Failed to verify OTP. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }
  const handleResetPassword = async () => {
    if(newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      const {data} = await axios.post(`${BASE_URL}/api/auth/reset-password`, {email, newPassword});
      if(data.success){
        toast.success("Password reset successfully!");
        navigate("/signin");
        setLoading(false);
      } else {
        toast.error("Failed to reset password. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }


  


  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 ">
        <div className="flex items-center gap-4">
          <IoIosArrowRoundBack
            className="text-[#ff4d2d] cursor-pointer"
            size={30}
            onClick={() => { if(step === 1) { navigate("/signin"); } else { setStep(step - 1); } }}
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>
        {step === 1 && (
          <form className="mt-6 flex flex-col gap-4">
            <label className="text-gray-600 mt-4">
              Enter your email address below.
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
              className="w-full font-semibold text-white bg-[#ff4d2d] hover:bg-[#e64323] mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer"
            >
              {loading ? <ClipLoader size={20} color={"#fff"} /> : "Send Otp"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="mt-6 flex flex-col gap-4">
            <label className="text-gray-600 mt-4">
              Enter the OTP sent to your email address.
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter OTP"
            />  
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleVerifyOtp();
              }}
              className="w-full font-semibold text-white bg-[#ff4d2d] hover:bg-[#e64323] mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer"
            >
              {loading ? <ClipLoader size={20} color={"#fff"} /> : "Verify Otp"}
            </button>
          </form>
        )}
        {step === 3 && (
          <form className="mt-6 flex flex-col gap-4">
            <label className="text-gray-600 mt-4">Enter your new password.</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter New Password"
            />
            <label className="text-gray-600 mt-4">Confirm your new password.</label>
            <input
              type="password"
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter Confirm New Password"
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
              className="w-full font-semibold text-white bg-[#ff4d2d] hover:bg-[#e64323] mt-4 flex items-center justify-center gap-2 border border-[#ddd] rounded-lg px-4 py-2 transition duration-200 cursor-pointer"
            >
              {loading ? <ClipLoader size={20} color={"#fff"} /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
