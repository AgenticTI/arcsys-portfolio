"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-accent" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function PreferencesSection() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-4">
      {/* Preferences */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Notifications</p>
              <p className="text-xs text-text-muted">Receive reminders for upcoming tasks</p>
            </div>
            <Toggle checked={notifications} onChange={() => setNotifications((v) => !v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Theme</p>
              <p className="text-xs text-text-muted">Dark mode coming soon</p>
            </div>
            <span className="text-xs px-2 py-1 bg-accent-soft text-accent rounded-full font-medium">
              Light
            </span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">About Hazel</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Version</span>
            <span className="text-text-primary font-medium">1.0.0-mvp</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Docs</span>
            <a href="#" className="text-accent hover:underline font-medium">
              docs.hazel.app
            </a>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Built with</span>
            <span className="text-text-primary font-medium">Next.js · Tailwind · Framer Motion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
