'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFitnessStore } from '@/store/fitness'
import { WorkoutCard } from '@/components/workouts/WorkoutCard'
import type { Workout } from '@/lib/types'

type FilterTab = 'Todos' | 'Push' | 'Pull' | 'Legs'

const FILTER_TABS: FilterTab[] = ['Todos', 'Push', 'Pull', 'Legs']

function filterWorkouts(workouts: Workout[], filter: FilterTab): Workout[] {
  if (filter === 'Todos') return workouts

  return workouts.filter((w) => {
    const nameLower = w.name.toLowerCase()
    const groups = w.exercises.map((e) => e.muscleGroup)

    if (filter === 'Push') {
      return (
        nameLower.includes('push') ||
        groups.some((g) => g === 'chest' || g === 'shoulders')
      )
    }
    if (filter === 'Pull') {
      return (
        nameLower.includes('pull') ||
        groups.some((g) => g === 'back')
      )
    }
    if (filter === 'Legs') {
      return (
        nameLower.includes('leg') ||
        groups.some((g) => g === 'legs')
      )
    }
    return true
  })
}

export default function WorkoutsPage() {
  const { workouts } = useFitnessStore()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos')

  const filtered = filterWorkouts(workouts, activeFilter)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-tertiary mb-1">
          Biblioteca
        </p>
        <h1 className="text-[34px] font-bold tracking-[-0.4px] leading-[1.1] text-text-primary">
          Treinos
        </h1>
      </div>

      {/* Search bar */}
      <div className="mx-5 mt-4 bg-surface-elevated rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-tertiary flex-shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar treino…"
          readOnly
          className="flex-1 bg-transparent text-[16px] text-text-primary placeholder:text-text-tertiary outline-none"
        />
      </div>

      {/* Segmented control */}
      <div className="mx-5 mt-4 bg-surface-elevated rounded-xl p-[3px] flex gap-0.5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 py-1.5 rounded-[9px] text-[13px] font-semibold transition-colors ${
              activeFilter === tab
                ? 'bg-surface-3 text-text-primary'
                : 'text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className="mt-4 px-4 flex flex-col gap-3 pb-24">
        {filtered.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-base">Nenhum treino encontrado.</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push('/workouts/new')}
        className="fixed bottom-28 right-5 w-[52px] h-[52px] bg-accent rounded-2xl flex items-center justify-center shadow-lg cursor-pointer active:opacity-80 transition-opacity"
        aria-label="Novo treino"
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
