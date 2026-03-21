import { Doctor } from "@/types";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/paciente/medico/${doctor.id}`}>
      {/* Desktop: centered card */}
      <div className="hidden md:flex bg-white rounded-xl shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex-col gap-3 items-center text-center">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-neutral-900 text-xs">{doctor.name}</p>
          <p className="text-[10px] text-primary font-medium">{doctor.specialty}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
            />
          ))}
          <span className="text-[10px] text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
        </div>
        <p className="text-[9px] text-neutral-500">{doctor.crm}</p>
        <div className="bg-primary/10 text-primary-dark text-[10px] font-semibold py-1.5 px-4 rounded-lg w-full">
          Ver perfil
        </div>
      </div>

      {/* Mobile: row card */}
      <div className="md:hidden bg-white rounded-xl shadow-card p-3 flex items-center gap-3 cursor-pointer">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 text-xs">{doctor.name}</p>
          <p className="text-[10px] text-primary font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
              />
            ))}
            <span className="text-[9px] text-neutral-500 ml-0.5">{doctor.rating.toFixed(1)}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-neutral-400 shrink-0" />
      </div>
    </Link>
  );
}
