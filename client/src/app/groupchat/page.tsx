"use client";
import GroupChat from "@/src/components/groupComponents/groupChat";
import GroupList from "@/src/components/groupComponents/groupList";
import GroupListHeader from "@/src/components/groupComponents/groupListHeader";
import React, { useState } from "react";

const Group = () => {
  const [selectGroup, setSelectGroup] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [chatId, setChatId] = useState(null);

  function handleGroupSelect(group, chatId) {
    setSelectGroup(group);
    setChatId(chatId);
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col">
        <div className="fixed top-0 z-10">
          <GroupListHeader setSearchGroup={setSearchGroup} />
        </div>
        <div className="mt-[97px] ">
          <GroupList
            handleGroupSelect={handleGroupSelect}
            searchGroup={searchGroup}
            selectGroup={selectGroup}
          />
        </div>
      </div>
      <div className="w-[calc(100vw-464px)] fixed top-0 right-0">
        <GroupChat selectGroup={selectGroup} chatId={chatId} />
      </div>
    </div>
  );
};

export default Group;