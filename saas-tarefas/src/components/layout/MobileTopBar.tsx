"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockUser } from "@/data/mock";
import { Bell } from "lucide-react";
import { navItems, getIsActive } from "./navItems";

export function MobileTopBar() {
  const pathname = usePathname();
  const { activeProjectId } = useTaskStore();

  return (
    <div className="flex md:hidden items-center justify-between px-3 h-14 bg-bg-sidebar border-b border-border flex-shrink-0">
      {/* Logo */}
      <div
        className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0"
        style={{ boxShadow: "0 4px 16px rgba(230,206,0,0.28)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = getIsActive(href, pathname);
          return (
            <Link
              key={href}
              href={href === "/board" ? `/board/${activeProjectId}` : href}
              title={label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                active
                  ? "bg-accent text-black shadow-[0_2px_12px_rgba(230,206,0,0.28)]"
                  : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
            </Link>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Bell */}
        <div className="relative w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary cursor-pointer hover:bg-bg-card-2 transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-accent-orange border-2 border-bg-sidebar" />
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display text-[11px] font-bold text-accent cursor-pointer">
          {mockUser.avatarInitials.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
