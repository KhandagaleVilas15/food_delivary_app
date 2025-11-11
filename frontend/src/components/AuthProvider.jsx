import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateAuth, setupAxiosInterceptors } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
    const [isValidating, setIsValidating] = useState(true);
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            // Only validate if we have user info in Redux but no valid token
            if (userInfo) {
                console.log('Validating authentication...');
                const isValid = await validateAuth(dispatch);
                if (!isValid) {
                    console.log('Authentication invalid, clearing user data');
                }
            }
            setIsValidating(false);
        };

        // Setup axios interceptors for automatic logout on 401
        setupAxiosInterceptors(dispatch, navigate);
        
        // Check authentication
        checkAuth();
    }, [userInfo, dispatch, navigate]);

    // Show loading while validating
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-[#ff4d2d] mb-4">Vingo</div>
                    <div className="text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthProvider;