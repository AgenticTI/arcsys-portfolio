"use client"
import type { PeriodData } from "./usePeriodFilter"

type Props = {
  data: PeriodData
}

export function MetricCards({ data }: Props) {
  const highPriorityDone = data.tasks.filter(
    (t) => t.priority === "high" && t.status === "done"
  ).length

  const metrics = [
    { label: "Tarefas concluídas", value: String(data.completedCount) },
    { label: "Taxa de conclusão", value: `${Math.round(data.completionRate * 100)}%` },
    { label: "Alta prioridade concluídas", value: String(highPriorityDone) },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-card rounded-xl p-5">
          <p className="text-3xl font-bold text-primary mb-1">{m.value}</p>
          <p className="text-sm text-muted">{m.label}</p>
        </div>
      ))}
    </div>
  )
}
