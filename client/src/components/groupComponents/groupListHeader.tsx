"use client";
import React from "react";
import { SearchIcon, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

interface GroupListHeaderProps {
  setSearchGroup: (value: string) => void;
  headerName?: string;
  onGroupCreated?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const GroupListHeader: React.FC<GroupListHeaderProps> = ({
  setSearchGroup,
  headerName,
  onGroupCreated,
}) => {
  const handleCreateGroup = async () => {
    const name = prompt("Enter group name:");
    if (!name?.trim()) return;

    try {
      const res = await fetch(`${API}/makeGroup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), members: [] }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create group");
        return;
      }

      toast.success(data.message || "Group created!");
      onGroupCreated?.();
    } catch (err) {
      console.error("Create group error:", err);
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="p-4 border-b border-pink-100/40 bg-white/40">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          {headerName || "Groups"}
        </h1>
        <button
          onClick={handleCreateGroup}
          className="p-2 text-pink-500 hover:text-pink-600 bg-pink-50 rounded-xl transition"
          title="Create Group"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="relative flex items-center bg-pink-50/60 border border-pink-100 rounded-2xl px-3 py-2">
        <SearchIcon className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search groups..."
          onChange={(e) => setSearchGroup(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
        />
      </div>
    </div>
  );
};

export default GroupListHeader;