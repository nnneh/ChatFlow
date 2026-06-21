"use client";
import React, { useState, useEffect } from "react";
import { SearchIcon, PlusIcon, ChevronDownIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Friend {
  _id: string;
  username: string;
}

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
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // ✅ Fetch friends list for member selection
  useEffect(() => {
    if (!showModal) return;
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API}/friend`, { credentials: "include" });
        const data = await res.json();
        setFriends(data.Friends || []);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };
    fetchFriends();
  }, [showModal]);

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (selectedFriends.length < 2) {
      toast.error("Select at least 2 friends to create a group");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch(`${API}/makeGroup`, { // ✅ no prefix needed
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName.trim(), members: selectedFriends }),
      });

      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to create group"); return; }

      toast.success(data.message || "Group created!");
      setShowModal(false);
      setGroupName("");
      setSelectedFriends([]);
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

      {/* ✅ Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Create Group</h2>

            {/* Group name input */}
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name..."
              className="w-full px-4 py-2.5 rounded-2xl bg-pink-50/60 border border-pink-100 text-slate-700 outline-none text-sm"
            />

            {/* Friend selector */}
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Select members (min 2)
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {friends.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No friends found
                  </p>
                ) : (
                  friends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend._id);
                    return (
                      <div
                        key={friend._id}
                        onClick={() => toggleFriend(friend._id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition ${
                          isSelected
                            ? "bg-pink-50 border border-pink-200"
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-xs font-bold text-purple-700 shrink-0">
                          {friend.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-700 flex-1">
                          {friend.username}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center">
                            <span className="text-white text-[10px]">✓</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setShowModal(false); setGroupName(""); setSelectedFriends([]); }}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={isCreating}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupListHeader;