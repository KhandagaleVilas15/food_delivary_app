import axios from "axios";
import { useDispatch } from "react-redux";
import { setCity, setCurrentAddress, setState } from "../redux/slices/userSlice";
import { useEffect, useCallback } from "react";
import { setAddress, setLocation } from "../redux/slices/mapSlice";

export const useGetCity = () => {
    const dispatch = useDispatch();
    
    const fetchCityFromLocation = useCallback(async (latitude, longitude) => {
        try {
            const { data } = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
            );
            console.log("Geocoding response:", data.features[0]?.properties);
            
            if (data.features && data.features.length > 0) {
                const properties = data.features[0].properties;
                const city = properties.city;
                const state = properties.state;
                const currentAddress = properties.address_line1;
                
                console.log("City:", city);
                dispatch(setCity(city));
                dispatch(setState(state));
                dispatch(setCurrentAddress(currentAddress));
                dispatch(setLocation({ lat: latitude, lon: longitude }));
                dispatch(setAddress(properties.address_line2));
            }
        } catch (error) {
            console.error("Error fetching city from coordinates:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Current position:", position);
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchCityFromLocation(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, [fetchCityFromLocation]);

    return fetchCityFromLocation;
}