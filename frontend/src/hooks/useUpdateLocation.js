import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../config/constant";




export const useUpdateLocation = () => {
    const {userInfo} = useSelector((state) => state.user);

    useEffect(()=>{
        const updateLocation = async (lat,lon) => {
        try {
            const {data} = await axios.post(`${BASE_URL}/api/user/update-location`, {lat, long: lon}, {withCredentials: true});
            if(data.success){
                console.log("Location updated successfully");
            } else {
                console.log("Failed to update location:", data.message);
            }
        } catch (error) {
            console.error("Error updating location:", error);
        }
    }

    navigator.geolocation.watchPosition((pos)=>{
        updateLocation(pos.coords.latitude, pos.coords.longitude);
    })

    }, [userInfo]);

}