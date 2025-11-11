import axios from 'axios';
import { clearUserData } from '../redux/slices/userSlice';
import { BASE_URL } from '../config/constant';

// Function to validate if the user is still authenticated
export const validateAuth = async (dispatch) => {
    try {
        // Make a request to a protected route to check if token is valid
        const response = await axios.get(`${BASE_URL}/api/auth/validate-token`, {
            withCredentials: true
        });
        
        if (response.data.success) {
            return true; // Token is valid
        } else {
            // Token is invalid, clear user data
            dispatch(clearUserData());
            return false;
        }
    } catch (error) {
        console.log('Token validation failed:', error.message);
        // If request fails, assume token is invalid
        dispatch(clearUserData());
        return false;
    }
};

// Axios interceptor to handle 401 responses (unauthorized)
export const setupAxiosInterceptors = (dispatch, navigate) => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token is invalid or expired
                dispatch(clearUserData());
                navigate('/signin');
            }
            return Promise.reject(error);
        }
    );
};