"use client";

import { usePathname } from "next/navigation";
import patient from "@/data/patient.json";

const pageTitles: Record<string, string> = {
  "/paciente/dashboard": "",
  "/paciente/buscar": "Buscar Médico",
  "/paciente/historico": "Histórico",
};

export function MobileHeader() {
  const pathname = usePathname();
  const isDashboard = pathname === "/paciente/dashboard";
  const title = pageTitles[pathname];

  if (isDashboard) {
    return (
      <header className="md:hidden bg-white px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">Bem-vindo,</p>
          <p className="text-[15px] font-bold text-neutral-900">
            {patient.name}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
          {patient.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </header>
    );
  }

  if (title) {
    return (
      <header className="md:hidden bg-white px-4 py-3 border-b border-neutral-200">
        <p className="text-[15px] font-bold text-neutral-900">{title}</p>
      </header>
    );
  }

  return null;
}
