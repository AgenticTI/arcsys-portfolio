import { X } from 'lucide-react'
import type { Exercise } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

type Props = {
  exercise: Exercise
  onRemove: () => void
}

export function ExerciseListItem({ exercise, onRemove }: Props) {
  return (
    <div className="bg-surface-elevated rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-medium truncate">{exercise.name}</p>
        <p className="text-text-secondary text-sm mt-0.5">
          {MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {exercise.sets} séries
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-text-secondary active:text-destructive transition-colors p-1"
        aria-label="Remover exercício"
      >
        <X size={18} />
      </button>
    </div>
  )
}
