'use client'

import { useFitnessStore } from '@/store/fitness'
import { ContributionHeatmap } from '@/components/history/ContributionHeatmap'
import { SessionItem } from '@/components/history/SessionItem'

export default function HistoryPage() {
  const { sessions } = useFitnessStore()

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="px-4 pt-12 pb-6">
      <h1 className="text-text-primary text-2xl font-bold mb-6">Histórico</h1>

      {/* Heatmap 90 dias */}
      <div className="bg-surface rounded-2xl p-5 mb-6">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-4">
          Frequência — últimos 90 dias
        </p>
        <ContributionHeatmap sessions={sessions} />
      </div>

      {/* Lista de sessões */}
      <div>
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-3">
          Sessões ({sortedSessions.length})
        </p>
        <div className="space-y-2">
          {sortedSessions.map((session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  )
}
