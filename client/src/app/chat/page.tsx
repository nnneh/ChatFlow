"use client";
import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import FriendChat from "@/src/components/friendComponents/individualChat";
import FriendList from "@/src/components/friendComponents/friendList";
import FriendListHeader from "@/src/components/friendComponents/friendListHeader";


const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchFriend, setSearchFriend] = useState("");
  const [chatId, setChatId] = useState("");

  const handleFriendClick = (friend, id) => {
    setSelectedFriend(friend);
    setChatId(id);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      <div className="flex flex-col w-full md:w-80 border-r border-slate-800 h-full">
        <FriendListHeader 
          setSearchFriend={setSearchFriend} 
          headerName="Friends" 
        />
        <div className="flex-1 overflow-y-auto">
          <FriendList
            onClickFriend={handleFriendClick}
            chattingFriend={selectedFriend}
            searchFriend={searchFriend}
            openChat={chatId}
          />
        </div>
      </div>

      <div className="hidden md:flex flex-1 h-full">
        {selectedFriend ? (
          <FriendChat friend={selectedFriend} chatId={chatId} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-500">
            Select a friend to start chatting
          </div>
        )}
      </div>

      {selectedFriend && (
        <div className="fixed inset-0 z-50 bg-slate-950 md:hidden flex flex-col h-full w-full">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <button 
              onClick={() => setSelectedFriend(null)} 
              className="p-2 hover:bg-slate-800 rounded-full transition"
            >
              <ArrowLeftIcon className="h-5 w-5 text-slate-400" />
            </button>
            <span className="font-medium">{selectedFriend.username}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <FriendChat friend={selectedFriend} chatId={chatId} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;