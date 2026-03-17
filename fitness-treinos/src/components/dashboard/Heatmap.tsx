type HeatmapDay = {
  date: string
  count: number
}

type Props = {
  data: HeatmapDay[]
  columns?: number // quantas colunas no grid (default 6 para 30 dias)
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-surface-elevated'
  if (count === 1) return 'bg-accent opacity-40'
  return 'bg-accent'
}

export function Heatmap({ data, columns = 6 }: Props) {
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
            className={`aspect-square rounded-sm ${getIntensityClass(day.count)}`}
          />
        ))}
      </div>
    </div>
  )
}
