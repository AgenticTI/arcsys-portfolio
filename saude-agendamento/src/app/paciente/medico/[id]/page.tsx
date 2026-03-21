import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { Star, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function DoctorProfile({ params }: Props) {
  const doctor = (doctors as Doctor[]).find((d) => d.id === params.id);

  if (!doctor) return notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[20px] shadow-card overflow-hidden">
        {/* Hero */}
        <div className="bg-neutral-100 p-8 flex flex-col items-center text-center gap-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-card"
          />
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900">{doctor.name}</h1>
            <p className="text-primary font-semibold text-sm mt-1">{doctor.specialty}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                />
              ))}
              <span className="text-xs text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <BadgeCheck size={15} className="text-primary shrink-0" />
            <span className="font-medium text-neutral-900">{doctor.crm}</span>
          </div>

          <div>
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Sobre</h2>
            <p className="text-neutral-500 text-sm leading-relaxed">{doctor.bio}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Horários Disponíveis</h2>
            <div className="flex gap-2 flex-wrap">
              {doctor.availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="bg-primary/10 text-primary-dark text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <Link href={`/paciente/agendar/${doctor.id}`} className="mt-1">
            <button className="w-full bg-primary text-dark-card py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
              Agendar Consulta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
