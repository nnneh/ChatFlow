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
import type { RootState, AppDispatch } from "@/lib/redux/store";

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
        <button 
          className="relative p-2.5 text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100/80 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200/50"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {requests.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {requests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden p-0">
        <div className="flex flex-col">
          {/* Header with matching pink-purple gradient */}
          <div className="flex items-center justify-between p-4 border-b border-pink-100/60 bg-gradient-to-r from-pink-50 to-purple-50">
            <h3 className="font-bold text-slate-700 text-base">Friend Requests</h3>
            {requests.length > 0 && (
              <span className="text-[11px] bg-pink-100 text-pink-600 font-semibold px-2 py-0.5 rounded-full">
                {requests.length} pending
              </span>
            )}
          </div>

          {/* List Area */}
          <div className="p-3 space-y-1 max-h-[320px] overflow-y-auto">
            {requests.length > 0 ? (
              requests.map(({ sender, requestId }: FriendRequest) => (
                <div
                  key={requestId}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-slate-50 transition duration-200"
                >
                  {/* User Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-sm font-semibold text-purple-700 shrink-0 overflow-hidden relative border border-pink-100">
                      {sender?.avatar ? (
                        <Image
                          src={sender.avatar}
                          fill
                          alt={`${sender.username}'s avatar`}
                          className="object-cover"
                        />
                      ) : (
                        sender?.username?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm font-semibold text-slate-700 truncate">
                        {sender?.username}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {sender?.email}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 items-center shrink-0 ml-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(requestId)}
                      className="h-8 px-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium hover:opacity-90 shadow-sm transition-all flex items-center gap-1 border-0"
                    >
                      <Check size={14} className="stroke-[3]" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDecline(requestId)}
                      className="h-8 w-8 rounded-xl p-0 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                      <RxCross1 size={13} className="stroke-[2.5]" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">
                  No pending requests. All clear! ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopUp;