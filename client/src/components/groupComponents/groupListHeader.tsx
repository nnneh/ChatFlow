"use client";
import React, { useState, useEffect } from "react";
import { SearchIcon, PlusIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface GroupListHeaderProps {
  setSearchGroup: (value: string) => void;
  headerName?: string;
  onGroupCreated?: () => void;
}

interface User {
  _id: string;
  username: string;
  avatar?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const GroupListHeader: React.FC<GroupListHeaderProps> = ({
  setSearchGroup,
  headerName,
  onGroupCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // ✅ Fetch all users when modal opens
  useEffect(() => {
    if (!showModal) return;
    axios
      .get<{ users: User[] }>(`${API}/user/users`, { withCredentials: true })
      .then((res) => setUsers(res.data.users ?? []))
      .catch(() => toast.error("Failed to load users"));
  }, [showModal]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    // Backend adds current user, so we need at least 2 selected = 3 total
    if (selectedMembers.length < 2) {
      toast.error("Select at least 2 members to create a group");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch(`${API}/group/makeGroup`, { // ✅ correct endpoint
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName.trim(), members: selectedMembers }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create group");
        return;
      }

      toast.success(data.message || "Group created!");
      setShowModal(false);
      setGroupName("");
      setSelectedMembers([]);
      onGroupCreated?.();
    } catch (err) {
      console.error("Create group error:", err);
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="p-4 border-b border-pink-100/40 bg-white/40">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            {headerName || "Groups"}
          </h1>
          <button
            onClick={() => setShowModal(true)}
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

      {/* ── Create Group Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-pink-100/60 bg-gradient-to-r from-pink-50 to-purple-50">
              <h3 className="font-bold text-slate-700 text-lg">Create Group</h3>
              <button
                onClick={() => { setShowModal(false); setGroupName(""); setSelectedMembers([]); }}
                className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Group name input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Study Group"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition"
                />
              </div>

              {/* Member selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Select Members{" "}
                  <span className="text-pink-400 normal-case font-normal">
                    (min 2)
                  </span>
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {users.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Loading users...
                    </p>
                  ) : (
                    users.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => toggleMember(user._id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                          selectedMembers.includes(user._id)
                            ? "bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200"
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-xs font-semibold text-purple-700 shrink-0">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">
                          {user.username}
                        </span>
                        {selectedMembers.includes(user._id) && (
                          <span className="text-pink-500 text-xs font-semibold shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Selected count */}
              {selectedMembers.length > 0 && (
                <p className="text-xs text-slate-400">
                  {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowModal(false); setGroupName(""); setSelectedMembers([]); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={isCreating || !groupName.trim() || selectedMembers.length < 2}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Group 🌸"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupListHeader;