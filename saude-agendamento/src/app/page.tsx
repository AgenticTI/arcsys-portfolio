import Link from "next/link";
import {
  Calendar,
  Search,
  BarChart3,
  Users,
} from "lucide-react";

const features = [
  { icon: Calendar, title: "Agendamento", desc: "Rápido e fácil" },
  { icon: Search, title: "Busca", desc: "Por especialidade" },
  { icon: BarChart3, title: "Dashboard", desc: "Stats em tempo real" },
  { icon: Users, title: "Dois Papéis", desc: "Paciente e Médico" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      {/* Navbar */}
      <nav className="bg-dark-bg px-6 py-3 flex items-center justify-between border-b border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white">SaúdeApp</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[11px] text-neutral-500">Funcionalidades</span>
          <span className="text-[11px] text-neutral-500">Sobre</span>
        </div>
        <Link
          href="/paciente/dashboard"
          className="bg-primary text-dark-card text-[11px] font-bold py-1.5 px-4 rounded-lg"
        >
          Acessar
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-dark-bg to-dark-card px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] text-primary font-bold tracking-[2px] mb-3">
              AGENDAMENTO INTELIGENTE
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Sua saúde merece
              <br />
              organização
            </h1>
            <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto md:mx-0">
              Conectamos pacientes e médicos em uma plataforma simples e moderna.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Link
                href="/paciente/dashboard"
                className="bg-primary text-dark-card text-sm font-bold py-3 px-8 rounded-xl text-center"
              >
                Sou Paciente
              </Link>
              <Link
                href="/medico/agenda"
                className="border-[1.5px] border-primary text-primary text-sm font-bold py-3 px-8 rounded-xl text-center"
              >
                Sou Médico
              </Link>
            </div>
          </div>

          {/* Mini mockup preview — hidden on mobile */}
          <div className="hidden md:block w-48 shrink-0">
            <div className="bg-dark-border rounded-xl p-4 rotate-2">
              <div className="bg-primary/10 rounded-lg p-3 mb-2">
                <p className="text-[8px] text-primary font-semibold">PRÓXIMA CONSULTA</p>
                <p className="text-[10px] text-white font-semibold mt-0.5">Dr. Carlos Lima</p>
                <p className="text-[8px] text-neutral-500">08:30 · Clínico Geral</p>
              </div>
              <div className="bg-dark-surface rounded-md p-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-neutral-500" />
                  <p className="text-[8px] text-neutral-400">Dra. Ana Costa</p>
                </div>
              </div>
              <div className="bg-dark-surface rounded-md p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-neutral-500" />
                  <p className="text-[8px] text-neutral-400">Dr. Bruno Neves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-dark-card border-t border-dark-border px-6 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-[10px] font-semibold text-white">{title}</p>
              <p className="text-[8px] text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg py-4 text-center">
        <p className="text-[9px] text-neutral-500">
          Projeto de portfólio · Dados simulados
        </p>
      </footer>
    </div>
  );
}
