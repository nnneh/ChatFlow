"use client";
import React, { useState } from "react";
import GroupChat from "@/components/groupComponents/groupChat";
import GroupList from "@/components/groupComponents/groupList";
import GroupListHeader from "@/components/groupComponents/groupListHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Toaster } from "react-hot-toast";

interface GroupType {
  _id: string;
  groupName: string;
}

const Group = () => {
  const [selectGroup, setSelectGroup] = useState<GroupType | null>(null);
  const [searchGroup, setSearchGroup] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);

  // ✅ Pull real user from Redux
  const currentUser = useSelector((state: RootState) => state.user?.userInfo);

  function handleGroupSelect(group: GroupType, selectedChatId: string): void {
    setSelectGroup(group);
    setChatId(selectedChatId);
  }

  return (
    // ✅ Replace the dark bg-slate-950 wrapper with the same gradient as chat page
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 flex items-center justify-center p-0 sm:p-4">
      <Toaster position="top-center" />
      <div className="relative w-full max-w-7xl h-screen sm:h-[calc(100vh-2rem)] bg-white/60 backdrop-blur-2xl sm:rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex">

        {/* Sidebar */}
        <div className="flex flex-col w-full md:w-80 lg:w-96 h-full border-r border-pink-100/40 bg-white/40 shrink-0">
          <GroupListHeader setSearchGroup={setSearchGroup} headerName="Groups" />
          <div className="flex-1 overflow-y-auto">
            <GroupList
              handleGroupSelect={handleGroupSelect}
              searchGroup={searchGroup}
              selectGroup={selectGroup}
            />
          </div>
        </div>

        {/* Main area */}
        <div className="hidden md:flex flex-1 h-full">
          {selectGroup && chatId ? (
            <GroupChat
              group={selectGroup}
              chatId={chatId}
              currentUserId={currentUser?._id || ""}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 flex items-center justify-center text-4xl mb-4 shadow-inner">
                👥
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-1">Group Chats</h2>
              <p className="text-xs text-slate-400 max-w-xs">
                Select a group or create a new one to start chatting.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Group;