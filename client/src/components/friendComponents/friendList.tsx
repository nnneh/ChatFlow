"use client";
import FriendChat from "@/components/friendComponents/individualChat";
import FriendList from "@/components/friendComponents/friendList";
import FriendListHeader from "@/components/friendComponents/friendListHeader";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";

// Matches the interface defined in your FriendList component
interface Friend {
  _id: string;
  username: string;
  avatar?: string;
}

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [searchFriend, setSearchFriend] = useState("");
  const [chatId, setChatId] = useState("");
  const [openChat, setOpenChat] = useState("");

  // 👇 1. Added the required missing states for FriendListProps
  const [friends, setFriends] = useState<Friend[]>([]); 
  const [activeTab, setActiveTab] = useState<"friends" | "sent" | "received">("friends");
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFriendSelected = (friend: Friend, chatId: string) => {
    setSelectedFriend(friend);
    setChatId(chatId);
    setOpenChat(chatId);
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col h-screen">
        <div className="sticky top-0 ">
          {/* Note: You might want to pass setActiveTab here later if header manages tabs */}
          <FriendListHeader
            setSearchFriend={setSearchFriend}
            headerName="Friends"
          />
        </div>
        <div className="overflow-y-auto">
          {/* 👇 2. All required props are now properly passed down */}
          <FriendList
            onClickFriend={handleFriendSelected}
            chattingFriend={selectedFriend}
            searchFriend={searchFriend}
            friends={friends}
            activeTab={activeTab}
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="md:w-[calc(100vw-464px)] fixed top-0 right-0">
        <FriendChat friend={selectedFriend} chatId={chatId} />
      </div>
      {selectedFriend && (
        <div className="fixed sm:hidden inset-0 z-50 bg-gray-900">
          <button 
            onClick={() => setSelectedFriend(null)} 
            className="absolute top-10  z-50 bg-gray-800 p-2 rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          <FriendChat friend={selectedFriend} chatId={chatId} />
        </div>
      )}
    </div>
  );
};

export default Chat;