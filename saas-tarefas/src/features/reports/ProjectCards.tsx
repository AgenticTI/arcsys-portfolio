"use client"
import { mockProjects } from "@/data/mock"
import { useTaskStore } from "@/store/useTaskStore"

export function ProjectCards() {
  const allTasks = useTaskStore((s) => s.tasks)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {mockProjects.map((project) => {
        // Progress bar uses all tasks for the project (not period-filtered), per spec
        const projectAllTasks = allTasks.filter((t) => t.projectId === project.id)
        const doneCount = projectAllTasks.filter((t) => t.status === "done").length
        const totalCount = projectAllTasks.length
        const progress = totalCount > 0 ? doneCount / totalCount : 0

        const isOverdue = projectAllTasks.some(
          (t) => new Date(t.dueDate) < today && t.status !== "done"
        )

        return (
          <div
            key={project.id}
            className="bg-card rounded-xl p-5 border-l-4"
            style={{ borderLeftColor: project.color }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="font-medium text-primary text-sm truncate">
                  {project.name}
                </span>
              </div>
              {isOverdue && (
                <span className="text-xs bg-priority-high/10 text-priority-high px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                  Atrasada
                </span>
              )}
            </div>
            <div className="mb-2">
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: project.color,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted">
              {doneCount}/{totalCount} concluídas
            </p>
          </div>
        )
      })}
    </div>
  )
}
