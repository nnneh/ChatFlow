import React from "react";
import { Button } from "@/components/ui/button";
import { BsFillInfoCircleFill } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { removeFriendFromSocket } from "@/lib/redux/features/friendListSlice";
import { useDispatch } from "react-redux";

// Matches the nested FriendDetails shape inside FriendListItem
interface FriendType {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface UserInfoPopOverProps {
  friend: FriendType;
  chatId: string; // chatId from FriendListItem — used to remove from Redux
}

const UserInfoPopOver: React.FC<UserInfoPopOverProps> = ({ friend, chatId }) => {
  const dispatch = useDispatch();

  const handleRemoveFriend = async (id: string) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/user/remove/${id}`,
        { withCredentials: true }
      );

      if (data) {
        // ✅ Remove by chatId from the friendList in Redux
        // This matches the FriendListItem shape in your slice
        dispatch(removeFriendFromSocket(chatId));
        toast.success("Friend removed successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-gray-800 border-none">
          <span className="text-zinc-200 transition-all duration-200">
            <BsFillInfoCircleFill size={23} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-900 border-purple-500">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Image
                src={friend.avatar || "/fallback-avatar.png"}
                height={50}
                width={50}
                alt="Profile_image"
                className="h-16 w-16 rounded-full border-gray-200"
              />
              <Button
                onClick={() => handleRemoveFriend(chatId)}
                className="bg-red-500 text-slate-100 hover:bg-red-600 transition-colors duration-150"
              >
                Remove
              </Button>
            </div>
            <div className="w-full border"></div>
            <h4 className="font-medium leading-none text-white">
              {friend.username}
            </h4>
            <p className="text-sm text-zinc-400">{friend.email}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserInfoPopOver;