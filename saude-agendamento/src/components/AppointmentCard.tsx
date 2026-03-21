import { Appointment, Doctor } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Calendar, Clock } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  doctor: Doctor | undefined;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AppointmentCard({ appointment, doctor }: AppointmentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-3 flex items-center gap-3">
      {doctor?.photo && (
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 text-xs md:text-sm truncate">
          {doctor?.name ?? "Médico não encontrado"}
        </p>
        <p className="text-neutral-500 text-[10px] md:text-xs">
          {doctor?.specialty} · {formatDate(appointment.date)} · {appointment.time}
        </p>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}
