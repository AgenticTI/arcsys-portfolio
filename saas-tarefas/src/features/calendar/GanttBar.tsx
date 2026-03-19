"use client"
import { useState } from "react"
import type { Task, Project } from "@/data/mock"

type Props = {
  task: Task
  project: Project
  periodStart: Date
  daysInMonth: number
}

const STATUS_LABELS: Record<string, string> = {
  todo: "A fazer",
  in_progress: "Em progresso",
  done: "Concluída",
}

export function GanttBar({ task, project, periodStart, daysInMonth }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0, 23, 59, 59, 999)
  const periodDuration = periodEnd.getTime() - periodStart.getTime()

  // Parse date-only strings as local midnight to avoid UTC offset shifting the date
  function parseLocalDate(str: string): number {
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0).getTime()
  }
  const taskStart = parseLocalDate(task.createdAt)
  const taskEnd = parseLocalDate(task.dueDate)

  // Hide if entirely outside period
  if (taskStart > periodEnd.getTime() || taskEnd < periodStart.getTime()) return null

  const leftPercent =
    Math.max(0, (taskStart - periodStart.getTime()) / periodDuration) * 100
  const rawWidth =
    ((Math.min(taskEnd, periodEnd.getTime()) - Math.max(taskStart, periodStart.getTime())) /
      periodDuration) *
    100
  const minWidth = 100 / daysInMonth
  const widthPercent = Math.max(rawWidth, minWidth)

  return (
    <div className="flex h-10 items-center border-b border-border/50 hover:bg-card/50 transition-colors">
      {/* Task name column */}
      <div className="w-[180px] flex-shrink-0 px-4 text-sm text-primary truncate" title={task.title}>
        {task.title}
      </div>
      {/* Bar area */}
      <div className="flex-1 relative h-full flex items-center px-2">
        <div
          className="absolute h-6 rounded cursor-pointer"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            backgroundColor: project.color,
            opacity: task.status === "done" ? 0.45 : 0.8,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 z-20 bg-card border border-border rounded-lg shadow-lg p-3 text-xs whitespace-nowrap min-w-[180px]">
              <p className="font-medium text-primary mb-1">{task.title}</p>
              <p className="text-muted">{project.name}</p>
              <p className="text-muted">{STATUS_LABELS[task.status]}</p>
              <p className="text-muted">Prazo: {task.dueDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
