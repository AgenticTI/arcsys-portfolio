type Props = {
  volumeKg: number
  sessionsCount: number
  topMuscle: string
}

function StatBox({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="bg-surface rounded-xl p-4 flex-1">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-text-secondary text-xs mt-1">{label}</p>
    </div>
  )
}

export function WeekSummary({ volumeKg, sessionsCount, topMuscle }: Props) {
  return (
    <div>
      <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-3">
        Esta semana
      </p>
      <div className="flex gap-3">
        <StatBox value={`${(volumeKg / 1000).toFixed(1)}t`} label="Volume total" />
        <StatBox value={String(sessionsCount)} label="Treinos" />
        <StatBox value={topMuscle} label="Foco principal" />
      </div>
    </div>
  )
}
