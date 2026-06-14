"use client";
import React from "react";

interface Friend {
  _id: string;
  username: string;
  avatar?: string;
}

interface FriendListProps {
  onClickFriend: (friend: Friend, chatId: string) => void;
  chattingFriend: Friend | null;
  searchFriend: string;
  openChat?: string;
}

const FriendList: React.FC<FriendListProps> = ({ onClickFriend, chattingFriend, searchFriend }) => {
  const mockFriends: Friend[] = [
    { _id: "65a123b45c6d7e8f90111111", username: "Sarah Jenkins", avatar: "SJ" },
    { _id: "65a123b45c6d7e8f90222222", username: "Alex Rivera", avatar: "AR" },
  ];

  const filteredFriends = mockFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchFriend.toLowerCase())
  );

  return (
    <div className="p-2 space-y-1">
      {filteredFriends.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-4">No friends found</p>
      ) : (
        filteredFriends.map((friend) => {
          const isActive = chattingFriend?._id === friend._id;
          return (
            <div
              key={friend._id}
              onClick={() => onClickFriend(friend, friend._id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isActive ? "bg-indigo-600/10 border border-indigo-500/20 text-slate-100" : "hover:bg-slate-900/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"
              }`}>
                {friend.avatar || friend.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className={`text-sm truncate ${isActive ? "font-semibold text-slate-100" : "font-medium"}`}>{friend.username}</h2>
                <p className="text-xs text-slate-500 truncate mt-0.5">Click to open chat</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FriendList;