
import { createSlice } from "@reduxjs/toolkit";

// Get user from localStorage if it exists
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('userInfo');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

const toIdString = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (value._id && typeof value._id.toString === "function") {
        return value._id.toString();
    }
    if (typeof value.toString === "function") {
        return value.toString();
    }
    return null;
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: getUserFromStorage(),         // Initialize from localStorage
        city: "",
        state: "",
        currentAddress: "",
        itemsByCity: [],
        cartItems: [],
        myOrders: [],
        ownerOrders: [],
        availableBoys: [],
        currentOrders: [],
        orderDetailsById:null,
        totalAmount: 0,
        // Loading states
        loading: false,
        itemsLoading: false,
        ordersLoading: false,
        ownerOrdersLoading: false,
        currentOrdersLoading: false,
        availableBoysLoading: false,
        orderDetailsByIdLoading: false,
        // Error states
        error: null,
        itemsError: null,
        ordersError: null,
        ownerOrdersError: null,
        currentOrdersError: null,
        availableBoysError: null,
        orderDetailsByIdError: null,
    },  
    reducers: {
        setUserData: (state, action) => {
            state.userInfo = action.payload;
            if (action.payload) {
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('userInfo');
            }
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setState: (state, action) => {
            state.state = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setItemsByCity: (state, action) => {
            state.itemsByCity = action.payload;
        },
        setCartItems: (state, action) => {
            const cartItem = action.payload; 
            const existing = state.cartItems.find(item => item.id === cartItem.id);
            if(existing){
                existing.quantity+=cartItem.quantity;
            }else{
                state.cartItems.push(cartItem);
            }
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        updateQuantity:(state,action)=>{
            const {id, quantity} = action.payload;
            const existing = state.cartItems.find(item => item.id === id);
            if(existing){
                existing.quantity = quantity;
            }
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        },
        setAvailableBoys: (state, action) => {
            state.availableBoys = action.payload;
            state.availableBoysLoading = false;
            state.availableBoysError = null;
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter(item => item.id !== id);
            state.totalAmount = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        setCurrentOrders: (state, action) => {
            state.currentOrders = action.payload;
            state.currentOrdersLoading = false;
            state.currentOrdersError = null;
        },
        setOrderDetailsById: (state, action) => {
            state.orderDetailsById = action.payload;
            state.orderDetailsByIdLoading = false;
            state.orderDetailsByIdError = null;
        },
        updateOrderTrackingLocation: (state, action) => {
            const { orderId, shopOrderId, assignmentId, deliveryBoyId, location } = action.payload || {};
            if (!location) return;

            const targetOrderId = toIdString(orderId);
            const targetShopOrderId = toIdString(shopOrderId);
            const targetAssignmentId = toIdString(assignmentId);
            const lat = location.lat;
            const lon = location.long ?? location.lon ?? location.lng;

            if (state.orderDetailsById && targetOrderId) {
                const currentOrderId = toIdString(state.orderDetailsById._id || state.orderDetailsById.id);
                if (currentOrderId === targetOrderId && Array.isArray(state.orderDetailsById.shopOrder)) {
                    const shopOrder = state.orderDetailsById.shopOrder.find((order) => toIdString(order._id) === targetShopOrderId);
                    if (shopOrder) {
                        if (!shopOrder.assignedDeliveryBoy) {
                            shopOrder.assignedDeliveryBoy = {
                                _id: deliveryBoyId,
                                location: { coordinates: [lon, lat] }
                            };
                        } else if (!shopOrder.assignedDeliveryBoy.location) {
                            shopOrder.assignedDeliveryBoy.location = { coordinates: [lon, lat] };
                        } else {
                            shopOrder.assignedDeliveryBoy.location.coordinates = [lon, lat];
                        }
                    }
                }
            }

            if (state.currentOrders && targetAssignmentId) {
                const currentAssignmentId = toIdString(state.currentOrders._id);
                if (currentAssignmentId === targetAssignmentId) {
                    if (!state.currentOrders.deliveryBoyLocation) {
                        state.currentOrders.deliveryBoyLocation = { lat, long: lon };
                    } else {
                        state.currentOrders.deliveryBoyLocation.lat = lat;
                        state.currentOrders.deliveryBoyLocation.long = lon;
                    }
                }
            }
        },
        clearUserData: (state) => {
            state.userInfo = null;
            state.city = "";
            state.state = "";
            state.currentAddress = "";
            state.error = null;
            state.itemsError = null;
            state.ordersError = null;
            state.ownerOrdersError = null;
            state.currentOrdersError = null;
            state.availableBoysError = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('shopInfo');
            localStorage.removeItem('token');
            localStorage.removeItem('authData');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
            state.ordersLoading = false;
            state.ordersError = null;
        },
        setOwnerOrders: (state, action) => {
            state.ownerOrders = action.payload;
            state.ownerOrdersLoading = false;
            state.ownerOrdersError = null;
        },
        // Loading state setters
        setItemsLoading: (state, action) => {
            state.itemsLoading = action.payload;
        },
        setOrdersLoading: (state, action) => {
            state.ordersLoading = action.payload;
        },
        setOwnerOrdersLoading: (state, action) => {
            state.ownerOrdersLoading = action.payload;
        },
        setCurrentOrdersLoading: (state, action) => {
            state.currentOrdersLoading = action.payload;
        },
        setAvailableBoysLoading: (state, action) => {
            state.availableBoysLoading = action.payload;
        },
        setOrderDetailsByIdLoading: (state, action) => {
            state.orderDetailsByIdLoading = action.payload;
        },
        // Error state setters
        setItemsError: (state, action) => {
            state.itemsError = action.payload;
            state.itemsLoading = false;
        },
        setOrdersError: (state, action) => {
            state.ordersError = action.payload;
            state.ordersLoading = false;
        },
        setOwnerOrdersError: (state, action) => {
            state.ownerOrdersError = action.payload;
            state.ownerOrdersLoading = false;
        },
        setCurrentOrdersError: (state, action) => {
            state.currentOrdersError = action.payload;
            state.currentOrdersLoading = false;
        },
        setAvailableBoysError: (state, action) => {
            state.availableBoysError = action.payload;
            state.availableBoysLoading = false;
        },
        setOrderDetailsByIdError: (state, action) => {
            state.orderDetailsByIdError = action.payload;
            state.orderDetailsByIdLoading = false;
        }

    },
    
});

export const { 
    setUserData, setCity, setState, setCurrentAddress, setAvailableBoys, clearUserData, 
    setLoading, setError, setItemsByCity, setCartItems, updateQuantity, removeFromCart, 
    setMyOrders, setOwnerOrders, setCurrentOrders, setOrderDetailsById,
    // Loading states
    setItemsLoading, setOrdersLoading, setOwnerOrdersLoading, setCurrentOrdersLoading, setAvailableBoysLoading, setOrderDetailsByIdLoading,
    // Error states  
    setItemsError, setOrdersError, setOwnerOrdersError, setCurrentOrdersError, setAvailableBoysError, setOrderDetailsByIdError,
    updateOrderTrackingLocation
} = userSlice.actions;
export default userSlice.reducer;