"use client";

import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { StatusBadge } from "@/components/StatusBadge";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Doctor, Appointment } from "@/types";

const TODAY = "2026-03-17";

function getNextAppointment(appointments: Appointment[]): Appointment | null {
  const upcoming = appointments
    .filter((a) => a.status !== "cancelled" && a.date >= TODAY)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return upcoming[0] ?? null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function PatientDashboard() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const myAppointments = appointments.filter((a) => a.patientId === patient.id);
  const upcoming = myAppointments.filter((a) => a.date >= TODAY && a.status !== "cancelled");
  const nextAppointment = getNextAppointment(myAppointments);
  const nextDoctor = nextAppointment
    ? (doctors as Doctor[]).find((d) => d.id === nextAppointment.doctorId)
    : null;

  const countAgendadas = myAppointments.filter((a) => a.date >= TODAY && a.status !== "cancelled").length;
  const countConfirmadas = myAppointments.filter((a) => a.status === "confirmed").length;
  const countPendentes = myAppointments.filter((a) => a.status === "pending").length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header — hidden on mobile (MobileHeader handles it) */}
      <div className="hidden md:flex justify-between items-center mb-5">
        <div>
          <p className="text-xs text-neutral-500">Bem-vindo de volta,</p>
          <p className="text-xl font-extrabold text-neutral-900">{patient.name}</p>
        </div>
      </div>

      {/* Next appointment hero card */}
      {nextAppointment && nextDoctor ? (
        <div className="bg-gradient-to-r from-dark-card to-dark-border rounded-[20px] p-5 text-white mb-5">
          <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-3">
            Próxima Consulta
          </p>
          <div className="flex items-center gap-4">
            <img
              src={nextDoctor.photo}
              alt={nextDoctor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base truncate">{nextDoctor.name}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{nextDoctor.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={13} className="text-neutral-500 shrink-0" />
                <span className="text-xs text-neutral-500 truncate">{formatDate(nextAppointment.date)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-extrabold text-primary leading-none">{nextAppointment.time}</p>
              <div className="mt-2">
                <StatusBadge status={nextAppointment.status} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dark-card rounded-[20px] p-6 text-center text-neutral-500 mb-5 border border-dark-border">
          <Calendar size={32} className="mx-auto mb-2 text-neutral-500 opacity-40" />
          <p className="text-sm">Nenhuma consulta agendada.</p>
          <Link href="/paciente/buscar" className="inline-block mt-3">
            <span className="text-xs text-primary font-semibold">Agendar agora →</span>
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-card p-3 text-center">
          <p className="text-2xl font-extrabold text-neutral-900">{countAgendadas}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">Agendadas</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-3 text-center">
          <p className="text-2xl font-extrabold text-primary">{countConfirmadas}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">Confirmadas</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-3 text-center">
          <p className="text-2xl font-extrabold text-amber-500">{countPendentes}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">Pendentes</p>
        </div>
      </div>

      {/* Upcoming appointments list */}
      <h2 className="text-sm font-bold text-neutral-900 mb-3">Consultas Agendadas</h2>
      {upcoming.length === 0 ? (
        <p className="text-neutral-500 text-sm">Nenhuma consulta futura.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {upcoming.map((appt) => (
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
