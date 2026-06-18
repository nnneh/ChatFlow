"use client";
import { useState } from "react";

type Props = { label: string; desc: string; defaultOn: boolean };

export default function PrivacyToggle({ label, desc, defaultOn }: Props) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-white/70 transition">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${
          on ? "bg-gradient-to-r from-pink-400 to-purple-400" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}