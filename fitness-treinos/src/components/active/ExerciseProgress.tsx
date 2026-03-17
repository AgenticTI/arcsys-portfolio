import { CheckCircle, Circle } from 'lucide-react'
import type { Exercise } from '@/lib/types'

type Props = {
  exercises: Exercise[]
  currentExerciseIndex: number
  completedSetsPerExercise: number[]
}

export function ExerciseProgress({
  exercises,
  currentExerciseIndex,
  completedSetsPerExercise,
}: Props) {
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => {
        const completedSets = completedSetsPerExercise[index] ?? 0
        const isDone = completedSets >= exercise.sets
        const isCurrent = index === currentExerciseIndex
        const isPending = index > currentExerciseIndex

        return (
          <div
            key={exercise.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
              isCurrent
                ? 'bg-surface-elevated border border-accent-muted'
                : 'bg-surface'
            } ${isPending ? 'opacity-50' : ''}`}
          >
            {isDone ? (
              <CheckCircle size={18} className="text-accent flex-shrink-0" />
            ) : (
              <Circle
                size={18}
                className={isCurrent ? 'text-accent' : 'text-text-secondary'}
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isDone ? 'text-text-secondary line-through' : 'text-text-primary'
                }`}
              >
                {exercise.name}
              </p>
            </div>
            <p className="text-text-secondary text-xs">
              {completedSets}/{exercise.sets} séries
            </p>
          </div>
        )
      })}
    </div>
  )
}
