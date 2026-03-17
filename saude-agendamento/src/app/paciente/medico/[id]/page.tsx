import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { Star, MapPin } from "lucide-react";
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
        <div className="bg-primary-light p-8 flex flex-col items-center text-center gap-3">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-card"
          />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{doctor.name}</h1>
            <p className="text-accent font-medium text-sm mt-1">{doctor.specialty}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(doctor.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                />
              ))}
              <span className="text-sm text-neutral-500 ml-1">{doctor.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <MapPin size={16} className="text-primary" />
            <span>{doctor.crm}</span>
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 mb-1">Sobre</h2>
            <p className="text-neutral-500 text-sm leading-relaxed">{doctor.bio}</p>
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 mb-2">Horários Disponíveis</h2>
            <div className="flex gap-2 flex-wrap">
              {doctor.availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="bg-primary-light text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <Link href={`/paciente/agendar/${doctor.id}`} className="mt-2">
            <button className="w-full bg-primary text-white py-3.5 rounded-[14px] font-semibold text-base hover:bg-primary/90 transition-colors">
              Agendar Consulta
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
