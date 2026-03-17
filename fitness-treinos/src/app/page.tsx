'use client'

import { useFitnessStore } from '@/store/fitness'
import { calcStreak, calcWeekVolume, calcWeekSessions, calcTopMuscle, calcHeatmapData } from '@/lib/utils'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { WeekSummary } from '@/components/dashboard/WeekSummary'
import { NextWorkoutCard } from '@/components/dashboard/NextWorkoutCard'
import { Heatmap } from '@/components/dashboard/Heatmap'

export default function DashboardPage() {
  const { sessions, workouts } = useFitnessStore()

  const streak = calcStreak(sessions)
  const weekVolume = calcWeekVolume(sessions)
  const weekSessionsCount = calcWeekSessions(sessions)
  const topMuscle = calcTopMuscle(sessions)
  const heatmapData = calcHeatmapData(sessions, 30)

  // Próximo treino: o que foi feito há mais tempo (lastDone mais antigo ou null)
  const nextWorkout = [...workouts].sort((a, b) => {
    if (!a.lastDone) return -1
    if (!b.lastDone) return 1
    return new Date(a.lastDone).getTime() - new Date(b.lastDone).getTime()
  })[0]

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-4 pt-12 pb-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-text-secondary text-sm capitalize">{today}</p>
        <h1 className="text-text-primary text-2xl font-bold mt-0.5">
          Bom treino, Leon 👊
        </h1>
      </div>

      {/* Streak */}
      <StreakCard streak={streak} />

      {/* Resumo semanal */}
      <WeekSummary
        volumeKg={weekVolume}
        sessionsCount={weekSessionsCount}
        topMuscle={topMuscle}
      />

      {/* Próximo treino */}
      {nextWorkout && <NextWorkoutCard workout={nextWorkout} />}

      {/* Heatmap 30 dias */}
      <div className="bg-surface rounded-2xl p-5">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-4">
          Últimos 30 dias
        </p>
        <Heatmap data={heatmapData} columns={6} />
      </div>
    </div>
  )
}
