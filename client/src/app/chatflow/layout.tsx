"use client";
import socket from "@/lib/socket";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => {
  const user = useSelector((state: any) => state.userInfo?.userInfo || null);

  useEffect(() => {
    if (!user || !user._id) return;

    if (socket.connected) {
      socket.emit("login", user._id);
    }

    const handleConnect = () => {
      if (user && user._id) {
        socket.emit("login", user._id);
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50">
      {children}
    </div>
  );
};

export default Layout;