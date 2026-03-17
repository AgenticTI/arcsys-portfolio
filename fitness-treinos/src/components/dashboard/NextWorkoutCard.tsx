'use client'

import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import type { Workout } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Props = {
  workout: Workout
}

export function NextWorkoutCard({ workout }: Props) {
  const router = useRouter()
  const muscleGroups = [
    ...new Set(workout.exercises.map((e) => e.muscleGroup)),
  ]

  return (
    <div className="bg-surface rounded-2xl p-5">
      <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-2">
        Próximo treino
      </p>
      <p className="text-text-primary text-xl font-bold mb-2">{workout.name}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {muscleGroups.map((mg) => (
          <span
            key={mg}
            className="bg-accent-muted text-accent text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {MUSCLE_GROUP_LABELS[mg]}
          </span>
        ))}
      </div>
      <p className="text-text-secondary text-sm mb-4">
        {workout.exercises.length} exercícios
      </p>
      <button
        onClick={() => router.push(`/workouts/${workout.id}/active`)}
        className="w-full bg-accent text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
      >
        <Play size={18} fill="white" />
        Iniciar treino
      </button>
    </div>
  )
}
