import { LayoutDashboard, Columns3, Calendar, BarChart2, FileText, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { href: string; icon: LucideIcon; label: string };

export const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/board",     icon: Columns3,        label: "Board" },
  { href: "/calendar",  icon: Calendar,        label: "Calendar" },
  { href: "/reports",   icon: BarChart2,       label: "Reports" },
  { href: "/docs",      icon: FileText,        label: "Documents" },
  { href: "/settings",  icon: Settings,        label: "Settings" },
];

export function getIsActive(href: string, pathname: string): boolean {
  if (href === "/board") return pathname.startsWith("/board");
  return pathname === href;
}
