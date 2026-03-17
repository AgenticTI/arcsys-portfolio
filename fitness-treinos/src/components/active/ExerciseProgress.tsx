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
    <div className="bg-surface rounded-[22px] overflow-hidden">
      {/* Header */}
      <div className="px-[18px] py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.3px] text-text-tertiary">
          TODOS OS EXERCÍCIOS
        </p>
      </div>

      {/* Exercise rows */}
      {exercises.map((exercise, index) => {
        const completedSets = completedSetsPerExercise[index] ?? 0
        const isDone = index < currentExerciseIndex
        const isCurrent = index === currentExerciseIndex
        const isPending = index > currentExerciseIndex

        return (
          <div key={exercise.id}>
            {/* Separator line */}
            <div style={{ height: '0.5px', background: 'rgba(84,84,88,0.36)' }} />

            <div
              className={`flex items-center gap-3 px-[18px] py-[13px]${isDone ? ' opacity-50' : ''}`}
            >
              {/* Number badge */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                style={
                  isDone
                    ? { background: 'rgba(165,253,24,0.12)', color: '#A5FD18' }
                    : isCurrent
                    ? { background: '#A5FD18', color: '#000000' }
                    : { background: 'var(--color-surface-elevated)', color: 'var(--color-text-tertiary)' }
                }
              >
                {isDone ? '✓' : index + 1}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-text-primary truncate">
                  {exercise.name}
                </p>
                <p
                  className="text-[13px] mt-0.5"
                  style={{ color: isCurrent ? '#A5FD18' : 'var(--color-text-tertiary)' }}
                >
                  {isCurrent
                    ? `Em andamento · Série ${completedSets + 1}`
                    : `${exercise.sets} × séries`}
                </p>
              </div>

              {/* Chevron for done / pending */}
              {!isCurrent && (
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  fill="none"
                  stroke="rgba(235,235,245,0.16)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
