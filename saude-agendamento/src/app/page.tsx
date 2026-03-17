import Link from "next/link";
import { Stethoscope, UserRound, BriefcaseMedical } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-[20px] shadow-card p-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary-light p-4 rounded-full">
            <Stethoscope size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">SaúdeApp</h1>
          <p className="text-neutral-500 text-sm text-center">
            Sistema de agendamento médico
          </p>
        </div>

        {/* Role selection */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-sm font-medium text-neutral-500 text-center uppercase tracking-wide">
            Entrar como
          </p>

          <Link href="/paciente/dashboard" className="w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-[14px] font-semibold text-base hover:bg-primary/90 transition-colors">
              <UserRound size={20} />
              Paciente
            </button>
          </Link>

          <Link href="/medico/agenda" className="w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-white text-primary border-2 border-primary py-4 px-6 rounded-[14px] font-semibold text-base hover:bg-primary-light transition-colors">
              <BriefcaseMedical size={20} />
              Médico
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
