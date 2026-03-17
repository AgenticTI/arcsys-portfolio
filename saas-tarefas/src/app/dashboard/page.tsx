import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { WeeklyChart } from "@/features/dashboard/WeeklyChart";
import { UpcomingTasks } from "@/features/dashboard/UpcomingTasks";
import { LayoutDashboard, Home, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full p-6 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] bg-accent-dim border border-accent-glow rounded-lg flex items-center justify-center text-accent">
            <LayoutDashboard className="w-[17px] h-[17px]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card-2 transition-colors">
            <Home className="w-3.5 h-3.5 opacity-70" />
            All Projects
            <ChevronDown className="w-[11px] h-[11px]" />
          </button>
          <button className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card-2 transition-colors">
            This Week
            <ChevronDown className="w-[11px] h-[11px]" />
          </button>
        </div>
      </div>

      {/* Hero Cards */}
      <SummaryCards />

      {/* Middle Row */}
      <div className="grid grid-cols-2 gap-4 flex-shrink-0">
        <WeeklyChart />
        <UpcomingTasks />
      </div>
    </div>
  );
}
