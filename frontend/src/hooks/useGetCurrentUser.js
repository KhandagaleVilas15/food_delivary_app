import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";
import { setUserData } from "../redux/slices/userSlice";
import { BASE_URL } from "../config/constant";

export const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    
    const fetchCurrentUser = useCallback(async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/user/current-user`, { withCredentials: true });
            if (data.success) {
                dispatch(setUserData(data.user));
            } else {
                console.log("Failed to fetch current user:", data.message);
                dispatch(setUserData(null));
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
            dispatch(setUserData(null));
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return fetchCurrentUser;
}