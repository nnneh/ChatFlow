"use client";
import FriendChat from "@/components/friendComponents/individualChat";
import FriendList from "@/components/friendComponents/friendList";
import FriendListHeader from "@/components/friendComponents/friendListHeader";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [searchFriend, setSearchFriend] = useState("");
  const [chatId, setChatId] = useState("");
  const [openChat, setOpenChat] = useState("");

  const handleFriendSelected = (friend: any, chatId: string) => {
    setSelectedFriend(friend);
    setChatId(chatId);
    setOpenChat(chatId);
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col h-screen">
        <div className="sticky top-0 ">
          <FriendListHeader
            setSearchFriend={setSearchFriend}
            headerName="Friends"
          />
        </div>
        <div className="overflow-y-auto">
          {/* Removed openChat={openChat} to satisfy FriendListProps restriction */}
          <FriendList
            onClickFriend={handleFriendSelected}
            chattingFriend={selectedFriend}
            searchFriend={searchFriend}
          />
        </div>
      </div>
      <div className="md:w-[calc(100vw-464px)] fixed top-0 right-0">
        <FriendChat friend={selectedFriend} chatId={chatId} />
      </div>
      {selectedFriend && (
        <div className="fixed sm:hidden inset-0 z-50 bg-gray-900">
          <button 
            onClick={() => setSelectedFriend(null)} 
            className="absolute top-10  z-50 bg-gray-800 p-2 rounded-full"
          >
            <ArrowLeftIcon className="h-5 w-5 text-white" />
          </button>
          <FriendChat friend={selectedFriend} chatId={chatId} />
        </div>
      )}
    </div>
  );
};

export default Chat;


// "use client";
// import { useState } from "react";
// import { Toaster } from "react-hot-toast";

// interface Friend {
//   _id: string;
//   id?: string;
//   username: string;
//   avatar?: string;
// }
// type ActiveView = "chat" | "profile";

// import { useChatData } from "@/hooks/useChatData";
// // import Sidebar from "@/components/Sidebar";
// // import ChatWindow from "@/components/ChatWindow";
// import UserProfile from "@/components/UserProfile";

// export default function ChatPage() {
//   const [activeView, setActiveView]         = useState<ActiveView>("chat");
//   const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
//   const [search, setSearch]                 = useState("");

//   const {
//     friends, sentRequests, receivedRequests, profile,
//     isLoading, setProfile,
//     handleSendRequest, handleAccept, handleReject,
//     handleCancelSent, handleLogout, handleProfileUpdate,
//   } = useChatData(search);

//   // Responsive UI controls: hide side layout on smaller screens when active panels are open
//   const sidebarHidden = !!selectedFriend || activeView === "profile";
//   const mainPanelVisible = !!selectedFriend || activeView === "profile";

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 p-0 sm:p-4 flex items-center justify-center">
//       <Toaster position="top-center" />

//       {/* Decorative Blur Spheres */}
//       <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

//       {/* Main Container Card View */}
//       <div className="relative w-full max-w-7xl h-screen sm:h-[calc(100vh-2rem)] bg-white/60 backdrop-blur-2xl sm:rounded-3xl shadow-2xl shadow-pink-100/30 border border-white/80 overflow-hidden flex flex-1">

//         {/* ── LEFT SIDE: Sidebar Frame ── */}
//         <div className={`${sidebarHidden ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 h-full shrink-0 border-r border-pink-100/40 bg-white/40`}>
//           <Sidebar
//             profile={profile}
//             friends={friends}
//             sentRequests={sentRequests}
//             receivedRequests={receivedRequests}
//             selectedFriendId={selectedFriend?._id || selectedFriend?.id}
//             isLoading={isLoading}
//             hidden={sidebarHidden}
//             onSelectFriend={(friend) => {
//               setSelectedFriend(friend);
//               setActiveView("chat");
//             }}
//             onProfileClick={() =>
//               setActiveView(activeView === "profile" ? "chat" : "profile")
//             }
//             onAccept={handleAccept}
//             onReject={handleReject}
//             onCancelSent={handleCancelSent}
//             onSendRequest={handleSendRequest}
//           />
//         </div>

//         {/* ── RIGHT SIDE: Context Panel View ── */}
//         <section
//           className={`${
//             mainPanelVisible ? "flex" : "hidden md:flex"
//           } flex-1 flex-col bg-gradient-to-b from-white/20 to-pink-50/10 overflow-hidden h-full`}
//         >
//           {activeView === "profile" && (
//             <UserProfile
//               profile={profile}
//               onClose={() => setActiveView("chat")}
//               onLogout={handleLogout}
//               onProfileUpdate={async (payload) => {
//                 return await handleProfileUpdate(payload);
//               }}
//             />
//           )}

//           {activeView === "chat" && (
//             selectedFriend ? (
//               <ChatWindow
//                 friend={selectedFriend}
//                 onBack={() => setSelectedFriend(null)}
//               />
//             ) : (
//               /* Fallback Home Empty Placeholder View */
//               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-white/20 backdrop-blur-sm">
//                 <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-100 flex items-center justify-center text-5xl mb-6 shadow-inner shadow-white/60">
//                   💬
//                 </div>
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                   Your messages
//                 </h2>
//                 <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
//                   {/* Select a friend or add a new one to chat 🌸 */}
//                   Select a friend or add a new one to chat
//                 </p>
//               </div>
//             )
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }






// "use client";
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Toaster, toast } from "react-hot-toast";
// import axios from "axios";
// import {
//   FaArrowLeft,
//   FaPaperPlane,
//   FaMagnifyingGlass,
//   FaEllipsisVertical,
//   FaPlus,
//   FaXmark,
//   FaClock,
//   FaInbox,
//   FaUserGroup,
//   FaRightFromBracket,
//   FaUser,
//   FaCheck,
//   FaTrash,
//   FaPen,
//   FaCamera,
//   FaShield,
//   FaBell,
//   FaChevronRight,
// } from "react-icons/fa6";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Friend = {
//   id: string;
//   username: string;
//   avatar: string;
//   lastMessage: string;
//   time: string;
//   unread: number;
//   online: boolean;
// };

// type PendingRequest = {
//   id: string;
//   username: string;
//   avatar?: string;
//   time: string;
// };

// type Message = {
//   id: string;
//   text: string;
//   sender: "me" | "them";
//   time: string;
// };

// type UserProfile = {
//   _id: string;
//   username: string;
//   email: string;
//   avatar?: string;
//   bio?: string;
//   createdAt?: string;
// };

// type ActiveView = "chat" | "profile";
// type ActiveTab = "friends" | "sent" | "received";

// // ─── API helpers ──────────────────────────────────────────────────────────────

// const API = process.env.NEXT_PUBLIC_API_URL;

// const apiFetch = async (url: string, opts?: RequestInit) => {
//   const res = await fetch(url, { credentials: "include", ...opts });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `Request failed (${res.status})`);
//   }
//   return res.json();
// };

// const getFriends = async (): Promise<Friend[]> => {
//   try {
//     const data = await apiFetch(`${API}/friend`);
//     return data.Friends ?? [];
//   } catch {
//     return [];
//   }
// };

// const getSentRequests = async (): Promise<PendingRequest[]> => {
//   try {
//     const data = await apiFetch(`${API}/request/sentrequests`);
//     return (data.request ?? []).map((r: any) => ({
//       id: r.requestId,
//       username: r.receiver.username,
//       avatar: r.receiver.avatar || "",
//       time: new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     }));
//   } catch {
//     return [];
//   }
// };

// const getReceivedRequests = async (): Promise<PendingRequest[]> => {
//   try {
//     const data = await apiFetch(`${API}/request/allrequest`);
//     return (data.request ?? []).map((r: any) => ({
//       id: r.requestId,
//       username: r.sender.username,
//       avatar: r.sender.avatar || "",
//       time: new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     }));
//   } catch {
//     return [];
//   }
// };

// const getMyProfile = async (): Promise<UserProfile | null> => {
//   try {
//     const data = await apiFetch(`${API}/user/me`);
//     return data.user ?? data ?? null;
//   } catch {
//     return null;
//   }
// };

// const sendFriendRequest = async (username: string): Promise<string> => {
//   const data = await apiFetch(`${API}/request/sendRequest/${encodeURIComponent(username)}`, {
//     method: "POST",
//   });
//   return data.message ?? "Request sent";
// };

// const acceptRequest = async (requestId: string): Promise<void> => {
//   await apiFetch(`${API}/request/acceptRequest/${requestId}`, { method: "POST" });
// };

// const rejectRequest = async (requestId: string): Promise<void> => {
//   await apiFetch(`${API}/request/rejectRequest/${requestId}`, { method: "POST" });
// };

// const logoutUser = async (): Promise<void> => {
//   await apiFetch(`${API}/user/logout`, { method: "POST" });
// };

// const updateProfile = async (payload: { username?: string; bio?: string }): Promise<UserProfile> => {
//   const data = await apiFetch(`${API}/user/update`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   return data.user ?? data;
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// // Avatar placeholder
// const Avatar = ({
//   src,
//   name,
//   size = 44,
//   online,
// }: {
//   src?: string;
//   name?: string;
//   size?: number;
//   online?: boolean;
// }) => {
//   const initials = name
//     ?.split(/[\s_]/)
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <div className="relative shrink-0" style={{ width: size, height: size }}>
//       {src ? (
//         <img
//           src={src}
//           alt={name}
//           className="rounded-full object-cover w-full h-full"
//         />
//       ) : (
//         <div
//           className="rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center font-semibold text-purple-700 w-full h-full select-none"
//           style={{ fontSize: size * 0.35 }}
//         >
//           {initials || <FaUser size={size * 0.4} />}
//         </div>
//       )}
//       {online !== undefined && (
//         <span
//           className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${online ? "bg-emerald-400" : "bg-slate-300"}`}
//           style={{ width: size * 0.28, height: size * 0.28 }}
//         />
//       )}
//     </div>
//   );
// };

// // Confirm dialog
// const ConfirmDialog = ({
//   message,
//   onConfirm,
//   onCancel,
// }: {
//   message: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// }) => (
//   <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
//     <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-6 max-w-sm w-full">
//       <p className="text-slate-700 font-medium text-center mb-5">{message}</p>
//       <div className="flex gap-3 justify-center">
//         <button
//           onClick={onCancel}
//           className="px-5 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition"
//         >
//           Confirm
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ─── Profile Panel ────────────────────────────────────────────────────────────

// const ProfilePanel = ({
//   profile,
//   onClose,
//   onLogout,
//   onProfileUpdate,
// }: {
//   profile: UserProfile | null;
//   onClose: () => void;
//   onLogout: () => void;
//   onProfileUpdate: (p: UserProfile) => void;
// }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [username, setUsername] = useState(profile?.username ?? "");
//   const [bio, setBio] = useState(profile?.bio ?? "");
//   const [saving, setSaving] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [activeSection, setActiveSection] = useState<"main" | "privacy" | "notifications">("main");

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const updated = await updateProfile({ username, bio });
//       onProfileUpdate(updated);
//       toast.success("Profile updated!");
//       setEditMode(false);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const memberSince = profile?.createdAt
//     ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
//     : "—";

//   return (
//     <div className="flex flex-col h-full bg-white/60 backdrop-blur-xl">
//       {/* Header */}
//       <div className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50">
//         <button
//           onClick={activeSection !== "main" ? () => setActiveSection("main") : onClose}
//           className="w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-500 transition"
//         >
//           <FaArrowLeft className="text-sm" />
//         </button>
//         <h2 className="font-bold text-slate-700 text-lg">
//           {activeSection === "main" && "My Profile"}
//           {activeSection === "privacy" && "Privacy & Security"}
//           {activeSection === "notifications" && "Notifications"}
//         </h2>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {/* ── MAIN SECTION ── */}
//         {activeSection === "main" && (
//           <div className="p-5 space-y-5">
//             {/* Avatar + cover */}
//             <div className="relative">
//               <div className="h-28 rounded-2xl bg-gradient-to-r from-pink-200 via-purple-200 to-emerald-200" />
//               <div className="absolute -bottom-7 left-5">
//                 <div className="relative group">
//                   <Avatar src={profile?.avatar} name={profile?.username} size={64} />
//                   <button className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
//                     <FaCamera className="text-white text-xs" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-8">
//               {editMode ? (
//                 <div className="space-y-3">
//                   <div>
//                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
//                       Username
//                     </label>
//                     <input
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-pink-100/60 focus:border-pink-300 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
//                       Bio
//                     </label>
//                     <textarea
//                       value={bio}
//                       onChange={(e) => setBio(e.target.value)}
//                       rows={3}
//                       placeholder="Write something about yourself..."
//                       className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-pink-100/60 focus:border-pink-300 transition resize-none"
//                     />
//                   </div>
//                   <div className="flex gap-2 pt-1">
//                     <button
//                       onClick={() => setEditMode(false)}
//                       className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleSave}
//                       disabled={saving}
//                       className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
//                     >
//                       {saving ? "Saving..." : "Save Changes"}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <h3 className="text-xl font-bold text-slate-800">
//                         {profile?.username || "—"}
//                       </h3>
//                       <p className="text-sm text-slate-500">{profile?.email || "—"}</p>
//                     </div>
//                     <button
//                       onClick={() => setEditMode(true)}
//                       className="w-9 h-9 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 flex items-center justify-center transition"
//                       title="Edit profile"
//                     >
//                       <FaPen className="text-xs" />
//                     </button>
//                   </div>
//                   <p className="mt-3 text-sm text-slate-600 leading-relaxed">
//                     {profile?.bio || (
//                       <span className="italic text-slate-400">No bio yet. Add one!</span>
//                     )}
//                   </p>
//                   <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
//                     <FaShield className="text-pink-300" />
//                     Member since {memberSince}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Settings menu */}
//             {!editMode && (
//               <div className="space-y-2 pt-2">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
//                   Settings
//                 </p>

//                 {[
//                   {
//                     icon: <FaShield className="text-purple-400" />,
//                     label: "Privacy & Security",
//                     sub: "Manage your data and access",
//                     action: () => setActiveSection("privacy"),
//                   },
//                   {
//                     icon: <FaBell className="text-pink-400" />,
//                     label: "Notifications",
//                     sub: "Control how you're notified",
//                     action: () => setActiveSection("notifications"),
//                   },
//                 ].map((item) => (
//                   <button
//                     key={item.label}
//                     onClick={item.action}
//                     className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/70 transition text-left group"
//                   >
//                     <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
//                       {item.icon}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-slate-700">{item.label}</p>
//                       <p className="text-xs text-slate-400 truncate">{item.sub}</p>
//                     </div>
//                     <FaChevronRight className="text-slate-300 text-xs group-hover:text-slate-400 transition" />
//                   </button>
//                 ))}

//                 {/* Logout */}
//                 <button
//                   onClick={() => setShowLogoutConfirm(true)}
//                   className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition text-left group mt-2"
//                 >
//                   <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
//                     <FaRightFromBracket className="text-red-400" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-red-500">Log out</p>
//                     <p className="text-xs text-slate-400">Sign out of your account</p>
//                   </div>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── PRIVACY SECTION ── */}
//         {activeSection === "privacy" && (
//           <div className="p-5 space-y-4">
//             <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
//               <p className="text-sm font-semibold text-purple-700 mb-1">Account Security</p>
//               <p className="text-xs text-purple-500 leading-relaxed">
//                 Your messages are end-to-end encrypted. Only you and the people you chat with can read them.
//               </p>
//             </div>

//             {[
//               { label: "Online Status", desc: "Show when you're active", defaultOn: true },
//               { label: "Read Receipts", desc: "Let others know you've read their messages", defaultOn: true },
//               { label: "Profile Photo", desc: "Who can see your profile photo", defaultOn: false },
//             ].map((item) => (
//               <PrivacyToggle key={item.label} {...item} />
//             ))}

//             <div className="pt-2">
//               <button className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition">
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ── NOTIFICATIONS SECTION ── */}
//         {activeSection === "notifications" && (
//           <div className="p-5 space-y-4">
//             {[
//               { label: "Message Notifications", desc: "New messages from friends", defaultOn: true },
//               { label: "Friend Requests", desc: "When someone sends you a request", defaultOn: true },
//               { label: "Sound", desc: "Play sounds for notifications", defaultOn: false },
//               { label: "Desktop Alerts", desc: "Show browser notifications", defaultOn: false },
//             ].map((item) => (
//               <PrivacyToggle key={item.label} {...item} />
//             ))}
//           </div>
//         )}
//       </div>

//       {showLogoutConfirm && (
//         <ConfirmDialog
//           message="Are you sure you want to log out?"
//           onConfirm={() => {
//             setShowLogoutConfirm(false);
//             onLogout();
//           }}
//           onCancel={() => setShowLogoutConfirm(false)}
//         />
//       )}
//     </div>
//   );
// };

// // Simple toggle row for settings panels
// const PrivacyToggle = ({
//   label,
//   desc,
//   defaultOn,
// }: {
//   label: string;
//   desc: string;
//   defaultOn: boolean;
// }) => {
//   const [on, setOn] = useState(defaultOn);
//   return (
//     <div className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-white/70 transition">
//       <div className="min-w-0">
//         <p className="text-sm font-medium text-slate-700">{label}</p>
//         <p className="text-xs text-slate-400">{desc}</p>
//       </div>
//       <button
//         onClick={() => setOn((v) => !v)}
//         className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${on ? "bg-gradient-to-r from-pink-400 to-purple-400" : "bg-slate-200"}`}
//       >
//         <span
//           className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
//         />
//       </button>
//     </div>
//   );
// };

// // ─── Main ChatPage ─────────────────────────────────────────────────────────────

// export default function ChatPage() {
//   const [activeView, setActiveView] = useState<ActiveView>("chat");
//   const [activeTab, setActiveTab] = useState<ActiveTab>("friends");
//   const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
//   const [search, setSearch] = useState("");

//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [sentRequests, setSentRequests] = useState<PendingRequest[]>([]);
//   const [receivedRequests, setReceivedRequests] = useState<PendingRequest[]>([]);
//   const [profile, setProfile] = useState<UserProfile | null>(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [draft, setDraft] = useState("");
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [targetUsername, setTargetUsername] = useState("");
//   const [isSendingRequest, setIsSendingRequest] = useState(false);

//   // ── Fetch all data on mount / search change ──
//   const fetchAll = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const [friendsData, sentData, receivedData, profileData] = await Promise.all([
//         getFriends(),
//         getSentRequests(),
//         getReceivedRequests(),
//         getMyProfile(),
//       ]);

//       const filtered = friendsData.filter((f) =>
//         f.username.toLowerCase().includes(search.toLowerCase())
//       );
//       setFriends(filtered);
//       setSentRequests(sentData);
//       setReceivedRequests(receivedData);
//       if (profileData) setProfile(profileData);
//     } catch {
//       toast.error("Failed to load data");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [search]);

//   useEffect(() => {
//     const t = setTimeout(fetchAll, 250);
//     return () => clearTimeout(t);
//   }, [fetchAll]);

//   // Auto-scroll messages
//   useEffect(() => {
//     scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//   }, [messages, selectedFriend]);

//   // ── Send friend request ──
//   const handleAddFriend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!targetUsername.trim()) return;
//     setIsSendingRequest(true);
//     try {
//       const msg = await sendFriendRequest(targetUsername.trim());
//       toast.success(msg);
//       const updated = await getSentRequests();
//       setSentRequests(updated);
//       setActiveTab("sent");
//       setTargetUsername("");
//       setIsModalOpen(false);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to send request");
//     } finally {
//       setIsSendingRequest(false);
//     }
//   };

//   // ── Accept received request ──
//   const handleAccept = async (req: PendingRequest) => {
//     try {
//       await acceptRequest(req.id);
//       toast.success(`You're now friends with ${req.username}!`);
//       const [updatedReceived, updatedFriends] = await Promise.all([
//         getReceivedRequests(),
//         getFriends(),
//       ]);
//       setReceivedRequests(updatedReceived);
//       setFriends(updatedFriends);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to accept request");
//     }
//   };

//   // ── Reject received request ──
//   const handleReject = async (req: PendingRequest) => {
//     try {
//       await rejectRequest(req.id);
//       toast.success("Request removed");
//       setReceivedRequests((prev) => prev.filter((r) => r.id !== req.id));
//     } catch (err: any) {
//       toast.error(err.message || "Failed to reject request");
//     }
//   };

//   // ── Cancel sent request ──
//   const handleCancelSent = async (req: PendingRequest) => {
//     try {
//       await rejectRequest(req.id);
//       toast.success("Request cancelled");
//       setSentRequests((prev) => prev.filter((r) => r.id !== req.id));
//     } catch (err: any) {
//       toast.error(err.message || "Failed to cancel request");
//     }
//   };

//   // ── Logout ──
//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       toast.success("Logged out successfully");
//       window.location.href = "/login";
//     } catch {
//       toast.error("Logout failed, please try again");
//     }
//   };

//   // ── Send message ──
//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!draft.trim()) return;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: `m${Date.now()}`,
//         text: draft.trim(),
//         sender: "me",
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       },
//     ]);
//     setDraft("");
//   };

//   // ─── Render ──────────────────────────────────────────────────────────────────

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50 p-2 sm:p-4">
//       <Toaster position="top-center" />

//       {/* Ambient blobs */}
//       <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-pink-200/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
//       <div
//         className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse pointer-events-none"
//         style={{ animationDelay: "1s" }}
//       />

//       <div className="relative max-w-6xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-pink-100/40 border border-white/60 overflow-hidden flex">

//         {/* ── SIDEBAR ── */}
//         <aside
//           className={`${
//             selectedFriend || activeView === "profile" ? "hidden md:flex" : "flex"
//           } w-full md:w-80 lg:w-96 flex-col border-r border-pink-100/60 bg-white/40`}
//         >
//           {/* Sidebar header */}
//           <div className="p-5 border-b border-pink-100/60">
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
//                 ChatFlow
//               </h1>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 flex items-center justify-center transition hover:scale-105"
//                   title="Add Friend"
//                 >
//                   <FaPlus className="text-sm" />
//                 </button>
//                 {/* Profile button */}
//                 <button
//                   onClick={() => setActiveView(activeView === "profile" ? "chat" : "profile")}
//                   className="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-200 hover:border-pink-400 transition hover:scale-105"
//                   title="My Profile"
//                 >
//                   <Avatar src={profile?.avatar} name={profile?.username} size={36} />
//                 </button>
//               </div>
//             </div>

//             <div className="relative mb-4">
//               <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 text-xs pointer-events-none" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search friends..."
//                 className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/70 border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition"
//               />
//             </div>

//             {/* Tabs */}
//             <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
//               {(
//                 [
//                   { key: "friends", icon: <FaUserGroup />, label: "Friends", count: null },
//                   { key: "sent", icon: <FaClock />, label: "Sent", count: sentRequests.length },
//                   { key: "received", icon: <FaInbox />, label: "Recv", count: receivedRequests.length },
//                 ] as const
//               ).map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg transition relative ${
//                     activeTab === tab.key
//                       ? "bg-white text-pink-600 shadow-sm"
//                       : "hover:text-slate-800"
//                   }`}
//                 >
//                   <span className="text-[10px]">{tab.icon}</span>
//                   {tab.label}
//                   {tab.count !== null && tab.count > 0 && (
//                     <span className="ml-0.5 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
//                       {tab.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Sidebar list */}
//           <div className="flex-1 overflow-y-auto p-2">
//             {isLoading ? (
//               <div className="space-y-2 p-2">
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
//                     <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0" />
//                     <div className="flex-1 space-y-2">
//                       <div className="h-3 bg-slate-100 rounded w-2/3" />
//                       <div className="h-2 bg-slate-100 rounded w-1/2" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <>
//                 {/* FRIENDS TAB */}
//                 {activeTab === "friends" &&
//                   (friends.length === 0 ? (
//                     <EmptyState
//                       icon="💬"
//                       text="No friends yet"
//                       sub='Click "+" to send a friend request'
//                     />
//                   ) : (
//                     friends.map((friend) => (
//                       <button
//                         key={friend.id}
//                         onClick={() => {
//                           setSelectedFriend(friend);
//                           setActiveView("chat");
//                         }}
//                         className={`w-full flex items-center gap-3 p-3 rounded-2xl transition mb-1 text-left ${
//                           selectedFriend?.id === friend.id
//                             ? "bg-gradient-to-r from-pink-100 to-purple-100 shadow-sm"
//                             : "hover:bg-white/70"
//                         }`}
//                       >
//                         <Avatar src={friend.avatar} name={friend.username} size={48} online={friend.online} />
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between gap-2">
//                             <p className="font-semibold text-sm text-slate-700 truncate">
//                               {friend.username}
//                             </p>
//                             <span className="text-[10px] text-slate-400 shrink-0">
//                               {friend.time || ""}
//                             </span>
//                           </div>
//                           <p className="text-xs text-slate-500 truncate mt-0.5">
//                             {friend.lastMessage || "Start chatting!"}
//                           </p>
//                         </div>
//                         {friend.unread > 0 && (
//                           <span className="bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
//                             {friend.unread}
//                           </span>
//                         )}
//                       </button>
//                     ))
//                   ))}

//                 {/* SENT TAB */}
//                 {activeTab === "sent" &&
//                   (sentRequests.length === 0 ? (
//                     <EmptyState icon="📤" text="No sent requests" sub="Search for friends using the + button" />
//                   ) : (
//                     sentRequests.map((req) => (
//                       <div
//                         key={req.id}
//                         className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/40 mb-1"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <Avatar src={req.avatar} name={req.username} size={40} />
//                           <div className="min-w-0">
//                             <p className="font-semibold text-sm text-slate-700 truncate">
//                               {req.username}
//                             </p>
//                             <p className="text-[10px] text-slate-400">Sent at {req.time}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 shrink-0">
//                           <span className="text-[11px] bg-amber-50 text-amber-600 font-medium px-2 py-1 rounded-md border border-amber-100">
//                             Pending
//                           </span>
//                           <button
//                             onClick={() => handleCancelSent(req)}
//                             className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition"
//                             title="Cancel request"
//                           >
//                             <FaXmark className="text-xs" />
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ))}

//                 {/* RECEIVED TAB */}
//                 {activeTab === "received" &&
//                   (receivedRequests.length === 0 ? (
//                     <EmptyState icon="📥" text="No incoming requests" sub="When someone adds you, they'll appear here" />
//                   ) : (
//                     receivedRequests.map((req) => (
//                       <div
//                         key={req.id}
//                         className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/40 mb-1"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <Avatar src={req.avatar} name={req.username} size={40} />
//                           <div className="min-w-0">
//                             <p className="font-semibold text-sm text-slate-700 truncate">
//                               {req.username}
//                             </p>
//                             <p className="text-[10px] text-slate-400">Received {req.time}</p>
//                           </div>
//                         </div>
//                         <div className="flex gap-1.5 shrink-0">
//                           <button
//                             onClick={() => handleAccept(req)}
//                             className="w-8 h-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 flex items-center justify-center transition"
//                             title="Accept"
//                           >
//                             <FaCheck className="text-xs" />
//                           </button>
//                           <button
//                             onClick={() => handleReject(req)}
//                             className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition"
//                             title="Reject"
//                           >
//                             <FaXmark className="text-xs" />
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ))}
//               </>
//             )}
//           </div>
//         </aside>

//         {/* ── MAIN PANEL ── */}
//         <section
//           className={`${
//             selectedFriend || activeView === "profile" ? "flex" : "hidden md:flex"
//           } flex-1 flex-col bg-gradient-to-b from-white/30 to-pink-50/30 overflow-hidden`}
//         >
//           {/* Profile view */}
//           {activeView === "profile" && (
//             <ProfilePanel
//               profile={profile}
//               onClose={() => setActiveView("chat")}
//               onLogout={handleLogout}
//               onProfileUpdate={(updated) => {
//                 setProfile(updated);
//                 setActiveView("chat");
//               }}
//             />
//           )}

//           {/* Chat view */}
//           {activeView === "chat" && (
//             <>
//               {selectedFriend ? (
//                 <>
//                   {/* Chat header */}
//                   <header className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50 backdrop-blur-xl shrink-0">
//                     <button
//                       onClick={() => setSelectedFriend(null)}
//                       className="md:hidden w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-600 transition"
//                     >
//                       <FaArrowLeft className="text-sm" />
//                     </button>
//                     <Avatar
//                       src={selectedFriend.avatar}
//                       name={selectedFriend.username}
//                       size={44}
//                       online={selectedFriend.online}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-slate-700 truncate">
//                         {selectedFriend.username}
//                       </p>
//                       <p className="text-xs text-slate-400">
//                         {selectedFriend.online ? "Online" : "Offline"}
//                       </p>
//                     </div>
//                     <button className="w-9 h-9 rounded-full hover:bg-white flex items-center justify-center text-slate-500 transition">
//                       <FaEllipsisVertical className="text-sm" />
//                     </button>
//                   </header>

//                   {/* Messages */}
//                   <div
//                     ref={scrollRef}
//                     className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3"
//                   >
//                     {messages.length === 0 && (
//                       <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
//                         <p className="text-3xl mb-2">👋</p>
//                         <p className="text-sm text-slate-500">
//                           Say hi to {selectedFriend.username}!
//                         </p>
//                       </div>
//                     )}
//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`flex items-end gap-2 ${
//                           msg.sender === "me" ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         {msg.sender === "them" && (
//                           <Avatar src={selectedFriend.avatar} name={selectedFriend.username} size={28} />
//                         )}
//                         <div
//                           className={`max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
//                             msg.sender === "me"
//                               ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-md"
//                               : "bg-white text-slate-700 rounded-bl-md"
//                           }`}
//                         >
//                           <p>{msg.text}</p>
//                           <p
//                             className={`text-[10px] mt-1 ${
//                               msg.sender === "me" ? "text-white/70 text-right" : "text-slate-400"
//                             }`}
//                           >
//                             {msg.time}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Input */}
//                   <form
//                     onSubmit={handleSendMessage}
//                     className="p-3 sm:p-4 border-t border-pink-100/60 bg-white/50 backdrop-blur-xl shrink-0"
//                   >
//                     <div className="flex items-center gap-2 bg-white rounded-2xl border border-pink-100 px-3 py-2">
//                       <input
//                         value={draft}
//                         onChange={(e) => setDraft(e.target.value)}
//                         placeholder="Type a message..."
//                         className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
//                       />
//                       <button
//                         type="submit"
//                         disabled={!draft.trim()}
//                         className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white flex items-center justify-center disabled:opacity-50 transition hover:opacity-90"
//                       >
//                         <FaPaperPlane className="text-xs" />
//                       </button>
//                     </div>
//                   </form>
//                 </>
//               ) : (
//                 // Empty state
//                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
//                   <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-emerald-200 flex items-center justify-center text-5xl mb-6 shadow-lg">
//                     💬
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
//                     Your messages
//                   </h2>
//                   <p className="text-sm text-slate-500 max-w-xs">
//                     Select a friend or add a new one to chat 🌸
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </section>
//       </div>

//       {/* ── ADD FRIEND MODAL ── */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
//           <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
//             <div className="p-5 border-b border-pink-100/60 flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
//               <h3 className="font-bold text-slate-700 text-lg">Send Friend Request</h3>
//               <button
//                 onClick={() => { setIsModalOpen(false); setTargetUsername(""); }}
//                 className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
//               >
//                 <FaXmark className="text-sm" />
//               </button>
//             </div>
//             <form onSubmit={handleAddFriend} className="p-5 space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={targetUsername}
//                   onChange={(e) => setTargetUsername(e.target.value)}
//                   placeholder="e.g. Neha_Thakur"
//                   className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-pink-100/50 focus:border-pink-300 transition"
//                 />
//               </div>
//               <div className="flex gap-2 justify-end pt-1">
//                 <button
//                   type="button"
//                   onClick={() => { setIsModalOpen(false); setTargetUsername(""); }}
//                   className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSendingRequest || !targetUsername.trim()}
//                   className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 shadow-md transition disabled:opacity-50"
//                 >
//                   {isSendingRequest ? "Sending..." : "Send Request 🌸"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Tiny helpers ──────────────────────────────────────────────────────────────

// const EmptyState = ({ icon, text, sub }: { icon: string; text: string; sub: string }) => (
//   <div className="flex flex-col items-center justify-center py-12 text-center px-4">
//     <p className="text-4xl mb-3">{icon}</p>
//     <p className="text-sm font-medium text-slate-500">{text}</p>
//     <p className="text-xs text-slate-400 mt-1">{sub}</p>
//   </div>
// );