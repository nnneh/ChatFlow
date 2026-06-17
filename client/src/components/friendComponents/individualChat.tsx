"use client";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizontalIcon } from "lucide-react";
import socket from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface Friend {
  _id: string;
  username: string;
  avatar?: string;
  chatId?: string;
}

interface MessageType {
  _id?: string;
  sender: string;
  senderId?: string;
  content: string;
  createdAt: string;
  chatId?: string;
}

interface FriendChatProps {
  friend: Friend | null;
  chatId: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

const FriendChat: React.FC<FriendChatProps> = ({ friend, chatId }) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentUser = useSelector((state: RootState) => state.user?.userInfo);
  const currentUserId = currentUser?._id;

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
            senderId: m.senderId?._id || m.senderId, // Normalize nested ID
            content: m.content,
            createdAt: new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    socket.emit("join-chat", chatId);

    const handleReceiveMessage = (msg: any) => {
      // Avoid duplicate parsing if the message is already locally handled
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          // Extract the string ID securely depending on backend payload structure
          senderId: msg.senderId?._id || msg.senderId,
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
      await fetch(`${API}/message/${chatId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessageText(text);
    }
  };

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

  const initials = friend.username.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50">
      {/* Header */}
      <header className="h-16 border-b border-pink-100/60 px-6 flex items-center justify-between bg-white backdrop-blur-sm shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-xs font-bold text-purple-700">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{friend.username}</h3>
            <p className="text-[10px] text-emerald-500 font-medium">Online</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-200 hover:bg-rose-50 rounded-lg transition">
          Unfriend
        </button>
      </header>

      {/* Messages Wrapper Container */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-10">
            No messages yet. Say hi! 👋
          </p>
        ) : (
          messages.map((msg, index) => {
            // Strict match checking
            const isMe =
              (msg.senderId && String(msg.senderId) === String(currentUserId)) ||
              msg.sender === "You" || 
              (msg.sender && currentUser?.username && msg.sender === currentUser.username);

            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-2 w-full ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Left Side Avatar (Receiver View) */}
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center text-[10px] font-bold text-purple-700 shrink-0 shadow-sm">
                    {friend.username.substring(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Bubble Design */}
                <div
                  className={`max-w-[70%] px-4 py-2.5 text-sm shadow-sm transition-all duration-150 ${
                    isMe
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl rounded-br-none" 
                      : "bg-white text-slate-700 border border-pink-100 rounded-2xl rounded-bl-none"
                  }`}
                >
                  <p className="break-words leading-relaxed">{msg.content}</p>
                  <p
                    className={`text-[9px] mt-1 font-light tracking-wide ${
                      isMe ? "text-white/80 text-right" : "text-slate-400 text-left"
                    }`}
                  >
                    {msg.createdAt}
                  </p>
                </div>

                {/* Right Side Avatar (Sender View) */}
                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-200 to-pink-300 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0 shadow-sm">
                    {currentUser?.username?.substring(0, 2).toUpperCase() || "ME"}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </section>

      {/* Input Form */}
      <footer className="p-4 border-t border-pink-100/60 bg-white shrink-0">
        <form
          onSubmit={handleSendSubmit}
          className="flex items-center gap-2 bg-slate-50 border border-pink-100/80 rounded-2xl px-4 py-2.5 focus-within:border-pink-300 focus-within:bg-white transition-all shadow-inner"
        >
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message ${friend.username}...`}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition shadow-sm"
          >
            <SendHorizontalIcon className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default FriendChat;