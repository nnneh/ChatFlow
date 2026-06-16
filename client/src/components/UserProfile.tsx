"use client";
import { useState } from "react";
import {
  FaArrowLeft, FaPen, FaCamera, FaShield, FaBell,
  FaChevronRight, FaRightFromBracket,
} from "react-icons/fa6";
import { UserProfile } from "../types";
import Avatar from "./Avatar";
import PrivacyToggle from "./PrivacyToggle";
import ConfirmDialog from "./ConfirmDialog";

type Section = "main" | "privacy" | "notifications";

type Props = {
  profile: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
  onProfileUpdate: (payload: { username?: string; bio?: string }) => Promise<UserProfile>;
};

export default function UserProfile({ profile, onClose, onLogout, onProfileUpdate }: Props) {
  const [section, setSection]               = useState<Section>("main");
  const [editMode, setEditMode]             = useState(false);
  const [username, setUsername]             = useState(profile?.username ?? "");
  const [bio, setBio]                       = useState(profile?.bio ?? "");
  const [saving, setSaving]                 = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "—";

  const handleSave = async () => {
    setSaving(true);
    try {
      await onProfileUpdate({ username, bio });
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const sectionTitle: Record<Section, string> = {
    main: "My Profile",
    privacy: "Privacy & Security",
    notifications: "Notifications",
  };

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-pink-100/60 bg-white/50 shrink-0">
        <button
          onClick={section !== "main" ? () => setSection("main") : onClose}
          className="w-9 h-9 rounded-full hover:bg-pink-100/60 flex items-center justify-center text-slate-500 transition"
        >
          <FaArrowLeft className="text-sm" />
        </button>
        <h2 className="font-bold text-slate-700 text-lg">{sectionTitle[section]}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── MAIN ── */}
        {section === "main" && (
          <div className="p-5 space-y-5">
            {/* Cover + avatar */}
            <div className="relative">
              <div className="h-28 rounded-2xl bg-gradient-to-r from-pink-200 via-purple-200 to-emerald-200" />
              <div className="absolute -bottom-7 left-5">
                <div className="relative group">
                  <Avatar src={profile?.avatar} name={profile?.username} size={64} />
                  <button className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <FaCamera className="text-white text-xs" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {editMode ? (
                /* Edit form */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Username</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-pink-100/60 focus:border-pink-300 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Write something about yourself..."
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-pink-100/60 focus:border-pink-300 transition resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditMode(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition">
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Display */
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{profile?.username || "—"}</h3>
                      <p className="text-sm text-slate-500">{profile?.email || "—"}</p>
                    </div>
                    <button onClick={() => setEditMode(true)} title="Edit profile" className="w-9 h-9 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 flex items-center justify-center transition">
                      <FaPen className="text-xs" />
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {profile?.bio || <span className="italic text-slate-400">No bio yet. Add one!</span>}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                    <FaShield className="text-pink-300" /> Member since {memberSince}
                  </div>
                </div>
              )}
            </div>

            {/* Settings menu */}
            {!editMode && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Settings</p>

                {[
                  { icon: <FaShield className="text-purple-400" />, label: "Privacy & Security", sub: "Manage your data", action: () => setSection("privacy") },
                  { icon: <FaBell   className="text-pink-400"  />, label: "Notifications",       sub: "Control alerts",      action: () => setSection("notifications") },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/70 transition text-left group">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.sub}</p>
                    </div>
                    <FaChevronRight className="text-slate-300 text-xs group-hover:text-slate-400 transition" />
                  </button>
                ))}

                <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition text-left mt-2">
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <FaRightFromBracket className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-500">Log out</p>
                    <p className="text-xs text-slate-400">Sign out of your account</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PRIVACY ── */}
        {section === "privacy" && (
          <div className="p-5 space-y-4">
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-sm font-semibold text-purple-700 mb-1">Account Security</p>
              <p className="text-xs text-purple-500 leading-relaxed">
                Your messages are end-to-end encrypted. Only you and the people you chat with can read them.
              </p>
            </div>
            {[
              { label: "Online Status",   desc: "Show when you're active",                   defaultOn: true },
              { label: "Read Receipts",   desc: "Let others know you've read their messages", defaultOn: true },
              { label: "Profile Photo",   desc: "Who can see your profile photo",             defaultOn: false },
            ].map((item) => <PrivacyToggle key={item.label} {...item} />)}
            <div className="pt-2">
              <button className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {section === "notifications" && (
          <div className="p-5 space-y-4">
            {[
              { label: "Message Notifications", desc: "New messages from friends",            defaultOn: true },
              { label: "Friend Requests",        desc: "When someone sends you a request",    defaultOn: true },
              { label: "Sound",                  desc: "Play sounds for notifications",       defaultOn: false },
              { label: "Desktop Alerts",         desc: "Show browser notifications",          defaultOn: false },
            ].map((item) => <PrivacyToggle key={item.label} {...item} />)}
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <ConfirmDialog
          message="Are you sure you want to log out?"
          onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}