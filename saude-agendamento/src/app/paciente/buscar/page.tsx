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
      <h1 className="hidden md:block text-xl font-extrabold text-neutral-900 mb-5">Buscar Médico</h1>

      {/* Search input */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-100 rounded-xl shadow-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-neutral-900 placeholder:text-neutral-500"
        />
      </div>

      {/* Specialty filter chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              specialty === s
                ? "bg-primary text-dark-card border-primary font-bold"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-primary hover:text-primary"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
