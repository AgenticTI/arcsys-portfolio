"use client";

import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { History } from "lucide-react";

const TODAY = "2026-03-17";

export default function HistoricoPage() {
  const appointments = useAppointmentsStore((s) => s.appointments);

  const past = appointments
    .filter((a) => a.patientId === patient.id && a.date < TODAY)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Histórico de Consultas</h1>

      {past.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma consulta passada encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {past.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              doctor={(doctors as Doctor[]).find((d) => d.id === appt.doctorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
