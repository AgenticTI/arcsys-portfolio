"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTaskStore } from "@/store/useTaskStore"
import { mockProjects } from "@/data/mock"
import { PeriodNav } from "./PeriodNav"
import { GanttBar } from "./GanttBar"

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getTodayPercent(periodStart: Date, daysInMonth: number): number {
  const today = new Date()
  if (
    today.getMonth() !== periodStart.getMonth() ||
    today.getFullYear() !== periodStart.getFullYear()
  )
    return -1
  return ((today.getDate() - 1) / daysInMonth) * 100
}

export function GanttChart() {
  const tasks = useTaskStore((s) => s.tasks)

  const [period, setPeriod] = useState<Date>(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [activeProjects, setActiveProjects] = useState<string[]>(
    mockProjects.map((p) => p.id)
  )

  const daysInMonth = getDaysInMonth(period)
  const todayPercent = getTodayPercent(period, daysInMonth)
  const dayMarkers = [1, 7, 14, 21, daysInMonth]

  const periodEnd = new Date(period.getFullYear(), period.getMonth() + 1, 0, 23, 59, 59, 999)

  // Parse date-only strings as local midnight to avoid UTC offset shifting the date
  function parseLocalDate(str: string): Date {
    const [y, m, d] = str.split("-").map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0)
  }

  const visibleTasks = tasks.filter((task) => {
    if (!activeProjects.includes(task.projectId)) return false
    const start = parseLocalDate(task.createdAt)
    const end = parseLocalDate(task.dueDate)
    return start <= periodEnd && end >= period
  })

  function handlePrev() {
    setPeriod((p) => {
      const d = new Date(p)
      d.setMonth(d.getMonth() - 1)
      return d
    })
  }

  function handleNext() {
    setPeriod((p) => {
      const d = new Date(p)
      d.setMonth(d.getMonth() + 1)
      return d
    })
  }

  function handleToggleProject(projectId: string) {
    setActiveProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PeriodNav
        period={period}
        activeProjects={activeProjects}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleProject={handleToggleProject}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Day axis header */}
        <div className="flex h-8 border-b border-border sticky top-0 bg-bg-app z-10">
          <div className="w-[180px] flex-shrink-0" />
          <div className="flex-1 relative">
            {dayMarkers.map((day) => (
              <span
                key={day}
                className="absolute top-1/2 -translate-y-1/2 text-xs text-muted"
                style={{ left: `${((day - 1) / daysInMonth) * 100}%` }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="relative">
          {/* Today vertical line */}
          {todayPercent >= 0 && (
            <div
              className="absolute top-0 bottom-0 w-px bg-accent/50 z-10 pointer-events-none"
              style={{
                left: `calc(180px + (100% - 180px) * ${todayPercent / 100})`,
              }}
            />
          )}

          <AnimatePresence>
            {visibleTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-40 text-muted text-sm"
              >
                Nenhuma tarefa neste período
              </motion.div>
            ) : (
              visibleTasks.map((task) => {
                const project = mockProjects.find((p) => p.id === task.projectId)!
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <GanttBar
                      task={task}
                      project={project}
                      periodStart={period}
                      daysInMonth={daysInMonth}
                    />
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
