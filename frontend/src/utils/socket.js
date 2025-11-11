import { io } from "socket.io-client";
import { BASE_URL } from "../config/constant";

let socketInstance = null;

const SOCKET_OPTIONS = {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelayMax: 5000,
};

export const connectSocket = () => {
  if (!socketInstance) {
    socketInstance = io(BASE_URL, SOCKET_OPTIONS);
    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error", error.message);
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
};