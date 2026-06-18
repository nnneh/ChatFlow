import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000", {
  withCredentials: true,
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 10000,
  transports: ["polling", "websocket"], // ✅ polling first for handshake
});

export default socket;