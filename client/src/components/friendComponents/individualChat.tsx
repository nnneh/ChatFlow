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
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([
    { _id: "1", sender: "Partner", content: "Hey! Testing types out.", createdAt: "10:14 PM" }
  ]);

  if (!friend) return null;

  const handleSendSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: MessageType = {
      _id: Date.now().toString(),
      sender: "You",
      content: messageText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 flex-1">
      <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {friend.avatar || "U"}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{friend.username}</h3>
            <p className="text-[10px] text-slate-500">Room ID: {chatId}</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 rounded-lg transition">
          Unfriend
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === "You";
          return (
            <div key={msg._id} className={`flex items-end gap-2 max-w-xl ${isMe ? "ml-auto justify-end" : ""}`}>
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
            placeholder={`Message ${friend.username}...`}
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

export default FriendChat;