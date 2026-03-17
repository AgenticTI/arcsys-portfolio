"use client";

import { useState } from "react";
import { DoctorCard } from "@/components/DoctorCard";
import doctors from "@/data/doctors.json";
import { Doctor } from "@/types";
import { Search } from "lucide-react";

const SPECIALTIES = ["Todos", "Clínico Geral", "Cardiologia", "Dermatologia", "Ortopedia", "Pediatria", "Neurologia"];

export default function BuscarMedico() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Todos");

  const filtered = (doctors as Doctor[]).filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty = specialty === "Todos" || d.specialty === specialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Buscar Médico</h1>

      {/* Search input */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-[14px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Specialty filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              specialty === s
                ? "bg-primary text-white border-primary"
                : "bg-white text-neutral-500 border-neutral-200 hover:border-primary hover:text-primary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum médico encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
