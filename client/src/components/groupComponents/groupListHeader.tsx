"use client";
import React from "react";
import { SearchIcon, UserPlusIcon } from "lucide-react";

const GroupListHeader = ({ setSearchGroup, headerName, onCreateGroupClick }) => {
  return (
    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          {headerName || "Groups"}
        </h1>
        {/* Trigger to open a Create Group Modal window */}
        <button 
          onClick={onCreateGroupClick}
          className="p-2 text-indigo-400 hover:text-indigo-300 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-xl transition"
          title="Create New Group"
        >
          <UserPlusIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition">
        <SearchIcon className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search groups..."
          onChange={(e) => setSearchGroup(e.target.value)}
          className="w-full bg-transparent border-0 outline-none p-0 text-sm placeholder:text-slate-600 text-slate-200 focus:ring-0"
        />
      </div>
    </div>
  );
};

export default GroupListHeader;