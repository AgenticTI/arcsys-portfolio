"use client";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import doctorUser from "@/data/doctor-user.json";

const navIcons = [
  { icon: LayoutDashboard, active: true },
  { icon: Calendar, active: false },
  { icon: Users, active: false },
  { icon: Settings, active: false },
];

export function DoctorSidebar() {
  return (
    <aside className="hidden md:flex w-16 min-h-screen bg-dark-card border-r border-dark-border flex-col items-center py-4 gap-1 shrink-0">
      {/* Logo */}
      <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center mb-5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1D23" strokeWidth="2.5">
          <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
          <path d="M14 2h-1a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V4a2 2 0 00-2-2z" />
        </svg>
      </div>

      {/* Nav icons */}
      {navIcons.map(({ icon: Icon, active }, i) => (
        <div
          key={i}
          className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
            active ? "bg-primary/10" : ""
          }`}
        >
          <Icon size={20} className={active ? "text-primary" : "text-neutral-500"} />
        </div>
      ))}

      {/* Avatar bottom */}
      <div className="mt-auto">
        <img
          src={doctorUser.photo}
          alt={doctorUser.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-primary"
        />
      </div>
    </aside>
  );
}
