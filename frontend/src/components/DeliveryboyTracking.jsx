import React from "react";
import Scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer,Popup, Polygon } from "react-leaflet";

const deliveryIcon = L.icon({
  iconUrl: Scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customHomeIcon = L.icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const DeliveryboyTracking = ({ data }) => {
  console.log("DeliveryboyTracking data:", data);
  const deliveryboyLat = data?.deliveryBoyLocation?.lat;
  const deliveryboyLong = data?.deliveryBoyLocation?.long;
  const customerLat = data?.customerLocation?.lat;
  const customerLong = data?.customerLocation?.long;


  // Early return if required data is missing
  if (!deliveryboyLat || !deliveryboyLong || !customerLat || !customerLong) {
    return (
      <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden border shadow-md flex items-center justify-center">
        <p className="text-gray-500">Loading location data...</p>
      </div>
    );
  }

  const path = [
    [deliveryboyLat, deliveryboyLong],
    [customerLat, customerLong],
  ];

  const center = [deliveryboyLat, deliveryboyLong];
  return (
    <div className="w-full h-[400px] mt-3 rounded-xl overflow-hidden border shadow-md">
      <MapContainer
        className="w-full h-full"
        center={center}
        zoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[deliveryboyLat, deliveryboyLong]}
          icon={deliveryIcon}
        >
          <Popup>Delivery Boy</Popup>
        </Marker>
        <Marker
          position={[customerLat, customerLong]}
          icon={customHomeIcon}
        >
          <Popup>Customer Location</Popup>
        </Marker>

        <Polygon positions={path} color="orange" />

      </MapContainer>
    </div>
  );
};

export default DeliveryboyTracking;
