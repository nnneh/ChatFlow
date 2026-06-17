"use client";
import socket from "@/lib/socket";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userObj = useSelector((state: RootState) => state.user?.userInfo);
  const userId = userObj?._id;

  // ✅ Redirect to login if no user in persisted state
  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId]);

  // ✅ Socket setup — only runs when userId is available
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();
    socket.emit("login", userId);

    const handleConnect = () => socket.emit("login", userId);
    const handleConnectError = (err: Error) =>
      console.error("Socket connection failed:", err.message);

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [userId]);

  if (!userId) return null; // PersistGate handles the loading UI

  return <div className="w-full min-h-screen">{children}</div>;
};

export default Layout;