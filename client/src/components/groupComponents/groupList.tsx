"use client";
import React from "react";
import { UsersIcon } from "lucide-react";

// 1. Ensure this matches the interface defined in your parent component
interface GroupType {
  _id: string;
  groupName: string;
}

// 2. Update the interface props to use 'handleGroupSelect' and 'selectGroup'
interface GroupListProps {
  handleGroupSelect: (group: GroupType, chatId: string) => void;
  selectGroup: GroupType | null;
  searchGroup: string;
}

const GroupList: React.FC<GroupListProps> = ({ 
  handleGroupSelect, 
  selectGroup, 
  searchGroup 
}) => {
  
  const mockGroups: GroupType[] = [
    { _id: "g1", groupName: "Dev Team Alpha" },
    { _id: "g2", groupName: "Design Sync" }
  ];

  const filteredGroups = mockGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchGroup.toLowerCase())
  );

  return (
    <div className="p-2 space-y-1">
      {filteredGroups.map((group) => {
        // Use selectGroup instead of activeGroup to match your state variable
        const isActive = selectGroup?._id === group._id;
        
        return (
          <div
            key={group._id}
            onClick={() => handleGroupSelect(group, group._id)} // Pass both group and chatId back
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
              isActive 
                ? "bg-indigo-600/10 border border-indigo-500/20 text-slate-100" 
                : "hover:bg-slate-900/50 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isActive ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
            }`}>
              <UsersIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-sm truncate ${isActive ? "font-semibold text-slate-100" : "font-medium"}`}>
                {group.groupName}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;