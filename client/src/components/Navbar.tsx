"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiMiniChatBubbleBottomCenter } from "react-icons/hi2";
import { FaUserGroup } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import UpdateInfo from "./UpdateInfo";
import { removeUserInfo } from "@/lib/redux/features/userSlice";
import {
  addFriendRequestDetails,
  removeWhileLogout,
  setFriendRequestDetails,
} from "@/lib/redux/features/friendRequestSlice";
import { io, Socket } from "socket.io-client";
import { removeFriendList } from "@/lib/redux/features/friendListSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search as SearchIcon } from "lucide-react";
import { removeGroupList } from "@/lib/redux/features/groupSlice";
import NotificationPopUp from "./NotificationPopUp";
import { updateFriendOnlineStatus } from "@/lib/redux/features/friendListSlice";
import Chat from "@/app/chatflow/chat/page";
import Group from "@/app/chatflow/groupchat/page";
import Search from "@/app/chatflow/searchBox/page";
import { RootState } from "@/lib/redux/store";

type ActiveSection = "chat" | "group" | "search";

const NavBar = () => {
  const userInfo = useSelector((state: RootState) => state.user?.userInfo);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("chat");

  const navItems: { key: ActiveSection; icon: React.ReactNode; label: string }[] = [
    { key: "chat",   icon: <HiMiniChatBubbleBottomCenter size={22} />, label: "Chats" },
    { key: "group",  icon: <FaUserGroup size={20} />,                  label: "Groups" },
    { key: "search", icon: <SearchIcon size={20} />,                   label: "Search" },
  ];

  useEffect(() => {
    const getAllRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/request/allrequest`,
          { withCredentials: true }
        );
        dispatch(setFriendRequestDetails(res.data.request));
      } catch (error) {
        console.log(error);
      }
    };
    getAllRequest();
  }, []);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("user-offline", (userId: string) => {
        dispatch(updateFriendOnlineStatus({ userId, isOnline: false }));
      });
      socket.on("new-friend-request", (data: any[]) => {
        const d = data[0];
        if (d.receiver === userInfo?._id) {
          dispatch(addFriendRequestDetails(d));
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("user-offline");
        socket.off("new-friend-request");
      }
    };
  }, [socket, userInfo?._id]);

  const handleLogout = async () => {
    try {
      if (socket) socket.emit("logout", userInfo?._id);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data?.message);
        dispatch(removeUserInfo());
        dispatch(removeFriendList());
        dispatch(removeGroupList());
        dispatch(removeWhileLogout());
        window.location.href = "/login";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50">

      {/* ── Sidebar ── */}
      <div className="h-screen w-16 bg-white/70 backdrop-blur-xl flex flex-col justify-between items-center py-4 border-r border-pink-100/60 shrink-0 shadow-sm">

        {/* Top: logo + nav icons */}
        <div className="flex flex-col items-center gap-1">

          {/* Logo mark */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4 shadow-md shrink-0">
            {/* <span className="text-white text-xs font-bold tracking-tight">CF</span> */}
            <Image className="object-contain" src="/Pastel Chatflow Logo.png" alt="Logo" width={120} height={120} priority />
          </div>

          {/* Nav buttons */}
          {navItems.map((nav) => (
            <button
              key={nav.key}
              onClick={() => setActiveSection(nav.key)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeSection === nav.key
                  ? "bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 shadow-sm"
                  : "text-slate-400 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center">
                      {nav.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{nav.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          ))}

          {/* Notifications */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center justify-center">
                    <NotificationPopUp />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Bottom: avatar + logout */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <Popover>
            <PopoverTrigger asChild>
              {userInfo?.avatar ? (
                <Image
                  src={userInfo.avatar}
                  height={44}
                  width={44}
                  alt="Profile_Image"
                  className="h-11 w-11 rounded-xl border-2 border-pink-200 cursor-pointer object-cover hover:border-pink-400 transition-all duration-200 shadow-sm"
                />
              ) : (
                <div className="h-11 w-11 rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-all duration-200 text-lg shadow-sm">
                  🦝
                </div>
              )}
            </PopoverTrigger>

            {/* ── Profile popover ── */}
            <PopoverContent
              side="right"
              className="w-72 bg-white/90 backdrop-blur-xl border border-pink-100 rounded-2xl shadow-xl p-0 overflow-hidden"
            >
              {/* Popover header */}
              <div className="h-16 bg-gradient-to-r from-pink-200 via-purple-200 to-emerald-200" />
              <div className="px-4 pb-4 -mt-6">
                {userInfo?.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    height={48}
                    width={48}
                    alt="avatar"
                    className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl border-2 border-white bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-lg shadow-md">
                    🦝
                  </div>
                )}
                <div className="mt-2 space-y-0.5">
                  <h4 className="font-semibold text-slate-800 text-sm">
                    {userInfo?.username}
                  </h4>
                  <p className="text-xs text-slate-400">{userInfo?.email}</p>
                </div>

                <div className="mt-3 space-y-2">
                  <UpdateInfo />
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:text-red-600 rounded-xl text-sm font-medium shadow-none transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 overflow-hidden">
        {activeSection === "chat"   && <Chat />}
        {activeSection === "group"  && <Group />}
        {/* {activeSection === "search" && <Search />} */}
      </div>
    </div>
  );
};

export default NavBar;