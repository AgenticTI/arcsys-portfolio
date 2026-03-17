"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { CheckCircle2, Calendar, Clock } from "lucide-react";
import Link from "next/link";

function ConfirmacaoContent() {
  const params = useSearchParams();
  const doctorId = params.get("doctorId");
  const date = params.get("date");
  const time = params.get("time");

  const doctor = (doctors as Doctor[]).find((d) => d.id === doctorId);

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-[20px] shadow-card p-8 flex flex-col items-center gap-6">
        {/* Success icon */}
        <div className="bg-primary-light p-5 rounded-full">
          <CheckCircle2 size={48} className="text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Consulta Solicitada!</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Aguardando confirmação do médico.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-neutral-100 rounded-[14px] p-4 w-full text-left flex flex-col gap-3">
          {doctor && (
            <div className="flex items-center gap-3">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-neutral-900 text-sm">{doctor.name}</p>
                <p className="text-xs text-neutral-500">{doctor.specialty}</p>
              </div>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} className="text-primary" />
              {formatDate(date)}
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock size={16} className="text-primary" />
              {time}
            </div>
          )}
        </div>

        {/* Status notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] px-4 py-3 w-full">
          <p className="text-amber-700 text-xs font-medium text-center">
            Status: Pendente de confirmação pelo médico
          </p>
        </div>

        <Link href="/paciente/dashboard" className="w-full">
          <button className="w-full bg-primary text-white py-3 rounded-[14px] font-semibold text-sm hover:bg-primary/90 transition-colors">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense>
      <ConfirmacaoContent />
    </Suspense>
  );
}
