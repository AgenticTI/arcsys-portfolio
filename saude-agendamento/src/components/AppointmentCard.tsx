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
    <div className="bg-white rounded-[14px] shadow-card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {doctor?.photo && (
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-900 text-sm">
            {doctor?.name ?? "Médico não encontrado"}
          </p>
          <p className="text-neutral-500 text-xs">{doctor?.specialty}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <Calendar size={12} />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <Clock size={12} />
              {appointment.time}
            </span>
          </div>
        </div>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}
