"use client";
import React, { useState } from "react";
import { SendHorizontalIcon } from "lucide-react";

interface Friend {
  _id: string;
  username: string;
  avatar?: string;
}

interface MessageType {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface FriendChatProps {
  friend: Friend | null;
  chatId: string;
}

const FriendChat: React.FC<FriendChatProps> = ({ friend, chatId }) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    { _id: "1", sender: "Partner", content: "Hey! Testing types out.", createdAt: "10:14 PM" },
  ]);

  if (!friend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-100 flex items-center justify-center text-5xl mb-6">
          💬
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Your messages
        </h2>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Select a friend or add a new one to chat
        </p>
      </div>
    );
  }

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        sender: "You",
        content: messageText,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessageText("");
  };

  const initials = friend.username.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <header className="h-16 border-b border-pink-100/60 px-6 flex items-center justify-between bg-white/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-xs font-bold text-purple-700">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{friend.username}</h3>
            <p className="text-[10px] text-slate-400">Online</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-200 hover:bg-rose-50 rounded-lg transition">
          Unfriend
        </button>
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === "You";
          return (
            <div key={msg._id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-[10px] font-bold text-purple-700 shrink-0">
                  {friend.username.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className={`max-w-[70%] px-4 py-2.5 text-sm rounded-2xl shadow-sm ${
                isMe
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-sm"
                  : "bg-white text-slate-700 border border-pink-100 rounded-bl-sm"
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/70 text-right" : "text-slate-400"}`}>
                  {msg.createdAt}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Input */}
      <footer className="p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-sm shrink-0">
        <form onSubmit={handleSendSubmit} className="flex items-center gap-2 bg-white border border-pink-100 rounded-2xl px-4 py-2.5">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${friend.username}...`}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-1.5 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition"
          >
            <SendHorizontalIcon className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default FriendChat;