"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockUser } from "@/data/mock";
import {
  LayoutDashboard,
  Columns3,
  Calendar,
  BarChart2,
  FileText,
  Settings,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/board",     icon: Columns3,        label: "Board" },
  { href: "/calendar",  icon: Calendar,        label: "Calendar" },
  { href: "/reports",   icon: BarChart2,       label: "Reports" },
  { href: "/docs",      icon: FileText,        label: "Documents" },
  { href: "/settings",  icon: Settings,        label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProjectId } = useTaskStore();

  // Determine active nav: dashboard, board (any project), settings
  const getIsActive = (href: string) => {
    if (href === "/board") return pathname.startsWith("/board");
    return pathname === href;
  };

  return (
    <aside
      className="w-[68px] min-w-[68px] h-screen flex flex-col items-center py-[22px]
                 bg-bg-sidebar border-r border-border flex-shrink-0"
      style={{ backdropFilter: "blur(24px) saturate(1.6)" }}
    >
      {/* Logo */}
      <div
        className="w-[38px] h-[38px] rounded-xl bg-accent flex items-center justify-center mb-8 flex-shrink-0"
        style={{ boxShadow: "0 4px 16px rgba(230,206,0,0.28)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
          <rect x="3" y="3" width="8" height="8" rx="1.5"/>
          <rect x="13" y="3" width="8" height="8" rx="1.5"/>
          <rect x="3" y="13" width="8" height="8" rx="1.5"/>
          <rect x="13" y="13" width="8" height="8" rx="1.5"/>
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1.5 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = getIsActive(href);
          return (
            <Link
              key={href}
              href={href === "/board" ? `/board/${activeProjectId}` : href}
              title={label}
              className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all ${
                active
                  ? "bg-accent text-black shadow-[0_2px_12px_rgba(230,206,0,0.28)]"
                  : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-3.5">
        {/* Bell */}
        <div className="relative w-[38px] h-[38px] rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary cursor-pointer hover:bg-bg-card-2 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-[9px] right-[9px] w-[7px] h-[7px] rounded-full bg-accent-orange border-2 border-bg-sidebar" />
        </div>

        {/* Avatar */}
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display text-[13px] font-bold text-accent cursor-pointer">
          {mockUser.avatarInitials.toUpperCase()}
        </div>
      </div>
    </aside>
  );
}
