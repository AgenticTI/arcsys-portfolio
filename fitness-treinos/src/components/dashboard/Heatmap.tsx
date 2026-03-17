type HeatmapDay = {
  date: string
  count: number
}

type Props = {
  data: HeatmapDay[]
  columns?: number // quantas colunas no grid (default 7 para 28 dias)
}

function getCellStyle(count: number): React.CSSProperties {
  if (count === 0) return { backgroundColor: 'var(--color-surface-elevated)' }
  if (count === 1) return { backgroundColor: 'rgba(165,253,24,0.18)' }
  return { backgroundColor: '#A5FD18' }
}

export function Heatmap({ data, columns = 7 }: Props) {
  const legendBoxes = [
    { background: 'var(--color-surface-elevated)' },
    { background: 'rgba(165,253,24,0.18)' },
    { background: 'rgba(165,253,24,0.50)' },
    { background: '#A5FD18' },
  ]

  return (
    <div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {data.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} treino(s)`}
            className="aspect-square rounded-sm"
            style={getCellStyle(day.count)}
          />
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-end gap-1.5 mt-3"
        style={{ fontSize: 11, color: 'rgba(235,235,245,0.16)' }}
      >
        <span>Menos</span>
        {legendBoxes.map((box, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{ width: 10, height: 10, background: box.background }}
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}
