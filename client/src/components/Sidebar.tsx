"use client";
import { useState } from "react";
import {
  FaPlus, FaMagnifyingGlass, FaUserGroup, FaClock, FaInbox,
} from "react-icons/fa6";
import { Friend, PendingRequest, ActiveTab, UserProfile } from "../types";
import Avatar from "./Avatar";
import FriendsList from "./FriendsList";
import AddFriendModal from "./AddFriendModal";

type Props = {
  profile: UserProfile | null;
  friends: Friend[];
  sentRequests: PendingRequest[];
  receivedRequests: PendingRequest[];
  selectedFriendId?: string;
  isLoading: boolean;
  hidden: boolean;                          // hide on mobile when chat/profile is open
  onSelectFriend: (f: Friend) => void;
  onProfileClick: () => void;
  onAccept: (req: PendingRequest) => void;
  onReject: (req: PendingRequest) => void;
  onCancelSent: (req: PendingRequest) => void;
  onSendRequest: (username: string) => Promise<void>;
};

export default function Sidebar({
  profile, friends, sentRequests, receivedRequests,
  selectedFriendId, isLoading, hidden,
  onSelectFriend, onProfileClick,
  onAccept, onReject, onCancelSent, onSendRequest,
}: Props) {
  const [activeTab, setActiveTab]   = useState<ActiveTab>("friends");
  const [search, setSearch]         = useState("");
  const [modalOpen, setModalOpen]   = useState(false);

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: "friends" as const, icon: <FaUserGroup />, label: "Friends", count: null },
    { key: "sent"    as const, icon: <FaClock />,     label: "Sent",    count: sentRequests.length },
    { key: "received"as const, icon: <FaInbox />,     label: "Recv",    count: receivedRequests.length },
  ];

  return (
    <>
      <aside
        className={`${hidden ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 flex-col border-r border-pink-100/60 bg-white/40`}
      >
        {/* Header */}
        <div className="p-5 border-b border-pink-100/60">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              ChatFlow
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalOpen(true)}
                title="Add Friend"
                className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition hover:scale-105"
              >
                <FaPlus className="text-sm" />
              </button>
              <button
                onClick={onProfileClick}
                title="My Profile"
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-200 hover:border-pink-400 transition hover:scale-105"
              >
                <Avatar src={profile?.avatar} name={profile?.username} size={36} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 text-xs pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/70 border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition"
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg transition ${
                  activeTab === tab.key ? "bg-white text-pink-600 shadow-sm" : "hover:text-slate-800"
                }`}
              >
                <span className="text-[10px]">{tab.icon}</span>
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-0.5 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          <FriendsList
            activeTab={activeTab}
            friends={filteredFriends}
            sentRequests={sentRequests}
            receivedRequests={receivedRequests}
            selectedFriendId={selectedFriendId}
            isLoading={isLoading}
            onSelectFriend={onSelectFriend}
            onAccept={onAccept}
            onReject={onReject}
            onCancelSent={onCancelSent}
          />
        </div>
      </aside>

      {modalOpen && (
        <AddFriendModal
          onClose={() => setModalOpen(false)}
          onSubmit={async (username) => {
            await onSendRequest(username);
            setActiveTab("sent");
          }}
        />
      )}
    </>
  );
}