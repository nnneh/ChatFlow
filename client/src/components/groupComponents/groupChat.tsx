"use client";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizontalIcon, LogOutIcon } from "lucide-react";
import socket from "@/lib/socket";
import toast from "react-hot-toast";

interface Group {
  _id: string;
  groupName: string;
}

interface GroupMessageType {
  sender: string;
  senderId: string;
  content: string;
  createdAt: string;
  file?: string[];
}

interface GroupChatProps {
  group: Group | null;
  chatId: string;
  currentUserId: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const GroupChat: React.FC<GroupChatProps> = ({ group, chatId, currentUserId }) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<GroupMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API}/myMessages/${chatId}`, {
          credentials: "include",
        });
        if (res.status === 404) { setMessages([]); return; }
        const data = await res.json();
        setMessages(
          (data.messages || []).map((m: any) => ({
            sender: m.sender,
            senderId: m.senderId?._id || m.senderId?.toString() || m.senderId,
            content: m.content,
            file: m.file || [],
            createdAt: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch group messages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    socket.emit("join-chat", chatId);

    const handleReceiveMessage = (msg: GroupMessageType) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          senderId: msg.senderId?.toString(),
          createdAt: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => { socket.off("receive-message", handleReceiveMessage); };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !chatId) return;
    const text = messageText.trim();
    setMessageText("");
    try {
      const res = await fetch(`${API}/sendMessage/${chatId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to send message");
        setMessageText(text);
      }
    } catch (err) {
      console.error("Failed to send group message:", err);
      setMessageText(text);
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm(`Leave ${group?.groupName}?`)) return;
    try {
      const res = await fetch(`${API}/leaveGroup/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Failed to leave group"); return; }
      toast.success(data.message);
      window.location.reload();
    } catch {
      toast.error("Failed to leave group");
    }
  };

  if (!group) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-100 flex items-center justify-center text-5xl mb-6">
          👥
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Group chats
        </h2>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Select a group or create a new one to start chatting
        </p>
      </div>
    );
  }

  const initials = group.groupName.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full w-full">

      {/* Header */}
      <header className="h-16 border-b border-pink-100/60 px-6 flex items-center justify-between bg-white/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-200 to-purple-300 flex items-center justify-center text-xs font-bold text-purple-700">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{group.groupName}</h3>
            <p className="text-[10px] text-slate-400">Group Chat</p>
          </div>
        </div>
        <button
          onClick={handleLeaveGroup}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-200 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOutIcon className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-10">
            No messages yet. Start the conversation! 👋
          </p>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.senderId?.toString() === currentUserId?.toString() ||
              msg.sender === "You";

            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Friend avatar — left side only */}
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-[10px] font-bold text-purple-700 shrink-0">
                    {msg.sender?.substring(0, 2).toUpperCase()}
                  </div>
                )}

                <div className={`max-w-[70%] ${!isMe ? "items-start" : "items-end"} flex flex-col`}>
                  {/* Sender name above bubble for received messages */}
                  {!isMe && (
                    <span className="text-[10px] text-slate-400 mb-1 ml-1 font-medium">
                      {msg.sender}
                    </span>
                  )}

                  <div
                    className={`px-4 py-2.5 text-sm rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-sm"
                        : "bg-white text-slate-700 border border-pink-100 rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? "text-white/70 text-right" : "text-slate-400"}`}>
                      {msg.createdAt}
                    </p>
                  </div>
                </div>

                {/* Your avatar — right side only */}
                {isMe && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-200 to-pink-300 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">
                    {initials}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </section>

      {/* Input */}
      <footer className="p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-sm shrink-0">
        <form
          onSubmit={handleSendSubmit}
          className="flex items-center gap-2 bg-white border border-pink-100 rounded-2xl px-4 py-2.5"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${group.groupName}...`}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
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

export default GroupChat;