'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import { WorkoutCard } from '@/components/workouts/WorkoutCard'

export default function WorkoutsPage() {
  const { workouts } = useFitnessStore()

  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold">Meus Treinos</h1>
        <Link
          href="/workouts/new"
          className="bg-accent text-white rounded-full p-2.5 flex items-center justify-center active:opacity-80 transition-opacity"
          aria-label="Novo treino"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-base">Nenhum treino ainda.</p>
          <p className="text-text-secondary text-sm mt-1">
            Toque em + para criar seu primeiro treino.
          </p>
        </div>
      )}
    </div>
  )
}
