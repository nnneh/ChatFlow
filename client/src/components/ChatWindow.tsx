"use client";
import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaPaperPlane, FaEllipsisVertical } from "react-icons/fa6";
import { Friend, Message } from "../types";
import Avatar from "./Avatar";

type Props = {
  friend: Friend;
  onBack: () => void;
};

export default function ChatWindow({ friend, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft]       = useState("");
  const scrollRef               = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: "m" + Date.now(),
        text: draft.trim(),
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50 backdrop-blur-xl shrink-0">
        <button
          onClick={onBack}
          className="md:hidden w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-600 transition"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <Avatar src={friend.avatar} name={friend.username} size={44} online={friend.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-700 truncate">{friend.username}</p>
          <p className="text-xs text-slate-400">{friend.online ? "Online" : "Offline"}</p>
        </div>
        <button className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center text-slate-500 transition">
          <FaEllipsisVertical className="text-sm" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-sm text-slate-500">Say hi to {friend.username}!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "them" && (
              <Avatar src={friend.avatar} name={friend.username} size={28} />
            )}
            <div
              className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                msg.sender === "me"
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-md"
                  : "bg-white text-slate-700 rounded-bl-md"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-white/70 text-right" : "text-slate-400"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-xl shrink-0"
      >
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-pink-100 px-3 py-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white flex items-center justify-center disabled:opacity-50 transition hover:opacity-90"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </div>
      </form>
    </div>
  );
}