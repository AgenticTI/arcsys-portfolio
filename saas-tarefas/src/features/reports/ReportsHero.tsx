"use client"
import type { PeriodTab, PeriodData } from "./usePeriodFilter"

type Props = {
  period: PeriodTab
  data: PeriodData
  onPeriodChange: (p: PeriodTab) => void
}

const PERIOD_LABELS: Record<PeriodTab, string> = {
  week: "Esta semana",
  month: "Este mês",
  total: "Total",
}

// Visual decoration bars (not derived from real data)
const MINI_BARS: Record<PeriodTab, number[]> = {
  week: [3, 5, 2, 7, 4, 6, 3],
  month: [8, 12, 9, 15],
  total: [12],
}

const MAX_BAR = 15

export function ReportsHero({ period, data, onPeriodChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Period tabs */}
      <div className="flex gap-1 bg-card rounded-lg p-1 w-fit">
        {(["week", "month", "total"] as PeriodTab[]).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              period === p
                ? "bg-accent text-white font-medium"
                : "text-muted hover:text-primary"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <div className="bg-card rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
        <div className="relative">
          <p className="text-sm text-muted mb-2">Tarefas concluídas</p>
          <div className="flex items-end gap-4 md:gap-8 flex-wrap">
            {/* Big number */}
            <span
              className="text-4xl md:text-6xl font-bold text-primary transition-opacity duration-150"
              key={`${period}-${data.completedCount}`}
            >
              {data.completedCount}
            </span>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1 h-12 mb-1">
              {MINI_BARS[period].map((h, i) => (
                <div
                  key={i}
                  className="w-3 bg-accent/40 rounded-sm"
                  style={{ height: `${(h / MAX_BAR) * 100}%` }}
                />
              ))}
            </div>

            {/* Secondary numbers */}
            <div className="flex gap-6 mb-1">
              <div>
                <p className="text-2xl font-semibold text-primary">{data.inProgressCount}</p>
                <p className="text-xs text-muted">Em progresso</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-primary">{data.todoCount}</p>
                <p className="text-xs text-muted">A fazer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
