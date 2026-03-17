"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        checked ? "bg-accent" : "bg-bg-card-2 border border-border"
      }`}
      style={checked ? { boxShadow: "0 0 8px rgba(230,206,0,0.3)" } : {}}
    >
      <span
        className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function PreferencesSection() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-4">
      <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">Preferences</h2>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-text-primary">Notifications</p>
              <p className="text-[13px] text-text-muted mt-0.5">Receive reminders for upcoming tasks</p>
            </div>
            <Toggle checked={notifications} onChange={() => setNotifications((v) => !v)} />
          </div>
          <div className="h-px bg-border-soft" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-text-primary">Theme</p>
              <p className="text-[13px] text-text-muted mt-0.5">Currently using dark mode</p>
            </div>
            <span className="text-[12px] px-2.5 py-1 bg-accent-dim border border-accent-glow text-accent rounded-full font-semibold">
              Dark
            </span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
        <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">About Hazel</h2>
        <div className="space-y-3 text-[15px]">
          {[
            { label: "Version", value: "1.0.0-mvp" },
            { label: "Built with", value: "Next.js · Tailwind · Framer Motion" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-text-muted">{label}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
