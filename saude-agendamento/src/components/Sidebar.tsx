"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, LogOut } from "lucide-react";
import patient from "@/data/patient.json";

const navItems = [
  { href: "/paciente/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar Médico", icon: Search },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  const initials = patient.name.split(" ").map((n) => n[0]).join("");

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-dark-card flex-col py-4 px-3 gap-1 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
          </svg>
        </div>
        <span className="font-bold text-white text-sm">SaúdeApp</span>
      </div>

      {/* User card */}
      <div className="bg-dark-border rounded-xl px-3 py-2.5 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{patient.name}</p>
          <p className="text-[9px] text-neutral-500">Paciente</p>
        </div>
      </div>

      {/* Menu label */}
      <p className="text-[9px] text-neutral-500 font-semibold tracking-wider px-2 mb-1">
        MENU
      </p>

      {/* Nav items */}
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      {/* CTA */}
      <Link
        href="/paciente/buscar"
        className="mt-auto bg-primary text-dark-card text-xs font-bold py-3 px-4 rounded-xl text-center hover:bg-primary/90 transition-colors"
      >
        + Agendar Consulta
      </Link>
    </aside>
  );
}
