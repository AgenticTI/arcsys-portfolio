'use client'

import { ChevronRight } from 'lucide-react'
import type { Session } from '@/lib/types'

type Props = {
  session: Session
}

type WorkoutCategory = 'push' | 'pull' | 'legs' | 'other'

function detectCategory(name: string): WorkoutCategory {
  const lower = name.toLowerCase()
  if (lower.includes('push') || lower.includes('peito') || lower.includes('ombro') || lower.includes('tríceps') || lower.includes('triceps')) {
    return 'push'
  }
  if (lower.includes('pull') || lower.includes('costas') || lower.includes('bíceps') || lower.includes('biceps') || lower.includes('puxada') || lower.includes('remada')) {
    return 'pull'
  }
  if (lower.includes('leg') || lower.includes('perna') || lower.includes('agachamento') || lower.includes('glúteo') || lower.includes('gluteo')) {
    return 'legs'
  }
  return 'other'
}

type CategoryStyle = {
  bg: string
  iconColor: string
}

const CATEGORY_STYLES: Record<WorkoutCategory, CategoryStyle> = {
  push:  { bg: 'rgba(165,253,24,0.15)',  iconColor: '#A5FD18' },
  pull:  { bg: 'rgba(10,132,255,0.15)',   iconColor: '#0A84FF' },
  legs:  { bg: 'rgba(255,69,58,0.15)',    iconColor: '#FF453A' },
  other: { bg: 'rgba(255,159,10,0.15)',   iconColor: '#FF9F0A' },
}

function formatSessionDate(isoDate: string): string {
  const sessionDate = new Date(isoDate)
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const sessionStr = sessionDate.toISOString().split('T')[0]

  if (sessionStr === todayStr) {
    const formatted = sessionDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    return `Hoje · ${formatted}`
  }

  return sessionDate.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function isToday(isoDate: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return isoDate.split('T')[0] === today
}

export function SessionItem({ session }: Props) {
  const category = detectCategory(session.workoutName)
  const catStyle = CATEGORY_STYLES[category]
  const sessionIsToday = isToday(session.date)

  const uniqueExercises = new Set(session.sets.map((s) => s.exerciseName)).size

  const separatorStyle = '0.5px solid rgba(84,84,88,0.36)'

  return (
    <div className="bg-surface rounded-[22px] overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-3.5 px-[18px] py-4">
        {/* Icon box */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 42, height: 42, backgroundColor: catStyle.bg }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 6.5C6.5 5.67 7.17 5 8 5H9C9.83 5 10.5 5.67 10.5 6.5V17.5C10.5 18.33 9.83 19 9 19H8C7.17 19 6.5 18.33 6.5 17.5V6.5Z"
              fill={catStyle.iconColor}
            />
            <path
              d="M13.5 6.5C13.5 5.67 14.17 5 15 5H16C16.83 5 17.5 5.67 17.5 6.5V17.5C17.5 18.33 16.83 19 16 19H15C14.17 19 13.5 18.33 13.5 17.5V6.5Z"
              fill={catStyle.iconColor}
            />
            <path
              d="M3 10.5C3 9.67 3.67 9 4.5 9H6.5V15H4.5C3.67 15 3 14.33 3 13.5V10.5Z"
              fill={catStyle.iconColor}
            />
            <path
              d="M17.5 9H19.5C20.33 9 21 9.67 21 10.5V13.5C21 14.33 20.33 15 19.5 15H17.5V9Z"
              fill={catStyle.iconColor}
            />
            <rect x="10.5" y="11" width="3" height="2" rx="1" fill={catStyle.iconColor} />
          </svg>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold tracking-[-0.2px] text-text-primary truncate">
            {session.workoutName}
          </p>
          <p className="text-[13px] text-text-tertiary mt-0.5">
            {formatSessionDate(session.date)}
          </p>
        </div>

        {/* Today badge */}
        {sessionIsToday && (
          <span
            className="text-[12px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{
              backgroundColor: 'rgba(165,253,24,0.15)',
              color: '#A5FD18',
            }}
          >
            Hoje
          </span>
        )}

        {/* Chevron */}
        <ChevronRight size={16} style={{ color: 'var(--color-text-quaternary)' }} className="flex-shrink-0" />
      </div>

      {/* Metrics row */}
      <div className="flex" style={{ borderTop: separatorStyle }}>
        {/* Volume */}
        <div className="flex-1 flex flex-col items-center py-[11px] px-3.5">
          <span className="text-[16px] font-bold tracking-[-0.5px] text-text-primary">
            {(session.totalVolumeKg / 1000).toFixed(1)}t
          </span>
          <span className="text-[11px] font-medium tracking-[0.2px] text-text-tertiary mt-0.5">
            Volume
          </span>
        </div>

        {/* Duration */}
        <div
          className="flex-1 flex flex-col items-center py-[11px] px-3.5"
          style={{ borderLeft: separatorStyle }}
        >
          <span className="text-[16px] font-bold tracking-[-0.5px] text-text-primary">
            {session.durationMinutes} min
          </span>
          <span className="text-[11px] font-medium tracking-[0.2px] text-text-tertiary mt-0.5">
            Duração
          </span>
        </div>

        {/* Exercises */}
        <div
          className="flex-1 flex flex-col items-center py-[11px] px-3.5"
          style={{ borderLeft: separatorStyle }}
        >
          <span className="text-[16px] font-bold tracking-[-0.5px] text-text-primary">
            {uniqueExercises}
          </span>
          <span className="text-[11px] font-medium tracking-[0.2px] text-text-tertiary mt-0.5">
            Exercícios
          </span>
        </div>
      </div>
    </div>
  )
}
