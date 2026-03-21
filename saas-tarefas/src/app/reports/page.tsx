"use client"
import { useState } from "react"
import { ReportsHero } from "@/features/reports/ReportsHero"
import { MetricCards } from "@/features/reports/MetricCards"
import { ProjectCards } from "@/features/reports/ProjectCards"
import { usePeriodFilter } from "@/features/reports/usePeriodFilter"
import type { PeriodTab } from "@/features/reports/usePeriodFilter"

export default function ReportsPage() {
  const [period, setPeriod] = useState<PeriodTab>("week")
  const data = usePeriodFilter(period)

  return (
    <div className="p-4 md:p-8 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-primary">Relatórios</h1>
      <ReportsHero period={period} data={data} onPeriodChange={setPeriod} />
      <MetricCards data={data} />
      <ProjectCards />
    </div>
  )
}
