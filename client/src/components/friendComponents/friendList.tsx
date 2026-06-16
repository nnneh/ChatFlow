"use client";
import React from "react";

interface Friend {
  _id: string;
  username: string;
  avatar?: string;
}

interface FriendListProps {
  friends: Friend[];
  onClickFriend: (friend: Friend, chatId: string) => void;
  chattingFriend: Friend | null;
  searchFriend?: string;
  activeTab: "friends" | "sent" | "received";
  sentRequests: any[];
  receivedRequests: any[];
  selectedFriendId?: string;
  isLoading: boolean;
}

const FriendList: React.FC<FriendListProps> = ({ 
  friends = [], 
  onClickFriend, 
  chattingFriend, 
  searchFriend = "",
  activeTab,
  sentRequests = [],
  receivedRequests = []
}) => {

  // Dynamic selector depending on the current active navigation context tab
  if (activeTab === "sent") {
    return (
      <div className="p-2 space-y-2">
        {sentRequests.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No sent requests</p>
        ) : (
          sentRequests.map((req) => (
            <div key={req.requestId} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {req.receiver?.username?.substring(0,2).toUpperCase()}
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">{req.receiver?.username}</p>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-md shrink-0">Pending</span>
            </div>
          ))
        )}
      </div>
    );
  }

  if (activeTab === "received") {
    return (
      <div className="p-2 space-y-2">
        {receivedRequests.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No received requests</p>
        ) : (
          receivedRequests.map((req) => (
            <div key={req.requestId} className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {req.sender?.username?.substring(0,2).toUpperCase()}
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">{req.sender?.username}</p>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-md shrink-0">Inbound</span>
            </div>
          ))
        )}
      </div>
    );
  }

  // Fallback context default view: Standard Active Friends Array Data Mapping list
  const filteredFriends = friends.filter((friend) =>
    friend?.username?.toLowerCase().includes(searchFriend.toLowerCase())
  );

  return (
    <div className="p-2 space-y-1">
      {filteredFriends.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">No friends found</p>
      ) : (
        filteredFriends.map((friend) => {
          const isActive = chattingFriend?._id === friend._id;
          return (
            <div
              key={friend._id}
              onClick={() => onClickFriend(friend, friend._id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isActive 
                  ? "bg-pink-600/10 border border-pink-500/20 text-slate-800" 
                  : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 bg-slate-200 text-slate-700">
                {friend.avatar ? friend.avatar.substring(0, 2).toUpperCase() : friend.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm truncate font-medium">{friend.username}</h2>
                <p className="text-xs text-slate-400 truncate mt-0.5">Click to open chat</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendList;