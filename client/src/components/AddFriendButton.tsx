"use client";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

type Props = {
  onClose: () => void;
  onSubmit: (username: string) => Promise<void>;
};

export default function AddFriendModal({ onClose, onSubmit }: Props) {
  const [username, setUsername] = useState("");
  const [sending, setSending]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setSending(true);
    try {
      await onSubmit(username.trim());
      onClose();
    } catch (err: any) {
      // error toast is handled by the caller via useChatData
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-pink-100/60 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
          <h3 className="font-bold text-slate-700 text-lg">Send Friend Request</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <FaXmark className="text-sm" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Neha_Thakur"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !username.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 shadow-md transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}