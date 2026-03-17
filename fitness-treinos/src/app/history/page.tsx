'use client'

import { useState } from 'react'
import { useFitnessStore } from '@/store/fitness'
import { ContributionHeatmap } from '@/components/history/ContributionHeatmap'
import { SessionItem } from '@/components/history/SessionItem'

type MetricTab = 'volume' | 'sessoes' | 'duracao'

function getWeekBounds() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)
  return startOfWeek
}

function getWeekStart(offsetWeeks: number) {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const start = new Date(today)
  start.setDate(today.getDate() - dayOfWeek - offsetWeeks * 7)
  start.setHours(0, 0, 0, 0)
  return start
}

export default function HistoryPage() {
  const { sessions } = useFitnessStore()
  const [activeTab, setActiveTab] = useState<MetricTab>('volume')

  const weekStart = getWeekBounds()

  const thisWeekSessions = sessions.filter((s) => new Date(s.date) >= weekStart)
  const lastWeekStart = getWeekStart(1)
  const lastWeekSessions = sessions.filter((s) => {
    const d = new Date(s.date)
    return d >= lastWeekStart && d < weekStart
  })

  // Hero value
  const heroVolume = thisWeekSessions.reduce((sum, s) => sum + s.totalVolumeKg, 0) / 1000
  const heroSessoes = thisWeekSessions.length
  const heroDuracao = thisWeekSessions.reduce((sum, s) => sum + s.durationMinutes, 0)

  // Delta %
  function calcDelta(current: number, prev: number): string {
    if (prev === 0) return '+12%'
    const delta = ((current - prev) / prev) * 100
    if (delta >= 0) return `+${Math.round(delta)}%`
    return `${Math.round(delta)}%`
  }

  const lastWeekVolume = lastWeekSessions.reduce((sum, s) => sum + s.totalVolumeKg, 0) / 1000
  const lastWeekSessoes = lastWeekSessions.length
  const lastWeekDuracao = lastWeekSessions.reduce((sum, s) => sum + s.durationMinutes, 0)

  const deltaVolume = calcDelta(heroVolume, lastWeekVolume)
  const deltaSessoes = calcDelta(heroSessoes, lastWeekSessoes)
  const deltaDuracao = calcDelta(heroDuracao, lastWeekDuracao)

  // Bar chart: 7 days of current week (Sun–Sat)
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
  const today = new Date()
  const todayIndex = today.getDay()

  const dayVolumes = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    const dateKey = d.toISOString().split('T')[0]
    return sessions
      .filter((s) => s.date.split('T')[0] === dateKey)
      .reduce((sum, s) => sum + s.totalVolumeKg, 0)
  })

  const maxVol = Math.max(...dayVolumes, 1)

  // Hero display
  let heroValue: string
  let heroUnit: string
  let heroDelta: string

  if (activeTab === 'volume') {
    heroValue = heroVolume.toFixed(1)
    heroUnit = 't'
    heroDelta = deltaVolume
  } else if (activeTab === 'sessoes') {
    heroValue = String(heroSessoes)
    heroUnit = 'x'
    heroDelta = deltaSessoes
  } else {
    heroValue = String(heroDuracao)
    heroUnit = 'min'
    heroDelta = deltaDuracao
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const tabs: { key: MetricTab; label: string }[] = [
    { key: 'volume', label: 'Volume' },
    { key: 'sessoes', label: 'Sessões' },
    { key: 'duracao', label: 'Duração' },
  ]

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-5 pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-tertiary mb-1">
          ANÁLISE
        </p>
        <h1 className="text-[34px] font-bold tracking-[-0.4px] text-text-primary">
          Progresso
        </h1>
      </div>

      {/* Stat Hero Card */}
      <div className="mx-5 mt-4 bg-surface rounded-[22px] p-[22px]">
        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-[7px] rounded-full text-[14px] font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-accent text-black'
                  : 'text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hero Value */}
        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-[56px] font-extrabold tracking-[-3px] text-text-primary leading-none">
            {heroValue}
          </span>
          <sup className="text-[22px] font-semibold text-text-secondary">{heroUnit}</sup>
        </div>

        {/* Sub line */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[14px] text-text-tertiary">Esta semana</span>
          <span
            className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(165,253,24,0.15)',
              color: '#A5FD18',
            }}
          >
            {heroDelta}
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 mt-6" style={{ height: 80 }}>
          {dayVolumes.map((vol, i) => {
            const isToday = i === todayIndex
            const hasSession = vol > 0
            const minHeight = 12
            const heightPct = hasSession
              ? Math.max(minHeight, (vol / maxVol) * 100)
              : minHeight

            let barBg: string
            if (isToday) {
              barBg = '#A5FD18'
            } else if (hasSession) {
              barBg = 'var(--color-surface-3)'
            } else {
              barBg = 'var(--color-surface-elevated)'
            }

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
                style={{ height: '100%', justifyContent: 'flex-end' }}
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: barBg,
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isToday
                      ? '0 -4px 14px rgba(165,253,24,0.45)'
                      : undefined,
                  }}
                />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isToday ? '#A5FD18' : 'var(--color-text-quaternary)' }}
                >
                  {days[i]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="mx-5 mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-tertiary mb-3">
          FREQUÊNCIA — ÚLTIMOS 91 DIAS
        </p>
        <div className="bg-surface rounded-[22px] p-[18px]">
          <ContributionHeatmap sessions={sessions} />
        </div>
      </div>

      {/* Sessions list */}
      <div className="mt-6">
        <div className="px-5 flex items-center justify-between mb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-text-tertiary">
            SESSÕES RECENTES
          </p>
          <span className="text-[15px] text-accent">Ver tudo</span>
        </div>
        {sortedSessions.slice(0, 5).map((session) => (
          <div key={session.id} className="mx-5 mt-3">
            <SessionItem session={session} />
          </div>
        ))}
      </div>
    </div>
  )
}
