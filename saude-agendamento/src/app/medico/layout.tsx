import doctorUser from "@/data/doctor-user.json";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top header */}
      <header className="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={22} className="text-primary" />
          <span className="font-bold text-neutral-900 text-lg">SaúdeApp</span>
          <span className="text-neutral-300 mx-2">|</span>
          <span className="text-sm text-neutral-500">Painel do Médico</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-neutral-900 text-sm">{doctorUser.name}</p>
            <p className="text-xs text-neutral-500">{doctorUser.specialty}</p>
          </div>
          <img
            src={doctorUser.photo}
            alt={doctorUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 ml-2">
            Sair
          </Link>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
