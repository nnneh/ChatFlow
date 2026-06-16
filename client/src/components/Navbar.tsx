"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Search } from "lucide-react";
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
import { removeGroupList } from "@/lib/redux/features/groupSlice";
import NotificationPopUp from "./NotificationPopUp";
// ✅ Import this action — adjust the path to wherever it lives in your slices
import { updateFriendOnlineStatus } from "@/lib/redux/features/friendListSlice";

// ✅ Define your RootState type (or import from your store file)
interface RootState {
  userInfo: {
    userInfo: {
      _id: string;
      username: string;
      email: string;
      avatar?: string;
    } | null;
  };
}

const NavBar = () => {
  // ✅ Fix 1: typed selector
  const userInfo = useSelector((state: RootState) => state.userInfo.userInfo);
  const dispatch = useDispatch();

  // ✅ Fix 2: properly typed socket state
  const [socket, setSocket] = useState<Socket | null>(null);

  const navItems = [
    {
      path: "/chatflow/chat",
      icon: <HiMiniChatBubbleBottomCenter size={25} />,
      name: "chat",
    },
    { path: "/chatflow/group", icon: <FaUserGroup size={25} />, name: "group" },
    { path: "/chatflow/search", icon: <Search size={25} />, name: "search" },
  ];

  const pathName = usePathname();
  const router = useRouter();

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

    // ✅ Fix 3: return cleanup as void, not the socket
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // ✅ Fix 4: typed userId param (updateFriendOnlineStatus must be imported)
      socket.on("user-offline", (userId: string) => {
        dispatch(updateFriendOnlineStatus({ userId, isOnline: false }));
      });

      // ✅ Fix 5: typed data param
      socket.on("new-friend-request", (data: any[]) => {
        const d = data[0];
        if (d.receiver === userInfo?._id) {
          console.log("receiver end");
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
      if (socket) {
        socket.emit("logout", userInfo?._id);
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data?.message);
        router.push("/login");
        dispatch(removeUserInfo());
        dispatch(removeFriendList());
        dispatch(removeGroupList());
        dispatch(removeWhileLogout());
      }
    } catch (error) {
      // ✅ Fix 6: narrow 'unknown' error type
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        console.log(error);
        if (error.response?.status === 500) {
          toast.error(message);
        }
        if (error.response?.status === 401) {
          console.log(message);
          toast.error(message);
        }
      }
    }
  };

  return (
    <div className="h-screen z-999 w-20 bg-gray-900 text-white flex flex-col justify-between items-center py-4 border-r-2 border-gray-700">
      <div className="flex flex-col gap-2">
        {navItems.map((nav, id) => (
          <Link
            key={id}
            href={nav.path}
            className={`p-3 rounded-md flex justify-center items-center transition-all relative ${
              pathName === nav.path
                ? "bg-gray-700 text-purple-500"
                : "text-gray-300 hover:bg-gray-700 hover:text-slate-300"
            }`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="relative">{nav.icon}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{nav.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        ))}
        <div className="flex justify-center p-3 rounded-md hover:bg-gray-700 hover:text-slate-300">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="inline-flex">
                  <NotificationPopUp />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 items-center">
        {/* ✅ Fix 7: removed invalid className prop from Popover */}
        <Popover>
          <PopoverTrigger asChild>
            {userInfo?.avatar ? (
              <Image
                src={userInfo.avatar}
                height={64}
                width={64}
                alt="Profile_Image"
                className="h-16 w-16 rounded-full border-2 border-purple-300"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-2 border-purple-300">
                🦝
              </div>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-900 border border-white">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-slate-200">
                  {userInfo?.username}
                </h4>
                <p className="text-sm text-zinc-400">{userInfo?.email}</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-1 w-fit">
                  <UpdateInfo />
                  <Button
                    onClick={handleLogout}
                    className="bg-indigo-950 text-slate-100 outline-none hover:text-slate-200 hover:bg-indigo-950"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NavBar;