'use client'

import { useRouter } from 'next/navigation'
import type { Workout, MuscleGroup } from '@/lib/types'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

type Props = {
  workout: Workout
}

type Category = 'push' | 'pull' | 'legs' | 'other'

function getCategory(workout: Workout): Category {
  const nameLower = workout.name.toLowerCase()
  const groups = workout.exercises.map((e) => e.muscleGroup)

  if (nameLower.includes('push') || groups.some((g) => g === 'chest' || g === 'shoulders')) {
    return 'push'
  }
  if (nameLower.includes('pull') || groups.some((g) => g === 'back')) {
    return 'pull'
  }
  if (nameLower.includes('leg') || groups.some((g) => g === 'legs')) {
    return 'legs'
  }
  return 'other'
}

const CATEGORY_STYLES: Record<Category, { iconBg: string; iconColor: string; chipBg: string; chipColor: string }> = {
  push: {
    iconBg: 'rgba(165,253,24,0.10)',
    iconColor: '#A5FD18',
    chipBg: 'rgba(165,253,24,0.12)',
    chipColor: '#A5FD18',
  },
  pull: {
    iconBg: 'rgba(10,132,255,0.10)',
    iconColor: '#0A84FF',
    chipBg: 'rgba(10,132,255,0.12)',
    chipColor: '#0A84FF',
  },
  legs: {
    iconBg: 'rgba(255,69,58,0.10)',
    iconColor: '#FF453A',
    chipBg: 'rgba(255,69,58,0.10)',
    chipColor: '#FF453A',
  },
  other: {
    iconBg: 'rgba(255,159,10,0.10)',
    iconColor: '#FF9F0A',
    chipBg: 'rgba(255,159,10,0.10)',
    chipColor: '#FF9F0A',
  },
}

export function WorkoutCard({ workout }: Props) {
  const router = useRouter()
  const category = getCategory(workout)
  const styles = CATEGORY_STYLES[category]

  const muscleGroups = [
    ...new Set(workout.exercises.map((e) => e.muscleGroup)),
  ] as MuscleGroup[]

  const estimatedMin = workout.exercises.length * 5 + 5
  const dividerColor = 'rgba(84,84,88,0.36)'

  return (
    <button
      onClick={() => router.push(`/workouts/${workout.id}/active`)}
      className="w-full bg-surface rounded-[22px] overflow-hidden cursor-pointer active:opacity-70 transition-opacity text-left"
    >
      {/* Top section */}
      <div className="p-4">
        {/* Row 1: icon + title + chevron */}
        <div className="flex items-center gap-3 mb-3">
          {/* Icon box */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: styles.iconBg }}
          >
            <svg viewBox="0 0 24 24" fill={styles.iconColor} width={22} height={22}>
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
            </svg>
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold tracking-[-0.3px] text-text-primary leading-tight truncate">
              {workout.name}
            </p>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              {workout.lastDone ? `Último: ${formatDate(workout.lastDone)}` : 'Nunca'}
            </p>
          </div>

          {/* Chevron */}
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="rgba(235,235,245,0.16)"
            strokeWidth={2}
            strokeLinecap="round"
            className="flex-shrink-0"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        {/* Row 2: muscle chips */}
        <div className="flex flex-wrap gap-1.5">
          {muscleGroups.map((mg) => (
            <span
              key={mg}
              className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: styles.chipBg, color: styles.chipColor }}
            >
              {MUSCLE_GROUP_LABELS[mg]}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex"
        style={{ borderTop: `0.5px solid ${dividerColor}` }}
      >
        {/* Cell 1: exercises count */}
        <div className="flex-1 py-3 px-4 flex items-center gap-1.5 text-[13px] font-medium text-text-tertiary">
          <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
          </svg>
          <span>{workout.exercises.length} exercícios</span>
        </div>

        {/* Divider */}
        <div style={{ width: '0.5px', background: dividerColor }} />

        {/* Cell 2: estimated time */}
        <div className="flex-1 py-3 px-4 flex items-center gap-1.5 text-[13px] font-medium text-text-tertiary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>~{estimatedMin} min</span>
        </div>
      </div>
    </button>
  )
}
