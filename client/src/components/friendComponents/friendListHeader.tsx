"use client";
import React from "react";
import { SearchIcon, PlusIcon, Users, Clock, Inbox } from "lucide-react";

interface FriendListHeaderProps {
  setSearchFriend: (value: string) => void;
  headerName?: string;
  activeTab: "friends" | "sent" | "received";
  setActiveTab: (tab: "friends" | "sent" | "received") => void;
  sentCount?: number;
  receivedCount?: number;
  onAddFriend?: () => void;
}

const FriendListHeader: React.FC<FriendListHeaderProps> = ({
  setSearchFriend,
  headerName,
  activeTab,
  setActiveTab,
  sentCount = 0,
  receivedCount = 0,
  onAddFriend,
}) => {
  return (
    <div className="p-4 border-b border-pink-100/60 bg-white/50 backdrop-blur-sm">
      {/* Title row */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {headerName || "ChatFlow"}
        </h1>
        <button
          onClick={onAddFriend}
          className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition"
          title="Add Friend"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="relative flex items-center bg-white border border-pink-100 rounded-xl px-3 py-2 mb-3 focus-within:border-pink-300 transition">
        <SearchIcon className="h-4 w-4 text-pink-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search friends..."
          onChange={(e) => setSearchFriend(e.target.value)}
          className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400 text-slate-700 focus:ring-0"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
        {[
          { key: "friends" as const, icon: <Users className="w-3 h-3" />, label: "Friends", count: null },
          { key: "sent" as const, icon: <Clock className="w-3 h-3" />, label: "Sent", count: sentCount },
          { key: "received" as const, icon: <Inbox className="w-3 h-3" />, label: "Recv", count: receivedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg transition relative ${
              activeTab === tab.key
                ? "bg-white text-pink-600 shadow-sm"
                : "hover:text-slate-800"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendListHeader;