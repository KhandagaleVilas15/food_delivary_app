import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { setAvailableBoys, setAvailableBoysLoading, setAvailableBoysError } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

// Use inside a component: useGetAvailableDeliveryBoys();
// It will fetch once on mount and whenever location changes.
export const useGetAvailableDeliveryBoys = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state) => state.map || {});

  const fetchAvailableDeliveryBoys = useCallback(async () => {
    if (!location?.lat || !location?.lon) {
      dispatch(setAvailableBoys([]));
      dispatch(setAvailableBoysError("Location not available"));
      return;
    }

    try {
      dispatch(setAvailableBoysLoading(true));
      dispatch(setAvailableBoysError(null));
      
      const { data } = await axios.get(
        `${BASE_URL}/api/user/available-delivery-boys?latitude=${location.lat}&longitude=${location.lon}`,
        {
          withCredentials: true,
        }
      );
      
      if (data?.success) {
        dispatch(setAvailableBoys(data.data || []));
      } else {
        const errorMsg = data?.message || "No delivery boys available in your area";
        console.log("Failed to fetch delivery boys:", errorMsg);
        dispatch(setAvailableBoysError(errorMsg));
        dispatch(setAvailableBoys([]));
      }
    } catch (error) {
      console.error("Error fetching available delivery boys:", error);
      const errorMsg = error.response?.data?.message || error.message || "Network error while fetching delivery boys";
      dispatch(setAvailableBoysError(errorMsg));
      dispatch(setAvailableBoys([]));
    } finally {
      dispatch(setAvailableBoysLoading(false));
    }
  }, [dispatch, location?.lat, location?.lon]);

  useEffect(() => {
    fetchAvailableDeliveryBoys();
  }, [fetchAvailableDeliveryBoys]);

  return fetchAvailableDeliveryBoys;
};
