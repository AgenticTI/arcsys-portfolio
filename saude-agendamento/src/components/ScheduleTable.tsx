"use client";

import { Appointment } from "@/types";
import { Check, X } from "lucide-react";

interface ScheduleTableProps {
  appointments: Appointment[];
  patientName: string;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ScheduleTable({ appointments, patientName, onConfirm, onCancel }: ScheduleTableProps) {
  return (
    <div className="bg-dark-card rounded-[14px] border border-dark-border overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Agenda de Hoje</span>
          <span className="bg-primary text-dark-card text-[10px] font-bold px-2 py-0.5 rounded-full">
            {appointments.length}
          </span>
        </div>
      </div>
      {/* Table header — desktop only */}
      <div className="hidden md:flex px-4 py-2 border-b border-dark-border text-[10px] text-neutral-500 font-semibold">
        <div className="w-16">Hora</div>
        <div className="flex-1">Paciente</div>
        <div className="w-24">Motivo</div>
        <div className="w-20">Status</div>
        <div className="w-14">Ação</div>
      </div>
      {/* Rows */}
      {appointments.map((apt) => (
        <div
          key={apt.id}
          className="flex items-center px-4 py-3 border-b border-dark-bg last:border-b-0"
        >
          <div className={`w-16 text-sm font-bold ${apt.status === "confirmed" ? "text-primary" : "text-white"}`}>
            {apt.time}
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-dark-surface shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">{patientName}</p>
              <p className="text-[9px] text-neutral-500">{apt.reason}</p>
            </div>
          </div>
          <div className="hidden md:block w-24 text-[10px] text-neutral-400">
            {apt.reason}
          </div>
          <div className="w-20">
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                apt.status === "confirmed"
                  ? "bg-primary/10 text-primary"
                  : apt.status === "pending"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {apt.status === "confirmed" ? "CONFIRMADO" : apt.status === "pending" ? "PENDENTE" : "CANCELADO"}
            </span>
          </div>
          <div className="w-14 flex gap-1">
            {apt.status === "pending" && (
              <>
                <button
                  onClick={() => onConfirm(apt.id)}
                  className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Check size={12} className="text-primary" />
                </button>
                <button
                  onClick={() => onCancel(apt.id)}
                  className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"
                >
                  <X size={12} className="text-red-500" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
