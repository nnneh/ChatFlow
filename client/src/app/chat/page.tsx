"use client"

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaMagnifyingGlass,
  FaFaceSmile,
  FaImage,
  FaEllipsisVertical,
  FaCircleCheck,
} from "react-icons/fa6";

// Note: In Next.js App Router, metadata for 'use client' components is usually 
// handled via a separate layout, or a wrapper component. For now, we've safely 
// stripped the TanStack wrapper so this page can compile without errors.

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

const MOCK_FRIENDS: Friend[] = [
  { id: "1", username: "Aarya Sharma", avatar: "🌸", lastMessage: "See you tomorrow!", time: "2m", unread: 2, online: true },
  { id: "2", username: "Bishal Thapa", avatar: "🐰", lastMessage: "Haha that's hilarious 😂", time: "12m", unread: 0, online: true },
  { id: "3", username: "Sita Rai", avatar: "🦋", lastMessage: "Sent you the photos", time: "1h", unread: 1, online: false },
  { id: "4", username: "Manish Gurung", avatar: "🍓", lastMessage: "Let's catch up soon", time: "3h", unread: 0, online: false },
  { id: "5", username: "Priya Adhikari", avatar: "🌷", lastMessage: "Thank youuu 💕", time: "1d", unread: 0, online: true },
  { id: "6", username: "Roshan KC", avatar: "🐻", lastMessage: "Okay sounds good", time: "2d", unread: 0, online: false },
];

const MOCK_MESSAGES: Message[] = [
  { id: "m1", text: "Hey! How are you doing? 🌸", sender: "them", time: "10:24 AM" },
  { id: "m2", text: "I'm great! Just working on some designs", sender: "me", time: "10:25 AM" },
  { id: "m3", text: "Oh nice! Can I see them?", sender: "them", time: "10:25 AM" },
  { id: "m4", text: "Yes of course, sending now ✨", sender: "me", time: "10:26 AM" },
  { id: "m5", text: "They look amazing 😍", sender: "them", time: "10:28 AM" },
  { id: "m6", text: "See you tomorrow!", sender: "them", time: "10:30 AM" },
];

function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = MOCK_FRIENDS.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, selectedFriend]);

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
      {/* Floating pastel blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[40%] right-[20%] w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="relative max-w-6xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-pink-100/40 border border-white/60 overflow-hidden flex">
        {/* Sidebar — Friends List */}
        <aside
          className={`${
            selectedFriend ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 flex-col border-r border-pink-100/60 bg-white/40`}
        >
          {/* Header */}
          <div className="p-5 border-b border-pink-100/60">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                ChatFlow
              </h1>
              <button className="w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-500 transition-all hover:scale-105">
                <FaEllipsisVertical className="text-sm" />
              </button>
            </div>
            {/* Search */}
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
          {/* Friends */}
          <div className="flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No friends found</p>
            ) : (
              filtered.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all mb-1 text-left ${
                    selectedFriend?.id === friend.id
                      ? "bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm"
                      : "hover:bg-white/70"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-2xl shadow-sm">
                      {friend.avatar}
                    </div>
                    {friend.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-700 truncate">
                        {friend.username}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{friend.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 truncate">{friend.lastMessage}</p>
                      {friend.unread > 0 && (
                        <span className="shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-[10px] font-bold flex items-center justify-center">
                          {friend.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="p-3 border-t border-pink-100/60 text-center">
            {/* ✅ FIXED: Changed 'to="/login"' to 'href="/login"' for Next.js */}
            <Link href="/login" className="text-xs text-slate-400 hover:text-pink-500 transition">
              Made with 🌸
            </Link>
          </div>
        </aside>
        {/* Chat Area */}
        <section
          className={`${
            selectedFriend ? "flex" : "hidden md:flex"
          } flex-1 flex-col bg-gradient-to-b from-white/30 to-pink-50/30`}
        >
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <header className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50 backdrop-blur-xl">
                <button
                  onClick={() => setSelectedFriend(null)}
                  className="md:hidden w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-600 transition"
                  aria-label="Back"
                >
                  <FaArrowLeft className="text-sm" />
                </button>
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-xl">
                    {selectedFriend.avatar}
                  </div>
                  {selectedFriend.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 truncate">{selectedFriend.username}</p>
                  <p className="text-xs text-slate-400">
                    {selectedFriend.online ? "Active now" : "Last seen recently"}
                  </p>
                </div>
                <button className="w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-500 transition">
                  <FaEllipsisVertical className="text-sm" />
                </button>
              </header>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender === "me";
                  const showAvatar =
                    !isMe && (idx === messages.length - 1 || messages[idx + 1]?.sender !== msg.sender);
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-sm shrink-0 ${
                            showAvatar ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {selectedFriend.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isMe
                            ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-md"
                            : "bg-white text-slate-700 rounded-bl-md border border-pink-100/60"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-[10px] ${
                            isMe ? "text-white/70 justify-end" : "text-slate-400"
                          }`}
                        >
                          <span>{msg.time}</span>
                          {isMe && <FaCircleCheck className="text-[10px]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Composer */}
              <form
                onSubmit={sendMessage}
                className="p-3 sm:p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 bg-white rounded-2xl border border-pink-100 px-3 py-2 focus-within:ring-4 focus-within:ring-pink-100/50 focus-within:border-pink-300 transition-all">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center text-pink-400 transition shrink-0"
                  >
                    <FaImage className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full hover:bg-pink-50 flex items-center justify-center text-pink-400 transition shrink-0"
                  >
                    <FaFaceSmile className="text-sm" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a sweet message..."
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none py-1.5"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white flex items-center justify-center shadow-md shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-emerald-200 flex items-center justify-center text-5xl mb-6 shadow-lg shadow-pink-200/40 animate-pulse">
                💬
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                Your messages
              </h2>
              <p className="text-sm text-slate-500 max-w-xs">
                Select a friend to start a cozy little chat 🌸
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChatPage;