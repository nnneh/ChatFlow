import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Bell, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { getFriends } from "@/app/api/getUserDetails";
import { loadUserInfo } from "@/lib/redux/features/userSlice";
import { removeFriendRequestDetails } from "@/lib/redux/features/friendRequestSlice";
import type { RootState, AppDispatch } from "@/lib/redux/store"; // ← import from store

interface Sender {
  avatar: string;
  username: string;
  email: string;
}

interface FriendRequest {
  sender: Sender;
  requestId: string;
}

const NotificationPopUp = () => {
  const requests = useSelector(
    (state: RootState) => state.requestDetails.friendRequestDetails as FriendRequest[]
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleAccept = async (requestId: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/request/acceptRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      if (data) {
        toast.success("Request Accepted");
        getFriends().then((res) => dispatch(loadUserInfo(res)));
        dispatch(removeFriendRequestDetails(requestId));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message);
        toast.error("Error Occurred");
      }
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/request/rejectRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      if (data) {
        toast.success("Request Declined");
        dispatch(removeFriendRequestDetails(requestId));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message);
        toast.error("Error Occurred");
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="relative">
          <Bell
            size={25}
            className="text-zinc-200 transition-all duration-200"
          />
          {requests.length > 0 && (
            <span className="absolute -top-3 -right-1 text-indigo-500 z-10 font-extrabold">
              {requests.length}
            </span>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-gray-900 border-zinc-200">
        <div className="text-slate-50 flex flex-col gap-4">
          <div className="font-semibold text-2xl decoration-1 underline-offset-8 underline">
            Friend Request
          </div>
          {requests.length > 0 ? (
            requests.map(({ sender, requestId }: FriendRequest) => (
              <div
                key={requestId}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <Image
                      src={sender?.avatar}
                      height={50}
                      width={50}
                      alt="Profile_image"
                      className="h-16 w-16 rounded-full border-gray-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium leading-none text-white">
                      {sender?.username}
                    </h4>
                    <p className="text-sm text-zinc-400">{sender?.email}</p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Button
                    onClick={() => handleAccept(requestId)}
                    className="font-extrabold bg-purple-500 text-white hover:bg-purple-600 transition-all duration-300 px-3 py-1 flex items-center justify-center"
                  >
                    <Check size={18} />
                  </Button>
                  <Button
                    onClick={() => handleDecline(requestId)}
                    className="font-extrabold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 px-3 py-1 flex items-center justify-center"
                  >
                    <RxCross1 size={18} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <span>No Request</span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopUp;