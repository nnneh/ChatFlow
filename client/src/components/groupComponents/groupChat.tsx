"use client";
import React, { useState } from "react";
import { SendHorizontalIcon, LogOutIcon } from "lucide-react";

const GroupChat = ({ group, currentUserId }) => {
  const [messageText, setMessageText] = useState("");
  
  // Local state modeling your myMessages payload mapping
  const [messages, setMessages] = useState([
    { sender: "Sarah Jenkins", senderId: "u2", content: "Hey guys! Welcome to the new channel.", createdAt: "11:02 AM" },
    { sender: "Alex Rivera", senderId: "u3", content: "Is the server deployed?", createdAt: "11:05 AM" },
    { sender: "You", senderId: "my-id-123", content: "Yes, active and listening for socket emissions.", createdAt: "11:06 AM" }
  ]);

  if (!group) {
    return (
      <div className="flex flex-1 h-full items-center justify-center text-slate-500 bg-slate-950">
        Select a group conversation room to read logs
      </div>
    );
  }

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newGroupMsg = {
      sender: "You",
      senderId: currentUserId || "my-id-123",
      content: messageText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newGroupMsg]);
    setMessageText("");
    // Network Hook standard: POST against `/api/group/send/${group._id}`
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 flex-1 border-slate-800">
      
      {/* Top App Header Row */}
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/10 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{group.groupName}</h3>
          <p className="text-[10px] text-slate-500 truncate">Group Room ID: {group._id}</p>
        </div>

        {/* Action Button: Linked to leaveGroup or deleteGroup endpoints */}
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition"
          title="Exit Group"
        >
          <LogOutIcon className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </header>

      {/* Messages Feed Engine Viewport */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          // Identify sender context vs current active token id
          const isMe = msg.senderId === (currentUserId || "my-id-123") || msg.sender === "You";

          return (
            <div key={index} className={`flex flex-col max-w-xl ${isMe ? "ml-auto items-end" : "items-start"}`}>
              {/* Show username text indicators above external messages */}
              {!isMe && (
                <span className="text-[11px] text-slate-400 mb-1 ml-1 font-medium">
                  {msg.sender}
                </span>
              )}
              
              <div>
                <div className={`px-4 py-2.5 text-sm shadow-sm break-words rounded-2xl ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-br-none" 
                    : "bg-slate-900 text-slate-100 rounded-bl-none border border-slate-800"
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

      {/* Input Tray Footer Container Form */}
      <footer className="p-4 border-t border-slate-800 bg-slate-900/10 shrink-0">
        <form onSubmit={handleSendSubmit} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/50 transition">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${group.groupName}...`}
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

export default GroupChat;