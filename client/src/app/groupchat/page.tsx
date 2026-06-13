"use client";
import React, { useState } from "react";
import GroupChat from "@/src/components/groupComponents/groupChat";
import GroupList from "@/src/components/groupComponents/groupList";
import GroupListHeader from "@/src/components/groupComponents/groupListHeader";

// 1. Define the Group shape to match your backend model structure
interface GroupType {
  _id: string;
  groupName: string;
}

const Group = () => {
  // 2. Type your state hooks properly (it can be a GroupType object or null)
  const [selectGroup, setSelectGroup] = useState<GroupType | null>(null);
  const [searchGroup, setSearchGroup] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);

  // 3. Explicitly type your callback parameters to crush the implicit 'any' error
  function handleGroupSelect(group: GroupType, selectedChatId: string): void {
    setSelectGroup(group);
    setChatId(selectedChatId);
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      <div className="flex flex-col w-full md:w-80 border-r border-slate-800 h-full shrink-0">
        <GroupListHeader setSearchGroup={setSearchGroup} />
        <div className="flex-1 overflow-y-auto">
          <GroupList
            handleGroupSelect={handleGroupSelect}
            searchGroup={searchGroup}
            selectGroup={selectGroup}
          />
        </div>
      </div>

      <div className="hidden md:flex flex-1 h-full">
        {selectGroup && chatId ? (
          <GroupChat group={selectGroup} currentUserId="my-user-id" />
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-500 bg-slate-950">
            Select a group conversation room to read logs
          </div>
        )}
      </div>

    </div>
  );
};

export default Group;