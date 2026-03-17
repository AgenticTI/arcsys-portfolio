'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { Workout, MuscleGroup } from '@/lib/types'
import { MuscleChip } from './MuscleChip'
import { formatDate } from '@/lib/utils'

type Props = {
  workout: Workout
}

export function WorkoutCard({ workout }: Props) {
  const router = useRouter()
  const muscleGroups = [
    ...new Set(workout.exercises.map((e) => e.muscleGroup)),
  ] as MuscleGroup[]

  return (
    <button
      onClick={() => router.push(`/workouts/${workout.id}/active`)}
      className="w-full bg-surface rounded-2xl p-5 text-left flex items-start justify-between gap-4 active:opacity-70 transition-opacity"
    >
      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-bold text-lg leading-tight mb-2 truncate">
          {workout.name}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {muscleGroups.map((mg) => (
            <MuscleChip key={mg} group={mg} />
          ))}
        </div>
        <div className="flex items-center gap-3 text-text-secondary text-sm">
          <span>{workout.exercises.length} exercícios</span>
          {workout.lastDone && (
            <>
              <span>·</span>
              <span>Último: {formatDate(workout.lastDone)}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={20} className="text-text-secondary flex-shrink-0 mt-1" />
    </button>
  )
}
