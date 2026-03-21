import { useState, useEffect } from "react"
import { useTaskStore } from "@/store/useTaskStore"
import type { Task } from "@/data/mock"
import { getWeekRange, getMonthRange } from "./dateUtils"

export type PeriodTab = "week" | "month" | "total"

export type PeriodData = {
  tasks: Task[]
  completedCount: number
  inProgressCount: number
  todoCount: number
  completionRate: number
}

function computePeriodData(allTasks: Task[], period: PeriodTab): PeriodData {
  const now = new Date()
  let tasks: Task[]
  if (period === "week") {
    const [start, end] = getWeekRange(now)
    tasks = allTasks.filter((t) => {
      const d = new Date(t.dueDate)
      return d >= start && d <= end
    })
  } else if (period === "month") {
    const [start, end] = getMonthRange(now)
    tasks = allTasks.filter((t) => {
      const d = new Date(t.dueDate)
      return d >= start && d <= end
    })
  } else {
    tasks = allTasks
  }
  const completedCount = tasks.filter((t) => t.status === "done").length
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length
  const todoCount = tasks.filter((t) => t.status === "todo").length
  const completionRate = tasks.length > 0 ? completedCount / tasks.length : 0
  return { tasks, completedCount, inProgressCount, todoCount, completionRate }
}

const EMPTY: PeriodData = {
  tasks: [],
  completedCount: 0,
  inProgressCount: 0,
  todoCount: 0,
  completionRate: 0,
}

export function usePeriodFilter(period: PeriodTab): PeriodData {
  const allTasks = useTaskStore((s) => s.tasks)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return EMPTY

  return computePeriodData(allTasks, period)
}
