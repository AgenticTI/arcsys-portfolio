"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockProjects } from "@/data/mock"

type Props = {
  period: Date
  activeProjects: string[]
  onPrev: () => void
  onNext: () => void
  onToggleProject: (projectId: string) => void
}

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export function PeriodNav({ period, activeProjects, onPrev, onNext, onToggleProject }: Props) {
  const label = `${MONTHS_PT[period.getMonth()]} ${period.getFullYear()}`

  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary">Calendar</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-1 text-muted hover:text-primary transition-colors rounded hover:bg-card"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-primary w-36 text-center">{label}</span>
          <button
            onClick={onNext}
            className="p-1 text-muted hover:text-primary transition-colors rounded hover:bg-card"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto flex-nowrap">
        {mockProjects.map((project) => {
          const isActive = activeProjects.includes(project.id)
          return (
            <button
              key={project.id}
              onClick={() => onToggleProject(project.id)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "border-transparent text-white"
                  : "border-border text-muted hover:text-primary"
              }`}
              style={isActive ? { backgroundColor: project.color } : undefined}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isActive ? "white" : project.color }}
              />
              {project.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
