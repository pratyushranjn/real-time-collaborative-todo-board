import { io } from "socket.io-client";

const url = 'https://real-time-collabtask.onrender.com'

const socket = io(url, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
