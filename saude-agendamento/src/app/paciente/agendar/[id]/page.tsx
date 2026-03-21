"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import doctors from "@/data/doctors.json";
import patient from "@/data/patient.json";
import { Doctor } from "@/types";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { useAppointmentsStore } from "@/store/appointments";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

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
    <div className="max-w-3xl mx-auto">
      {/* Mobile back arrow */}
      <Link href={`/paciente/medico/${doctor.id}`} className="md:hidden flex items-center gap-1.5 text-neutral-500 text-sm mb-4 hover:text-primary transition-colors">
        <ArrowLeft size={16} />
        Voltar ao perfil
      </Link>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Left panel — Doctor info */}
        <div className="md:w-52 shrink-0">
          {/* Mobile: compact horizontal */}
          <div className="flex md:hidden items-center gap-3 bg-white rounded-xl shadow-card p-3 mb-4">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-sm text-neutral-900 truncate">{doctor.name}</p>
              <p className="text-xs text-primary">{doctor.specialty}</p>
            </div>
          </div>

          {/* Desktop: vertical card */}
          <div className="hidden md:flex flex-col items-center bg-white rounded-[20px] shadow-card p-5 text-center gap-3 sticky top-4">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-neutral-100"
            />
            <div>
              <p className="font-bold text-sm text-neutral-900">{doctor.name}</p>
              <p className="text-xs text-primary mt-0.5">{doctor.specialty}</p>
              <div className="flex items-center justify-center gap-0.5 mt-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                  />
                ))}
                <span className="text-[10px] text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="w-full border-t border-neutral-100 pt-3">
              <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">CRM</p>
              <p className="text-xs text-neutral-900 font-medium">{doctor.crm}</p>
            </div>
            {doctor.bio && (
              <p className="text-[11px] text-neutral-500 leading-relaxed text-left">{doctor.bio}</p>
            )}
          </div>
        </div>

        {/* Right panel — Calendar + slots + confirm */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Week selector */}
          <div className="bg-white rounded-[20px] shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                disabled={weekOffset <= 0}
                className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} className="text-neutral-500" />
              </button>
              <span className="text-xs font-semibold text-neutral-700">
                {weekDays[0].toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} –{" "}
                {weekDays[4].toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ChevronRight size={18} className="text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
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
                        ? "bg-primary text-dark-card"
                        : "hover:bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <span className="text-[10px] font-semibold mb-1">{WEEKDAY_LABELS[i]}</span>
                    <span className={`font-bold text-sm ${isToday && !isSelected ? "text-primary" : ""}`}>
                      {day.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="bg-white rounded-[20px] shadow-card p-5">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              Horários disponíveis —{" "}
              <span className="text-neutral-900 normal-case font-semibold">
                {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
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
            className="w-full bg-primary text-dark-card py-3 rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
}
