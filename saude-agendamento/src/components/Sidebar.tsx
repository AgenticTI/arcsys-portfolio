"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, LogOut, Stethoscope } from "lucide-react";

const navItems = [
  { href: "/paciente/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar Médico", icon: Search },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-neutral-200 flex flex-col py-6 px-4 gap-1 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-6">
        <Stethoscope size={22} className="text-primary" />
        <span className="font-bold text-neutral-900 text-lg">SaúdeApp</span>
      </div>

      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-primary-light text-primary"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <LogOut size={18} />
          Sair
        </Link>
      </div>
    </aside>
  );
}
