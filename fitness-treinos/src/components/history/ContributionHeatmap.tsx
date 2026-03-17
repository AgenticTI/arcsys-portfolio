import { calcHeatmapData } from '@/lib/utils'
import type { Session } from '@/lib/types'

type Props = {
  sessions: Session[]
}

export function ContributionHeatmap({ sessions }: Props) {
  const data = calcHeatmapData(sessions, 91)

  // Pad start to align to Sunday (week start = 0)
  // The first date in data is (today - 90 days). We need to find its day of week.
  const firstDate = data.length > 0 ? new Date(data[0].date) : new Date()
  const startDayOfWeek = firstDate.getDay() // 0=Sun

  // Pad with nulls at start so that first real day aligns to correct weekday
  const paddedLength = startDayOfWeek + data.length
  const totalCells = Math.ceil(paddedLength / 7) * 7
  const numCols = Math.ceil(paddedLength / 7) // should be ~13

  // Build columns: each column is 7 days (Sun–Sat)
  const columns: Array<Array<{ date: string; count: number } | null>> = []
  for (let col = 0; col < numCols; col++) {
    const column: Array<{ date: string; count: number } | null> = []
    for (let row = 0; row < 7; row++) {
      const flatIndex = col * 7 + row
      const dataIndex = flatIndex - startDayOfWeek
      if (dataIndex < 0 || dataIndex >= data.length) {
        column.push(null)
      } else {
        column.push(data[dataIndex])
      }
    }
    columns.push(column)
  }

  function getCellStyle(count: number | null): React.CSSProperties {
    if (count === null || count === 0) {
      return { backgroundColor: 'var(--color-surface-elevated)' }
    }
    if (count === 1) return { backgroundColor: 'rgba(165,253,24,0.18)' }
    if (count === 2) return { backgroundColor: 'rgba(165,253,24,0.45)' }
    return { backgroundColor: '#A5FD18' }
  }

  // Ignore totalCells (only used for calculation)
  void totalCells

  return (
    <div>
      {/* Grid: numCols columns × 7 rows */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}
      >
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((day, ri) => (
              <div
                key={ri}
                title={day ? `${day.date}: ${day.count} treino(s)` : ''}
                className="rounded-[3px]"
                style={{
                  height: 9,
                  ...getCellStyle(day ? day.count : null),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-text-quaternary)' }}
        >
          Menos
        </span>
        {[
          { backgroundColor: 'var(--color-surface-elevated)' },
          { backgroundColor: 'rgba(165,253,24,0.18)' },
          { backgroundColor: 'rgba(165,253,24,0.45)' },
          { backgroundColor: '#A5FD18' },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-[3px]"
            style={{ width: 10, height: 10, ...s }}
          />
        ))}
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-text-quaternary)' }}
        >
          Mais
        </span>
      </div>
    </div>
  )
}
