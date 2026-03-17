"use client";

import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { StatusBadge } from "@/components/StatusBadge";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src={patient.photo}
            alt={patient.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-neutral-500 text-sm">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
          </div>
        </div>
        <Link href="/paciente/buscar">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-[14px] font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Plus size={18} />
            Agendar consulta
          </button>
        </Link>
      </div>

      {/* Next appointment hero card */}
      {nextAppointment && nextDoctor ? (
        <div className="bg-primary rounded-[20px] p-6 text-white mb-6">
          <p className="text-primary-light text-xs font-medium uppercase tracking-wide mb-3">
            Próxima Consulta
          </p>
          <div className="flex items-center gap-4">
            <img
              src={nextDoctor.photo}
              alt={nextDoctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <p className="font-bold text-lg">{nextDoctor.name}</p>
              <p className="text-primary-light text-sm">{nextDoctor.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                <Calendar size={14} className="text-primary-light" />
                <span className="text-sm">{formatDate(nextAppointment.date)}</span>
                <span className="text-primary-light">·</span>
                <span className="text-sm">{nextAppointment.time}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <StatusBadge status={nextAppointment.status} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] shadow-card p-6 text-center text-neutral-500 mb-6">
          <Calendar size={32} className="mx-auto mb-2 text-neutral-300" />
          <p className="text-sm">Nenhuma consulta agendada.</p>
        </div>
      )}

      {/* Upcoming appointments list */}
      <h2 className="text-lg font-bold text-neutral-900 mb-4">Consultas Agendadas</h2>
      {upcoming.length === 0 ? (
        <p className="text-neutral-500 text-sm">Nenhuma consulta futura.</p>
      ) : (
        <div className="flex flex-col gap-3">
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
