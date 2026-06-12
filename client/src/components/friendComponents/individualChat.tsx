"use client";
import React, { useState } from "react";
import { SendHorizontalIcon } from "lucide-react";

const FriendChat = ({ friend, chatId }) => {
  const [messageText, setMessageText] = useState("");
  
  // Local state to track running dialogues. Wire up to getMyMessages/Socket events later.
  const [messages, setMessages] = useState([
    { _id: "1", sender: "Partner", content: "Hey! Did you check out the new backend API yet?", createdAt: "10:14 PM" },
    { _id: "2", sender: "You", content: "Yeah, testing components right now!", createdAt: "10:15 PM" }
  ]);

  if (!friend) return null;

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Append standard payload object locally
    const newMessage = {
      _id: Date.now().toString(),
      sender: "You",
      content: messageText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageText(""); // Reset text field
    
    // TODO: Axio/Fetch network trigger POST against: `/api/message/${chatId}`
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 flex-1 border-slate-800">
      
      {/* Top Banner Context Header */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {friend.avatar}
          </div>
          <div>
            <h3 class="text-sm font-semibold text-slate-100">{friend.username}</h3>
            <p className="text-[10px] text-slate-500 truncate max-w-[180px] md:max-w-none">
              Room ID: {chatId}
            </p>
          </div>
        </div>

        {/* Action Button wired for your disconnectFriend endpoint */}
        <button className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition">
          Unfriend
        </button>
      </header>

      {/* Main Messages View Area */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === "You";

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 max-w-xl ${isMe ? "ml-auto justify-end" : ""}`}
            >
              {!isMe && (
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0 mb-1">
                  {friend.avatar}
                </div>
              )}
              <div>
                <div className={`px-4 py-2.5 text-sm shadow-sm max-w-xs md:max-w-md break-words ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-none" 
                    : "bg-slate-900 text-slate-100 rounded-2xl rounded-bl-none border border-slate-800"
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[9px] text-slate-600 mt-1 block ${isMe ? "text-right mr-1" : "ml-1"}`}>
                  {msg.createdAt}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Message Entry Box Footer Form */}
      <footer className="p-4 border-t border-slate-800 bg-slate-900/10 shrink-0">
        <form onSubmit={handleSendSubmit} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/50 transition">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${friend.username}...`}
            className="flex-1 bg-transparent border-0 outline-none p-0 text-sm placeholder:text-slate-600 text-slate-200 focus:ring-0"
          />
          <button
            type="submit"
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shrink-0"
          >
            <SendHorizontalIcon className="w-4 h-4" />
          </button>
        </form>
      </footer>

    </div>
  );
};

export default FriendChat;