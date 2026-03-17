import { calcHeatmapData } from '@/lib/utils'
import type { Session } from '@/lib/types'

type Props = {
  sessions: Session[]
}

function getColor(count: number): string {
  if (count === 0) return '#1C1C1C'
  if (count === 1) return '#FF6B0066'
  return '#FF6B00'
}

export function ContributionHeatmap({ sessions }: Props) {
  // 90 dias = 13 semanas completas (91 dias). Arredondamos para 91.
  const data = calcHeatmapData(sessions, 91)

  // Agrupa em semanas de 7 dias
  const weeks: Array<typeof data> = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} treino(s)`}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-text-secondary text-xs">Menos</span>
        {[0, 1, 2].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(v) }}
          />
        ))}
        <span className="text-text-secondary text-xs">Mais</span>
      </div>
    </div>
  )
}
