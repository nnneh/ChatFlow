"use client"

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMagnifyingGlass,
  FaFaceSmile,
  FaImage,
  FaEllipsisVertical,
  FaCircleCheck,
  FaPlus, // Added for the Add Friend button
  FaXmark // Added for closing the modal
} from "react-icons/fa6";
import getFriends from "../api/getFriendRequest";
import sendFriendRequest from "../api/sendFriendRequest"; 

type Friend = {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
};

const MOCK_MESSAGES: Message[] = [
  { id: "m1", text: "Hey! How are you doing? 🌸", sender: "them", time: "10:24 AM" },
  { id: "m2", text: "I'm great! Just working on some designs", sender: "me", time: "10:25 AM" },
];

function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. States for managing the "Add Friend" Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  useEffect(() => {
    const fetchFriendsData = async () => {
      setIsLoading(true);
      try {
        const data = await getFriends();
        const filteredData = data.filter((friend: Friend) =>
          friend.username.toLowerCase().includes(search.toLowerCase())
        );
        setFriends(filteredData);
      } catch (error) {
        toast.error("Failed to fetch friends from server");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchFriendsData();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, selectedFriend]);

  // 3. Handle sending the request
  const handleAddFriendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim()) return;

    setIsSendingRequest(true);
    try {
      // Calls your Axios utility
      const messageFromServer = await sendFriendRequest(targetUserId.trim());
      
      // Displays the message returned by your utility (success or 409 error message)
      toast.success(messageFromServer || "Friend request processed!");
      
      // Reset state and close modal
      setTargetUserId("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Something went wrong sending the request");
    } finally {
      setIsSendingRequest(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        text: draft.trim(),
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 p-2 sm:p-4">
      <Toaster position="top-center" />
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
      
      <div className="relative max-w-6xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-pink-100/40 border border-white/60 overflow-hidden flex">
        
        {/* Sidebar */}
        <aside className={`${selectedFriend ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 flex-col border-r border-pink-100/60 bg-white/40`}>
          <div className="p-5 border-b border-pink-100/60">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                ChatFlow
              </h1>
              <div className="flex items-center gap-2">
                {/* 4. ADD FRIEND TRIGGER BUTTON */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition-all hover:scale-105"
                  title="Add Friend"
                >
                  <FaPlus className="text-sm" />
                </button>
                <button className="w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-500 transition-all hover:scale-105">
                  <FaEllipsisVertical className="text-sm" />
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 text-xs pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search friends..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/70 border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition-all"
              />
            </div>
          </div>
          
          {/* Friends List Elements */}
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <p className="text-center text-sm text-slate-400 py-8 animate-pulse">Loading friends...</p>
            ) : friends.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No friends found</p>
            ) : (
              friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all mb-1 text-left ${
                    selectedFriend?.id === friend.id ? "bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm" : "hover:bg-white/70"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl shadow-sm">
                      {friend.avatar || "👤"}
                    </div>
                    {friend.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-700 truncate">{friend.username}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{friend.time || "now"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 truncate">{friend.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Canvas Section */}
        <section className={`${selectedFriend ? "flex" : "hidden md:flex"} flex-1 flex-col bg-gradient-to-b from-white/30 to-pink-50/30`}>
          {selectedFriend ? (
            <>
              {/* Active Chat Windows */}
              <header className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50 backdrop-blur-xl">
                <button onClick={() => setSelectedFriend(null)} className="md:hidden w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-600 transition">
                  <FaArrowLeft className="text-sm" />
                </button>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xl">{selectedFriend.avatar}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">{selectedFriend.username}</p>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.sender === "me" ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-md" : "bg-white text-slate-700 rounded-bl-md"}`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-xl">
                <div className="flex items-center gap-2 bg-white rounded-2xl border border-pink-100 px-3 py-2">
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a sweet message..." className="flex-1 bg-transparent text-sm text-slate-700 outline-none" />
                  <button type="submit" className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white flex items-center justify-center"><FaPaperPlane className="text-xs" /></button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-emerald-200 flex items-center justify-center text-5xl mb-6 shadow-lg">💬</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">Your messages</h2>
              <p className="text-sm text-slate-500 max-w-xs">Select a friend or add a new one to chat 🌸</p>
            </div>
          )}
        </section>
      </div>

      {/* 5. ADD FRIEND MODAL POPUP LAYER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-pink-100/60 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
              <h3 className="font-bold text-slate-700 text-lg">Send Friend Request</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setTargetUserId(""); }}
                className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <FaXmark className="text-sm" />
              </button>
            </div>
            
            <form onSubmit={handleAddFriendSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  User ID or Username
                </label>
                <input
                  type="text"
                  required
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user's registration ID..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition-all"
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setTargetUserId(""); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingRequest || !targetUserId.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 shadow-md transition disabled:opacity-50"
                >
                  {isSendingRequest ? "Sending..." : "Send Request 🌸"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;