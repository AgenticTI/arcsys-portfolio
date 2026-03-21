"use client";

import { useState } from "react";
import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { StatusBadge } from "@/components/StatusBadge";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { History } from "lucide-react";

const TODAY = "2026-03-17";

type FilterType = "all" | "confirmed" | "cancelled";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoricoPage() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const [filter, setFilter] = useState<FilterType>("all");

  const past = appointments
    .filter((a) => a.patientId === patient.id && a.date < TODAY)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const displayed = filter === "all" ? past : past.filter((a) => a.status === filter);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "confirmed", label: "Confirmadas" },
    { key: "cancelled", label: "Canceladas" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="hidden md:block text-xl font-extrabold text-neutral-900 mb-5">Histórico de Consultas</h1>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f.key
                ? "bg-primary text-dark-card border-primary font-bold"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma consulta encontrada.</p>
        </div>
      ) : (
        <>
          {/* Desktop: table-like card */}
          <div className="hidden md:block bg-white rounded-[20px] shadow-card overflow-hidden">
            {displayed.map((appt, idx) => {
              const doctor = (doctors as Doctor[]).find((d) => d.id === appt.doctorId);
              return (
                <div
                  key={appt.id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${idx < displayed.length - 1 ? "border-b border-neutral-100" : ""}`}
                >
                  {doctor?.photo && (
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-neutral-900 truncate">
                      {doctor?.name ?? "Médico não encontrado"}
                    </p>
                    <p className="text-xs text-neutral-500">{doctor?.specialty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-neutral-900">{formatDate(appt.date)}</p>
                    <p className="text-xs text-neutral-500">{appt.time}</p>
                  </div>
                  <div className="shrink-0 w-24 flex justify-end">
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: stacked AppointmentCard */}
          <div className="md:hidden flex flex-col gap-2.5">
            {displayed.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                doctor={(doctors as Doctor[]).find((d) => d.id === appt.doctorId)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
