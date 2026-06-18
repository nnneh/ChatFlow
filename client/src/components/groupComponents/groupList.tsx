"use client";
import React, { useEffect, useState, useCallback } from "react";
import { UsersIcon } from "lucide-react";
import toast from "react-hot-toast";

interface GroupType {
  _id: string;
  groupName: string;
}

interface GroupListProps {
  handleGroupSelect: (group: GroupType, chatId: string) => void;
  selectGroup: GroupType | null;
  searchGroup: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const GroupList: React.FC<GroupListProps> = ({
  handleGroupSelect,
  selectGroup,
  searchGroup,
}) => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/myGroups`, {
        credentials: "include",
      });

      if (res.status === 404) {
        setGroups([]);
        return;
      }

      const data = await res.json();
      setGroups(data.groups || []);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchGroup.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {filteredGroups.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-6">
          No groups found. Create one!
        </p>
      ) : (
        filteredGroups.map((group) => {
          const isActive = selectGroup?._id === group._id;
          return (
            <div
              key={group._id}
              onClick={() => handleGroupSelect(group, group._id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isActive
                  ? "bg-pink-600/10 border border-pink-500/20 text-slate-800"
                  : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm ${
                  isActive
                    ? "bg-gradient-to-br from-pink-200 to-purple-300 text-purple-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <UsersIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-sm truncate ${
                    isActive
                      ? "font-semibold text-slate-800"
                      : "font-medium text-slate-700"
                  }`}
                >
                  {group.groupName}
                </h2>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  Click to open group
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GroupList;