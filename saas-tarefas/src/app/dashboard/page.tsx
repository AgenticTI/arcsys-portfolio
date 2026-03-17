import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { WeeklyChart } from "@/features/dashboard/WeeklyChart";
import { UpcomingTasks } from "@/features/dashboard/UpcomingTasks";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Good morning, Leon</h1>
        <p className="text-text-muted mt-1">Here&apos;s what&apos;s on your plate today.</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Bottom row: chart + upcoming */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <WeeklyChart />
        <UpcomingTasks />
      </div>
    </div>
  );
}
