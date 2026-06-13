"use client";
import React, { useState } from "react";
import { SendHorizontalIcon, LogOutIcon } from "lucide-react";

interface Group {
  _id: string;
  groupName: string;
}

interface GroupMessageType {
  sender: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface GroupChatProps {
  group: Group | null;
  currentUserId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ group, currentUserId }) => {
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<GroupMessageType[]>([
    { sender: "Sarah Jenkins", senderId: "u2", content: "Welcome to the group room!", createdAt: "11:02 AM" }
  ]);

  if (!group) return <div className="p-6 text-slate-500 text-center">Select a group to chat</div>;

  const handleSendSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newGroupMsg: GroupMessageType = {
      sender: "You",
      senderId: currentUserId,
      content: messageText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newGroupMsg]);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 flex-1">
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/10 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{group.groupName}</h3>
          <p className="text-[10px] text-slate-500">ID: {group._id}</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition">
          <LogOutIcon className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId || msg.sender === "You";
          return (
            <div key={index} className={`flex flex-col max-w-xl ${isMe ? "ml-auto items-end" : "items-start"}`}>
              {!isMe && <span className="text-[11px] text-slate-400 mb-1 ml-1 font-medium">{msg.sender}</span>}
              <div className={`px-4 py-2.5 text-sm rounded-2xl ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-900 text-slate-100 rounded-bl-none border border-slate-800"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="p-4 border-t border-slate-800 bg-slate-900/10 shrink-0">
        <form onSubmit={handleSendSubmit} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5">
          <input
            type="text"
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
            placeholder={`Message ${group.groupName}...`}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-200 focus:ring-0"
          />
          <button type="submit" className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition">
            <SendHorizontalIcon className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default GroupChat;