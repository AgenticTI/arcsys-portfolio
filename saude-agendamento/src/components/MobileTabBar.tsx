"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Clock, User, Plus } from "lucide-react";

const tabs = [
  { href: "/paciente/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/paciente/buscar", label: "Buscar", icon: Search },
  { href: "__fab__", label: "", icon: Plus },
  { href: "/paciente/historico", label: "Histórico", icon: Clock },
  { href: "/paciente/perfil", label: "Perfil", icon: User }, // placeholder — no route exists yet, will show 404
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around items-center px-2 py-1.5 pb-[env(safe-area-inset-bottom)] z-50">
      {tabs.map(({ href, label, icon: Icon }) => {
        if (href === "__fab__") {
          return (
            <Link
              key="fab"
              href="/paciente/buscar"
              className="w-11 h-11 -mt-5 rounded-full bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(136,205,10,0.3)]"
            >
              <Plus size={22} className="text-white" strokeWidth={2.5} />
            </Link>
          );
        }

        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 ${
              active ? "text-primary" : "text-neutral-400"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[9px] ${active ? "font-semibold" : ""}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
