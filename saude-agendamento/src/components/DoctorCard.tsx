import { Doctor } from "@/types";
import { Star } from "lucide-react";
import Link from "next/link";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/paciente/medico/${doctor.id}`}>
      <div className="bg-white rounded-[14px] shadow-card p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-neutral-900 text-sm">{doctor.name}</p>
            <p className="text-xs text-accent font-medium">{doctor.specialty}</p>
            <p className="text-xs text-neutral-500">{doctor.crm}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
            />
          ))}
          <span className="text-xs text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-neutral-500 line-clamp-2">{doctor.bio}</p>
      </div>
    </Link>
  );
}
