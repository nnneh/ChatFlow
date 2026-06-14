"use client";
import React from "react";
import { SearchIcon } from "lucide-react";

interface FriendListHeaderProps {
  setSearchFriend: (value: string) => void;
  headerName?: string;
}

const FriendListHeader: React.FC<FriendListHeaderProps> = ({ setSearchFriend, headerName }) => {
  return (
    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
      <h1 className="text-xl font-bold tracking-tight mb-3 text-slate-100">
        {headerName || "Messages"}
      </h1>
      <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition">
        <SearchIcon className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search friends..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFriend(e.target.value)}
          className="w-full bg-transparent border-0 outline-none p-0 text-sm placeholder:text-slate-600 text-slate-200 focus:ring-0"
        />
      </div>
    </div>
  );
};

export default FriendListHeader;