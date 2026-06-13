"use client";
import React from "react";
import { UsersIcon } from "lucide-react";

const GroupList = ({ onClickGroup, activeGroup, searchGroup }) => {
  // Mock array mapping directly to your myGroups output formatting
  const mockGroups = [
    { _id: "g1", groupName: "Dev Team Alpha" },
    { _id: "g2", groupName: "Design Sync" },
    { _id: "g3", groupName: "Project Handover" }
  ];

  const filteredGroups = mockGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchGroup.toLowerCase())
  );

  return (
    <div className="p-2 space-y-1">
      {filteredGroups.length === 0 ? (
        <p className="text-xs text-slate-600 text-center py-4">No groups found</p>
      ) : (
        filteredGroups.map((group) => {
          const isActive = activeGroup?._id === group._id;

          return (
            <div
              key={group._id}
              onClick={() => onClickGroup(group)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                isActive
                  ? "bg-indigo-600/10 border border-indigo-500/20 text-slate-100"
                  : "hover:bg-slate-900/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              {/* Group Graphic Icon Identifier */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                <UsersIcon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className={`text-sm truncate ${isActive ? "font-semibold text-slate-100" : "font-medium"}`}>
                  {group.groupName}
                </h2>
                <p className="text-xs text-slate-500 truncate mt-0.5">Tap to enter chat room</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GroupList;