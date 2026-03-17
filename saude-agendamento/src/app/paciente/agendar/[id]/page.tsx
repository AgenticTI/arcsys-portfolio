"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { useAppointmentsStore } from "@/store/appointments";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  params: { id: string };
}

function getWeekDays(baseDate: Date): Date[] {
  const days: Date[] = [];
  // Start from Monday of the week containing baseDate
  const day = baseDate.getDay(); // 0=Sun
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day === 0 ? 7 : day) - 1));
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const today = new Date("2026-03-17");

export default function AgendarConsulta({ params }: Props) {
  const router = useRouter();
  const appointments = useAppointmentsStore((s) => s.appointments);
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const doctor = (doctors as Doctor[]).find((d) => d.id === params.id);
  if (!doctor) return notFound();

  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(baseDate);

  const selectedDateStr = toDateStr(selectedDate);
  const bookedSlots = appointments
    .filter((a) => a.doctorId === doctor.id && a.date === selectedDateStr && a.status !== "cancelled")
    .map((a) => a.time);

  function handleConfirm() {
    if (!selectedSlot) return;
    const newId = `a${Date.now()}`;
    addAppointment({
      id: newId,
      patientId: patient.id,
      doctorId: doctor!.id,
      date: selectedDateStr,
      time: selectedSlot,
      status: "pending",
      reason: "Consulta agendada pelo paciente",
    });
    router.push(
      `/paciente/confirmacao?doctorId=${doctor!.id}&date=${selectedDateStr}&time=${selectedSlot}`
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Agendar Consulta</h1>
      <p className="text-neutral-500 text-sm mb-6">
        {doctor.name} · {doctor.specialty}
      </p>

      {/* Mini week calendar */}
      <div className="bg-white rounded-[20px] shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            disabled={weekOffset <= 0}
            className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} className="text-neutral-500" />
          </button>
          <span className="text-sm font-medium text-neutral-700">
            {weekDays[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} –{" "}
            {weekDays[4].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((day, i) => {
            const dateStr = toDateStr(day);
            const isSelected = dateStr === selectedDateStr;
            const isToday = dateStr === toDateStr(today);
            return (
              <button
                key={dateStr}
                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "hover:bg-neutral-100 text-neutral-600"
                }`}
              >
                <span className="text-xs font-medium mb-1">{WEEKDAY_LABELS[i]}</span>
                <span className={`font-bold ${isToday && !isSelected ? "text-primary" : ""}`}>
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="bg-white rounded-[20px] shadow-card p-6 mb-6">
        <h2 className="font-semibold text-neutral-900 mb-4">
          Horários disponíveis —{" "}
          {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        {doctor.availableSlots.length === 0 ? (
          <p className="text-neutral-400 text-sm">Nenhum horário disponível.</p>
        ) : (
          <TimeSlotGrid
            slots={doctor.availableSlots}
            bookedSlots={bookedSlots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selectedSlot}
        className="w-full bg-primary text-white py-3.5 rounded-[14px] font-semibold text-base hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Confirmar Agendamento
      </button>
    </div>
  );
}
