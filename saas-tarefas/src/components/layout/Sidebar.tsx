"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects, mockUser } from "@/data/mock";
import { Avatar } from "@/components/ui/Avatar";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeProjectId, setActiveProject } = useTaskStore();

  return (
    <aside className="w-60 h-screen bg-bg-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Hazel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Projects */}
      <div className="px-3 mt-6">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Projects
        </p>
        <div className="space-y-0.5">
          {mockProjects.map((project) => {
            const isActive = activeProjectId === project.id;
            return (
              <Link
                key={project.id}
                href={`/board/${project.id}`}
                onClick={() => setActiveProject(project.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
                <span className="ml-auto text-xs text-gray-500">{project.taskCount}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer — User */}
      <div className="mt-auto px-3 pb-5">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar initials={mockUser.avatarInitials} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
