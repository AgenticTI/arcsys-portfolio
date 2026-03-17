"use client";

import { useState } from "react";
import { useAppointmentsStore } from "@/store/appointments";
import { StatusBadge } from "@/components/StatusBadge";
import doctorUser from "@/data/doctor-user.json";
import { Check, X, Calendar } from "lucide-react";
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

function getWeekDates(startStr: string): string[] {
  const dates: string[] = [];
  const start = new Date(startStr + "T00:00:00");
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default function AgendaMedico() {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const confirmAppointment = useAppointmentsStore((s) => s.confirmAppointment);
  const cancelAppointment = useAppointmentsStore((s) => s.cancelAppointment);

  const [tab, setTab] = useState<"day" | "week">("day");

  const myAppointments = appointments.filter((a) => a.doctorId === doctorUser.id);
  const todayAppts = myAppointments
    .filter((a) => a.date === TODAY)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekDates = getWeekDates(TODAY);
  const weekAppts = myAppointments.filter((a) => weekDates.includes(a.date));

  function countByDate(date: string) {
    return weekAppts.filter((a) => a.date === date).length;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Minha Agenda</h1>
          <p className="text-neutral-500 text-sm mt-1">{formatDate(TODAY)}</p>
        </div>
        <div className="bg-primary-light rounded-[14px] px-5 py-3 text-center">
          <p className="text-2xl font-bold text-primary">{todayAppts.length}</p>
          <p className="text-xs text-primary/70 font-medium">consultas hoje</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["day", "week"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary hover:text-primary"
            }`}
          >
            {t === "day" ? "Hoje" : "Semana"}
          </button>
        ))}
      </div>

      {/* Day view */}
      {tab === "day" && (
        <div className="flex flex-col gap-3">
          {todayAppts.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma consulta para hoje.</p>
            </div>
          ) : (
            todayAppts.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appointment={appt}
                onConfirm={() => confirmAppointment(appt.id)}
                onCancel={() => cancelAppointment(appt.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Week view */}
      {tab === "week" && (
        <div className="flex flex-col gap-4">
          {weekDates.map((date) => {
            const count = countByDate(date);
            const d = new Date(date + "T00:00:00");
            const label = d.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "short",
            });
            const isToday = date === TODAY;
            return (
              <div
                key={date}
                className={`bg-white rounded-[14px] shadow-card px-5 py-4 flex items-center justify-between ${
                  isToday ? "border-l-4 border-primary" : ""
                }`}
              >
                <span className={`text-sm font-medium capitalize ${isToday ? "text-primary" : "text-neutral-700"}`}>
                  {label}
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    count > 0
                      ? "bg-primary-light text-primary"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {count} {count === 1 ? "consulta" : "consultas"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Local sub-component for appointment row
function AppointmentRow({
  appointment,
  onConfirm,
  onCancel,
}: {
  appointment: Appointment;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-[14px] shadow-card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[48px]">
          <p className="text-lg font-bold text-neutral-900">{appointment.time}</p>
        </div>
        <div>
          {/* Patient name is always p1 = Rafael in mock data */}
          <p className="font-semibold text-neutral-900 text-sm">Rafael Mendes</p>
          <p className="text-xs text-neutral-500">{appointment.reason}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={appointment.status} />
        {appointment.status === "pending" && (
          <>
            <button
              onClick={onConfirm}
              title="Confirmar"
              className="p-2 bg-primary-light text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={onCancel}
              title="Cancelar"
              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
