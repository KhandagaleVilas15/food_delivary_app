import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../utils/socket";
import { BASE_URL } from "../config/constant";
import {
  setMyOrders,
  setOwnerOrders,
  setCurrentOrders,
  setOrderDetailsById,
  updateOrderTrackingLocation,
} from "../redux/slices/userSlice";

const fetchWithDispatch = async (url, onSuccess) => {
  try {
    const { data } = await axios.get(url, { withCredentials: true });
    if (data?.success) {
      onSuccess(data);
    }
  } catch (error) {
    console.error(`Socket refresh failed for ${url}`, error.message || error);
  }
};

export const useSocketListeners = () => {
  const dispatch = useDispatch();
  const { userInfo, orderDetailsById } = useSelector((state) => state.user);
  const trackedOrderId = orderDetailsById?._id || orderDetailsById?.id || null;

  useEffect(() => {
    if (!userInfo) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket();

    const refreshUserOrders = () => {
      if (userInfo.role !== "user") return;
      fetchWithDispatch(`${BASE_URL}/api/order/my-orders`, (data) => {
        dispatch(setMyOrders(data.data || data.orders || []));
      });
    };

    const refreshOwnerOrders = () => {
      if (userInfo.role !== "owner") return;
      fetchWithDispatch(`${BASE_URL}/api/order/owner-orders`, (data) => {
        dispatch(setOwnerOrders(data.orders || []));
      });
    };

    const refreshCurrentOrders = () => {
      if (userInfo.role !== "deliveryBoy") return;
      fetchWithDispatch(`${BASE_URL}/api/order/current-order`, (data) => {
        dispatch(setCurrentOrders(data.data || null));
      });
    };

    const refreshOrderDetails = (orderId) => {
      if (!orderId || trackedOrderId !== orderId) return;
      fetchWithDispatch(`${BASE_URL}/api/order/get-order-by-id/${orderId}`, (data) => {
        dispatch(setOrderDetailsById(data.data || {}));
      });
    };

    const handleOrdersRefresh = (payload = {}) => {
      const { scope, orderId, ownerId, userId } = payload;
      const currentUserId = userInfo?._id;
      if (scope === "user") {
        if (!userId || userId === currentUserId) {
          refreshUserOrders();
        }
      }
      if (scope === "owner") {
        if (!ownerId || ownerId === currentUserId) {
          refreshOwnerOrders();
        }
      }
      if (scope === "delivery") refreshCurrentOrders();
      if (orderId) refreshOrderDetails(orderId);
    };

    const handleOrderStatus = (payload = {}) => {
      if (payload.message && ["user", "owner", "deliveryBoy"].includes(userInfo.role)) {
        toast.success(payload.message, { id: `order-status-${payload.orderId}-${payload.shopOrderId}` });
      }
      refreshOrderDetails(payload.orderId);
      if (userInfo.role === "user") {
        if (!payload.userId || payload.userId === currentUserId) {
          refreshUserOrders();
        }
      }
      if (userInfo.role === "owner") {
        if (!payload.ownerId || payload.ownerId === currentUserId) {
          refreshOwnerOrders();
        }
      }
      if (userInfo.role === "deliveryBoy") refreshCurrentOrders();
    };

    const handleDeliveryAssignment = (payload = {}) => {
      if (userInfo.role !== "deliveryBoy") return;
      toast.success("New delivery assignment available", { id: `assignment-${payload.assignmentId}` });
      refreshCurrentOrders();
    };

    const handleAssignmentClosed = (payload = {}) => {
      if (userInfo.role !== "deliveryBoy") return;
      toast.dismiss(`assignment-${payload.assignmentId}`);
      refreshCurrentOrders();
    };

    const handleDeliveryLocation = (payload = {}) => {
      dispatch(updateOrderTrackingLocation(payload));
    };

    socket.on("orders:refresh", handleOrdersRefresh);
    socket.on("order:status", handleOrderStatus);
    socket.on("delivery:assignment", handleDeliveryAssignment);
    socket.on("delivery:assignment-closed", handleAssignmentClosed);
    socket.on("delivery:location", handleDeliveryLocation);

    return () => {
      socket.off("orders:refresh", handleOrdersRefresh);
      socket.off("order:status", handleOrderStatus);
      socket.off("delivery:assignment", handleDeliveryAssignment);
      socket.off("delivery:assignment-closed", handleAssignmentClosed);
      socket.off("delivery:location", handleDeliveryLocation);
    };
  }, [dispatch, trackedOrderId, userInfo]);
};
