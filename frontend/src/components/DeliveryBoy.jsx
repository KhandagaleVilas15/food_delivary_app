import React, { useCallback, useEffect, useState } from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import axios from "axios";
import { useGetCurrentOrders } from "../hooks/useGetCurrentOder";
import DeliveryboyTracking from "./DeliveryboyTracking";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../config/constant";
import { useUpdateLocation } from "../hooks/useUpdateLocation";
import { connectSocket } from "../utils/socket";

const DeliveryBoy = () => {
  // Continuously update delivery boy's live location for assignment matching
  useUpdateLocation();
  const { userInfo, currentOrders } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [showOtpBox,setShowOtpBox]=useState(false);
  const [otp,setOtp]=useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [acceptingOrder, setAcceptingOrder] = useState(null); // Track which order is being accepted

  console.log("Current Orders in DeliveryBoy:", currentOrders);

  // Use the proper hook to fetch current orders
  const fetchCurrentOrders = useGetCurrentOrders();

  const getAssignments = useCallback(async () => {
    try {
      const result = await axios.get(
        `${BASE_URL}/api/order/get-assignment`,
        { withCredentials: true }
      );
      if (result.data.success) {
        console.log(result.data.data);
        setAssignments(result.data.data);
      } else {
        console.log(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }, [userInfo?._id]);

  useEffect(() => {
    getAssignments();
  }, [getAssignments]);

  useEffect(() => {
    if (!userInfo) return;
    const socket = connectSocket();

    const handleAssignmentEvent = () => {
      getAssignments();
    };

    const handleOrdersRefresh = (payload = {}) => {
      if (payload.scope === "delivery") {
        fetchCurrentOrders();
        getAssignments();
      }
    };

    socket.on("delivery:assignment", handleAssignmentEvent);
    socket.on("delivery:assignment-closed", handleAssignmentEvent);
    socket.on("orders:refresh", handleOrdersRefresh);

    return () => {
      socket.off("delivery:assignment", handleAssignmentEvent);
      socket.off("delivery:assignment-closed", handleAssignmentEvent);
      socket.off("orders:refresh", handleOrdersRefresh);
    };
  }, [fetchCurrentOrders, getAssignments, userInfo]);

  const handleAcceptOrder = async (assignmentId) => {
    try {
      setAcceptingOrder(assignmentId);
      const { data } = await axios.post(
        `${BASE_URL}/api/order/accept-order/${assignmentId}`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data?.message || "Order accepted successfully", {
          icon: '✅',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
          },
        });
        // Refetch current orders after accepting
        fetchCurrentOrders();
        // Refresh assignments to remove accepted order
        getAssignments();
      } else {
        toast.error(data.message || "Failed to accept order", {
          icon: '❌',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to accept order. Please try again.");
      }
    } finally {
      setAcceptingOrder(null);
    }
  };


  const handleSendOtp=async(e)=>{
    try {
      setLoadingOtp(true);
      // Include order ID in the request if needed
      const requestData = currentOrders?.shopOrder?.id ? { orderId: currentOrders.shopOrder.id } : {};

      const {data} = await axios.post(`${BASE_URL}/api/order/mark-order-as-delivered`, requestData, { withCredentials: true });
      if(data.success){
        toast.success(data?.message || "OTP sent to customer successfully", {
          icon: '📱',
          style: {
            background: '#3B82F6',
            color: '#fff',
            fontWeight: '600',
          },
        });
        setShowOtpBox(true);
      }else{
        toast.error(data.message || "Failed to send OTP", {
          icon: '⚠️',
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error("Invalid request. Please check order details.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoadingOtp(false);
    }
  };


  const handleSubmitOtp=async(e)=>{
    // Validate OTP input
    if (!otp || otp.trim().length === 0) {
      toast.error("Please enter the OTP", {
        icon: '📝',
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
      return;
    }
    
    if (otp.trim().length < 4) {
      toast.error("Please enter a valid OTP", {
        icon: '🔢',
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
      return;
    }
    
    try {
      setLoadingSubmit(true);
      // Include order ID and properly format the request
      const requestData = {
        otp: otp.trim(),
        orderId: currentOrders?.shopOrder?.id || currentOrders?.id
      };
      
      console.log("Current Orders:", currentOrders);
      console.log("Submitting OTP with data:", requestData);
      const {data} = await axios.post(`${BASE_URL}/api/order/send-delivery-otp`, requestData, { withCredentials: true });
      if(data.success){
        toast.success(data?.message || "Order delivered successfully!", {
          icon: '🎉',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
          },
          duration: 5000,
        });
        setShowOtpBox(false);
        setOtp("");
        // Refresh orders after successful delivery
        fetchCurrentOrders();
      }else{ 
        toast.error(data.message || "Invalid OTP. Please try again.", {
          icon: '🔢',
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error("Invalid OTP or request. Please check and try again.");
      } else if (error.response?.status === 404) {
        toast.error("Order not found. Please refresh and try again.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center text-center gap-2 w-[90%] border border-orange-100">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userInfo?.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitude:</span>{" "}
            {userInfo?.location?.coordinates[0]},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {userInfo?.location?.coordinates[1]}
          </p>
        </div>

        {!currentOrders && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {assignments.length === 0 ? (
                <p className="text-gray-600">No assignments available</p>
              ) : (
                assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {assignment?.shopName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {assignment?.deliveryAddress?.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {assignment?.items.length} items | ₹
                        {assignment?.subtotal}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAcceptOrder(assignment.assignmentId)}
                      disabled={acceptingOrder === assignment.assignmentId}
                      className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                        acceptingOrder === assignment.assignmentId
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                      }`}
                    >
                      {acceptingOrder === assignment.assignmentId ? "Accepting..." : "Accept"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentOrders && (
          <div className="bg-white text-2xl p-5 shadow-md w-[90%] rounded-2xl border border-orange-100">
            <h2 className="text-lg font-bold mb-3 ">📦Current Order</h2>
            <div className="border rounded-lg p-4 mb-3 ">
              <p className="text-sm font-semibold">
                {currentOrders?.shop?.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrders?.deliveryAddress?.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrders?.shopOrder?.shopOrderItems.length} items | ₹
                {currentOrders?.shopOrder?.subtotal}
              </p>
            </div>

            <DeliveryboyTracking data={currentOrders} />

            {!showOtpBox ? <button 
              onClick={handleSendOtp} 
              disabled={loadingOtp}
              className={`mt-4 w-full font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200 ${
                loadingOtp 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
              }`}
            >
              {loadingOtp ? "Sending OTP..." : "Mark as Delivered"}
            </button> : <div className="mt-4 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">Enter OTP sent to <span className="text-orange-500">{currentOrders?.user?.fullName}</span></p>
                <input 
                  type="text" 
                  value={otp} 
                  className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' 
                  onChange={(e)=>setOtp(e.target.value)}
                  placeholder="Enter 4-6 digit OTP"
                  maxLength="6"
                  disabled={loadingSubmit}
                />
                <button 
                  className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                    loadingSubmit 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                  onClick={handleSubmitOtp}
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? "Verifying..." : "Submit OTP"}
                </button>
              </div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
