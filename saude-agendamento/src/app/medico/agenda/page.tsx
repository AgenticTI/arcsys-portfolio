"use client";

import { useState } from "react";
import { useAppointmentsStore } from "@/store/appointments";
import doctorUser from "@/data/doctor-user.json";
import patient from "@/data/patient.json";
import { StatsCard } from "@/components/StatsCard";
import { ScheduleTable } from "@/components/ScheduleTable";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Calendar, CheckCircle, Clock, Check, X } from "lucide-react";
import { Appointment } from "@/types";

const TODAY = "2026-03-17";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AgendaMedico() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const confirmAppointment = useAppointmentsStore((s) => s.confirmAppointment);
  const cancelAppointment = useAppointmentsStore((s) => s.cancelAppointment);

  const [mobileTab, setMobileTab] = useState<"hoje" | "semana">("hoje");

  const myAppointments = appointments.filter((a) => a.doctorId === doctorUser.id);
  const todayAppointments = myAppointments
    .filter((a) => a.date === TODAY)
    .sort((a, b) => a.time.localeCompare(b.time));

  const confirmedCount = todayAppointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = todayAppointments.filter((a) => a.status === "pending").length;

  const weeklyData = [
    { day: "Seg", count: 5 },
    { day: "Ter", count: todayAppointments.length },
    { day: "Qua", count: 4 },
    { day: "Qui", count: 6 },
    { day: "Sex", count: 3 },
  ];

  return (
    <div className="min-h-full">
      {/* Desktop top bar */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white">Dashboard</h1>
          <p className="text-[11px] text-neutral-500 capitalize mt-0.5">{formatDate(TODAY)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{doctorUser.name}</p>
            <p className="text-[10px] text-neutral-500">{doctorUser.specialty}</p>
          </div>
          <img
            src={doctorUser.photo}
            alt={doctorUser.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-primary"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-4">
        <StatsCard
          icon={Calendar}
          label="Consultas Hoje"
          value={todayAppointments.length}
          trend="agendadas para hoje"
        />
        <StatsCard
          icon={CheckCircle}
          label="Confirmadas"
          value={`${confirmedCount}/${todayAppointments.length}`}
          trend="confirmadas"
        />
        <StatsCard
          icon={Clock}
          label="Pendentes"
          value={pendingCount}
          trend="aguardando confirmação"
          trendColor="text-amber-500"
        />
      </div>

      {/* Mobile tab toggle */}
      <div className="md:hidden flex gap-2 mb-4">
        {(["hoje", "semana"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setMobileTab(t)}
            className={`flex-1 py-2 rounded-[10px] text-xs font-semibold transition-colors ${
              mobileTab === t
                ? "bg-primary text-dark-card"
                : "bg-dark-card text-neutral-500 border border-dark-border"
            }`}
          >
            {t === "hoje" ? "Hoje" : "Semana"}
          </button>
        ))}
      </div>

      {/* Mobile: stacked appointment cards */}
      <div className="md:hidden flex flex-col gap-3 mb-4">
        {todayAppointments.length === 0 ? (
          <div className="bg-dark-card rounded-[14px] border border-dark-border p-8 text-center">
            <Calendar size={32} className="mx-auto mb-2 text-neutral-500 opacity-50" />
            <p className="text-sm text-neutral-500">Nenhuma consulta para hoje.</p>
          </div>
        ) : (
          todayAppointments.map((apt) => (
            <MobileAppointmentCard
              key={apt.id}
              appointment={apt}
              patientName={patient.name}
              onConfirm={() => confirmAppointment(apt.id)}
              onCancel={() => cancelAppointment(apt.id)}
            />
          ))
        )}
      </div>

      {/* Desktop bottom grid */}
      <div className="hidden md:flex flex-col md:flex-row gap-4">
        {/* Left: schedule table */}
        <div className="flex-1">
          <ScheduleTable
            appointments={todayAppointments}
            patientName={patient.name}
            onConfirm={confirmAppointment}
            onCancel={cancelAppointment}
          />
        </div>
        {/* Right: mini calendar + weekly chart */}
        <div className="md:w-60 shrink-0 flex flex-col gap-4">
          <MiniCalendar today={TODAY} />
          <WeeklyChart data={weeklyData} currentDay="Ter" />
        </div>
      </div>
    </div>
  );
}

// Mobile-only appointment card
function MobileAppointmentCard({
  appointment,
  patientName,
  onConfirm,
  onCancel,
}: {
  appointment: Appointment;
  patientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-dark-card rounded-[14px] border border-dark-border p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-dark-surface shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">{patientName}</p>
          <p className="text-[10px] text-neutral-500">{appointment.reason}</p>
          <p className={`text-[10px] font-semibold mt-0.5 ${appointment.status === "confirmed" ? "text-primary" : "text-white"}`}>
            {appointment.time}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
            appointment.status === "confirmed"
              ? "bg-primary/10 text-primary"
              : appointment.status === "pending"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {appointment.status === "confirmed" ? "CONFIRMADO" : appointment.status === "pending" ? "PENDENTE" : "CANCELADO"}
        </span>
        {appointment.status === "pending" && (
          <>
            <button
              onClick={onConfirm}
              className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Check size={12} className="text-primary" />
            </button>
            <button
              onClick={onCancel}
              className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center"
            >
              <X size={12} className="text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
