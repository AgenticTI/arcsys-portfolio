'use client'

import { useRouter } from 'next/navigation'
import { Dumbbell, ChevronRight, Flame, Check } from 'lucide-react'
import { useFitnessStore } from '@/store/fitness'
import {
  calcStreak,
  calcWeekVolume,
  calcWeekSessions,
  calcHeatmapData,
  formatDate,
} from '@/lib/utils'
import { Heatmap } from '@/components/dashboard/Heatmap'

// Abbreviated weekday names in Portuguese (Sunday first)
const DAY_ABBR = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

// Returns an array of 7 dates for the current week (Sunday to Saturday)
function getCurrentWeekDays(): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dayOfWeek + i)
    days.push(d)
  }
  return days
}

function toDateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

// Muscle group tag color mapping
function getWorkoutTag(name: string): { label: string; color: string } {
  const lower = name.toLowerCase()
  if (lower.includes('push') || lower.includes('peito')) {
    return { label: 'PUSH', color: '#A5FD18' }
  }
  if (lower.includes('pull') || lower.includes('costas')) {
    return { label: 'PULL', color: '#0A84FF' }
  }
  if (lower.includes('legs') || lower.includes('perna')) {
    return { label: 'LEGS', color: '#FF453A' }
  }
  return { label: 'FULL', color: '#FF9F0A' }
}

// Icon background + icon color per workout type
function getWorkoutIconColors(name: string): { bg: string; icon: string } {
  const lower = name.toLowerCase()
  if (lower.includes('push') || lower.includes('peito')) {
    return { bg: 'rgba(165,253,24,0.14)', icon: '#A5FD18' }
  }
  if (lower.includes('pull') || lower.includes('costas')) {
    return { bg: 'rgba(10,132,255,0.14)', icon: '#0A84FF' }
  }
  if (lower.includes('legs') || lower.includes('perna')) {
    return { bg: 'rgba(255,69,58,0.14)', icon: '#FF453A' }
  }
  return { bg: 'rgba(255,159,10,0.14)', icon: '#FF9F0A' }
}

export default function DashboardPage() {
  const router = useRouter()
  const { sessions, workouts, activeWorkout } = useFitnessStore()

  // Calculations
  const streak = calcStreak(sessions)
  const weekVolume = calcWeekVolume(sessions)
  const weekSessionsCount = calcWeekSessions(sessions)
  const heatmapData = calcHeatmapData(sessions, 28)

  // Next workout: least recently done
  const nextWorkout = [...workouts].sort((a, b) => {
    if (!a.lastDone) return -1
    if (!b.lastDone) return 1
    return new Date(a.lastDone).getTime() - new Date(b.lastDone).getTime()
  })[0]

  // Active workout workout object (if any)
  const activeWorkoutObj = activeWorkout
    ? workouts.find((w) => w.id === activeWorkout.workoutId) ?? null
    : null

  // Featured workout: active one if exists, otherwise nextWorkout
  const featuredWorkout = activeWorkoutObj ?? nextWorkout ?? null

  // Progress ring calculation
  let completedSetsCount = 0
  let totalSetsCount = 0
  if (activeWorkout && featuredWorkout) {
    completedSetsCount = activeWorkout.completedSets.length
    totalSetsCount = featuredWorkout.exercises.reduce((sum, e) => sum + e.sets, 0)
  } else if (featuredWorkout) {
    totalSetsCount = featuredWorkout.exercises.reduce((sum, e) => sum + e.sets, 0)
  }
  const progress = totalSetsCount > 0 ? completedSetsCount / totalSetsCount : 0
  const ringCircumference = 2 * Math.PI * 30 // r=30 → ≈188.5
  const ringOffset = ringCircumference * (1 - progress)
  const progressPercent = Math.round(progress * 100)

  // Week days and trained days
  const weekDays = getCurrentWeekDays()
  const today = new Date()
  const todayKey = toDateKey(today)

  const sessionDayKeys = new Set(sessions.map((s) => s.date.split('T')[0]))

  // Activity chart: volume per day for current week
  const weekDayVolumes: number[] = weekDays.map((d) => {
    const key = toDateKey(d)
    const daySessions = sessions.filter((s) => s.date.split('T')[0] === key)
    return daySessions.reduce((sum, s) => sum + s.totalVolumeKg, 0)
  })
  const maxVolume = Math.max(...weekDayVolumes, 1)

  // Formatted date for greeting
  const greetingDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  // e.g. "terça-feira, 17 de março" — capitalize first letter
  const formattedDate = greetingDate.charAt(0).toUpperCase() + greetingDate.slice(1)

  // Workout list — 3 most recently done or first 3
  const recentWorkouts = [...workouts]
    .sort((a, b) => {
      if (!a.lastDone) return 1
      if (!b.lastDone) return -1
      return new Date(b.lastDone).getTime() - new Date(a.lastDone).getTime()
    })
    .slice(0, 3)

  const featuredTag = featuredWorkout ? getWorkoutTag(featuredWorkout.name) : null

  const estimatedMinutes = featuredWorkout
    ? Math.round(featuredWorkout.exercises.reduce((sum, e) => sum + e.sets, 0) * 2.5)
    : 0

  return (
    <div className="px-5 pt-12 pb-28">
      {/* 1. Greeting block */}
      <div className="flex items-start justify-between pb-0">
        <div>
          <p
            className="text-text-tertiary"
            style={{ fontSize: 15 }}
          >
            {formattedDate}
          </p>
          <div className="mt-1">
            <p
              className="text-text-primary font-bold tracking-tight leading-tight"
              style={{ fontSize: 30 }}
            >
              Bom treino,
            </p>
            <p
              className="font-bold tracking-tight leading-tight text-accent"
              style={{ fontSize: 30 }}
            >
              Leon.
            </p>
          </div>
        </div>
        {/* Avatar */}
        <div
          className="bg-accent text-black font-extrabold flex items-center justify-center rounded-full shrink-0"
          style={{ width: 46, height: 46, fontSize: 18 }}
        >
          L
        </div>
      </div>

      {/* 2. Week selector */}
      <div
        className="flex gap-1 mt-5 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {weekDays.map((day) => {
          const key = toDateKey(day)
          const isToday = key === todayKey
          const isTrained = sessionDayKeys.has(key)
          const dayNumber = day.getDate()
          const dayAbbr = DAY_ABBR[day.getDay()]

          return (
            <div
              key={key}
              className="flex flex-col items-center gap-1 flex-1 rounded-2xl py-2.5 px-1"
              style={{
                backgroundColor: isToday ? '#A5FD18' : 'transparent',
                minWidth: 0,
              }}
            >
              <span
                className="uppercase tracking-wide"
                style={{
                  fontSize: 11,
                  color: isToday ? 'rgba(0,0,0,0.7)' : 'rgba(235,235,245,0.30)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                }}
              >
                {dayAbbr}
              </span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: isToday ? '#000000' : 'rgba(235,235,245,0.60)',
                }}
              >
                {dayNumber}
              </span>
              {/* Dot */}
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: isToday
                    ? 'rgba(0,0,0,0.30)'
                    : isTrained
                    ? '#A5FD18'
                    : 'var(--color-surface-3)',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* 3. Featured workout card */}
      {featuredWorkout && (
        <div className="mt-4 bg-surface rounded-3xl p-5">
          {/* Row 1: tags */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {featuredTag && (
                <span
                  className="text-black font-bold rounded-full px-3 py-1"
                  style={{
                    backgroundColor: featuredTag.color,
                    fontSize: 12,
                    letterSpacing: '0.04em',
                  }}
                >
                  {featuredTag.label}
                </span>
              )}
              <span className="text-text-tertiary" style={{ fontSize: 13 }}>
                Hoje
              </span>
            </div>
            <span
              className="rounded-full px-3 py-1 text-text-secondary font-medium"
              style={{ backgroundColor: 'var(--color-surface-elevated)', fontSize: 12 }}
            >
              Intermediário
            </span>
          </div>

          {/* Row 2: body (text + ring) */}
          <div className="flex items-center gap-4 mb-5">
            {/* Left text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-accent uppercase tracking-wider font-semibold mb-1"
                style={{ fontSize: 11, letterSpacing: '0.08em' }}
              >
                PRÓXIMO TREINO
              </p>
              <p
                className="text-text-primary font-bold tracking-tight leading-tight mb-2"
                style={{ fontSize: 26 }}
              >
                {featuredWorkout.name}
              </p>
              <div className="flex items-center gap-3 text-text-tertiary" style={{ fontSize: 14 }}>
                <span className="flex items-center gap-1">
                  <Dumbbell size={14} />
                  {featuredWorkout.exercises.length} exercícios
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ~{estimatedMinutes} min
                </span>
              </div>
            </div>

            {/* Activity Ring SVG */}
            <div className="shrink-0" style={{ width: 86, height: 86 }}>
              <svg width="86" height="86" viewBox="0 0 86 86">
                {/* Background track */}
                <circle
                  cx="43"
                  cy="43"
                  r="30"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="5"
                />
                {/* Progress arc */}
                <circle
                  cx="43"
                  cy="43"
                  r="30"
                  fill="none"
                  stroke="#A5FD18"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 43 43)"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(165,253,24,0.5))' }}
                />
                {/* Center label */}
                <text
                  x="43"
                  y="40"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#A5FD18"
                  fontSize="18"
                  fontWeight="800"
                  fontFamily="var(--font-jakarta), system-ui, sans-serif"
                >
                  {progressPercent}%
                </text>
                <text
                  x="43"
                  y="56"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(235,235,245,0.30)"
                  fontSize="10"
                  fontFamily="var(--font-jakarta), system-ui, sans-serif"
                >
                  feito
                </text>
              </svg>
            </div>
          </div>

          {/* Progress bar row */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-tertiary" style={{ fontSize: 13 }}>
                Progresso da sessão
              </span>
              <span className="text-accent font-bold" style={{ fontSize: 13 }}>
                {completedSetsCount} / {totalSetsCount} séries
              </span>
            </div>
            <div
              className="relative rounded-full overflow-visible"
              style={{ height: 5, backgroundColor: 'var(--color-surface-3)' }}
            >
              <div
                className="rounded-full h-full relative"
                style={{
                  width: `${Math.max(progress * 100, 0)}%`,
                  backgroundColor: '#A5FD18',
                  minWidth: progress > 0 ? 11 : 0,
                }}
              >
                {/* Thumb dot */}
                {(progress > 0 || true) && (
                  <div
                    className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: 11,
                      height: 11,
                      backgroundColor: '#A5FD18',
                      boxShadow: '0 0 6px rgba(165,253,24,0.6)',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push(`/workouts/${featuredWorkout.id}/active`)}
            className="w-full text-black font-bold rounded-2xl py-4 active:opacity-80 transition-opacity"
            style={{ backgroundColor: '#A5FD18', fontSize: 17 }}
          >
            {activeWorkout ? 'Continuar Treino' : 'Iniciar Treino'}
          </button>
        </div>
      )}

      {/* 4. Stats grid */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {/* Streak */}
        <div className="bg-surface rounded-3xl p-4">
          <div
            className="rounded-lg flex items-center justify-center mb-3"
            style={{ width: 28, height: 28, backgroundColor: 'rgba(255,159,10,0.16)' }}
          >
            <Flame size={16} color="#FF9F0A" />
          </div>
          <p
            className="text-text-primary font-bold tracking-tight"
            style={{ fontSize: 28 }}
          >
            {streak}d
          </p>
          <p
            className="text-text-tertiary leading-tight"
            style={{ fontSize: 12 }}
          >
            Sequência atual
          </p>
        </div>

        {/* Sessions */}
        <div className="bg-surface rounded-3xl p-4">
          <div
            className="rounded-lg flex items-center justify-center mb-3"
            style={{ width: 28, height: 28, backgroundColor: 'rgba(165,253,24,0.14)' }}
          >
            <Check size={16} color="#A5FD18" />
          </div>
          <p
            className="text-text-primary font-bold tracking-tight"
            style={{ fontSize: 28 }}
          >
            {weekSessionsCount}×
          </p>
          <p
            className="text-text-tertiary leading-tight"
            style={{ fontSize: 12 }}
          >
            Treinos na semana
          </p>
        </div>

        {/* Volume */}
        <div className="bg-surface rounded-3xl p-4">
          <div
            className="rounded-lg flex items-center justify-center mb-3"
            style={{ width: 28, height: 28, backgroundColor: 'rgba(10,132,255,0.14)' }}
          >
            <Dumbbell size={16} color="#0A84FF" />
          </div>
          <p
            className="text-text-primary font-bold tracking-tight"
            style={{ fontSize: 28 }}
          >
            {(weekVolume / 1000).toFixed(1)}t
          </p>
          <p
            className="text-text-tertiary leading-tight"
            style={{ fontSize: 12 }}
          >
            Volume semanal
          </p>
        </div>
      </div>

      {/* 5. Activity chart */}
      <div className="mt-6">
        <p
          className="text-text-tertiary uppercase tracking-wider"
          style={{ fontSize: 11, letterSpacing: '0.08em' }}
        >
          ATIVIDADE — 7 DIAS
        </p>
        <div className="bg-surface rounded-3xl p-4 mt-3">
          <div className="flex items-end gap-1.5" style={{ height: 52 }}>
            {weekDays.map((day, i) => {
              const key = toDateKey(day)
              const isToday = key === todayKey
              const vol = weekDayVolumes[i]
              const hasSessions = vol > 0
              // Bar height: min 20% for trained days, proportional otherwise
              const heightPct = hasSessions
                ? Math.max((vol / maxVolume) * 100, 20)
                : 8

              return (
                <div
                  key={key}
                  className="flex flex-col items-center gap-1.5 flex-1"
                >
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isToday
                        ? '#A5FD18'
                        : hasSessions
                        ? 'var(--color-surface-3)'
                        : 'var(--color-surface-elevated)',
                      boxShadow: isToday ? '0 0 6px rgba(165,253,24,0.4)' : undefined,
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: 10,
                      color: isToday ? '#A5FD18' : 'rgba(235,235,245,0.16)',
                    }}
                  >
                    {DAY_ABBR[day.getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 6. Workout list */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-text-tertiary uppercase tracking-wider"
            style={{ fontSize: 11, letterSpacing: '0.08em' }}
          >
            TREINOS
          </p>
          <button
            onClick={() => router.push('/workouts')}
            className="text-accent"
            style={{ fontSize: 15 }}
          >
            Ver todos
          </button>
        </div>

        <div className="bg-surface rounded-3xl overflow-hidden">
          {recentWorkouts.map((workout, idx) => {
            const iconColors = getWorkoutIconColors(workout.name)
            const muscleNames = [
              ...new Set(workout.exercises.map((e) => e.muscleGroup)),
            ]
              .map((mg) => {
                const labels: Record<string, string> = {
                  chest: 'Peito', back: 'Costas', legs: 'Pernas',
                  shoulders: 'Ombros', arms: 'Braços', core: 'Core',
                }
                return labels[mg] ?? mg
              })
              .join(', ')

            const isLastDoneToday =
              workout.lastDone &&
              workout.lastDone.split('T')[0] === todayKey

            return (
              <div key={workout.id}>
                {idx > 0 && (
                  <div
                    className="mx-5"
                    style={{ height: 1, backgroundColor: 'rgba(84,84,88,0.36)' }}
                  />
                )}
                <button
                  className="w-full px-5 py-3.5 flex items-center gap-3.5 active:opacity-70 transition-opacity"
                  onClick={() => router.push(`/workouts/${workout.id}/active`)}
                >
                  {/* Icon */}
                  <div
                    className="rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: iconColors.bg,
                    }}
                  >
                    <Dumbbell size={20} color={iconColors.icon} />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-text-primary font-semibold" style={{ fontSize: 16 }}>
                      {workout.name}
                    </p>
                    <p className="text-text-tertiary" style={{ fontSize: 13 }}>
                      {muscleNames}
                    </p>
                  </div>

                  {/* Right: badge or date + chevron */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLastDoneToday ? (
                      <span
                        className="font-bold rounded-full px-2.5 py-1"
                        style={{
                          backgroundColor: '#A5FD18',
                          color: '#000000',
                          fontSize: 12,
                        }}
                      >
                        Hoje
                      </span>
                    ) : workout.lastDone ? (
                      <span className="text-text-tertiary" style={{ fontSize: 13 }}>
                        {formatDate(workout.lastDone)}
                      </span>
                    ) : null}
                    <ChevronRight size={16} className="text-text-quaternary" />
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7. Heatmap */}
      <div className="mt-6">
        <p
          className="text-text-tertiary uppercase tracking-wider mb-3"
          style={{ fontSize: 11, letterSpacing: '0.08em' }}
        >
          ÚLTIMAS 4 SEMANAS
        </p>
        <div className="bg-surface rounded-3xl p-4">
          <Heatmap data={heatmapData} columns={7} />
        </div>
      </div>
    </div>
  )
}
