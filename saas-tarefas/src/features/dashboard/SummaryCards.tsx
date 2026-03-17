"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";

export function SummaryCards() {
  const tasks = useTaskStore((s) => s.tasks);

  const total = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const overdueCount = tasks.filter((t) => {
    const today = new Date().toISOString().split("T")[0];
    return t.status !== "done" && t.dueDate < today;
  }).length;
  const highCount = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;

  // Spotlight: first high-priority non-done task
  const spotlight = tasks.find((t) => t.priority === "high" && t.status !== "done") ?? tasks[0];
  const spotlightProject = mockProjects.find((p) => p.id === spotlight?.projectId);

  return (
    <div className="grid grid-cols-3 gap-4 flex-shrink-0">

      {/* Yellow — All Tasks */}
      <div className="relative rounded-[20px] p-6 overflow-hidden bg-accent min-h-[168px] flex flex-col">
        <p className="font-display text-[15px] font-bold text-black/55">Tasks</p>
        {/* Adjust icon */}
        <span className="absolute top-[18px] right-[18px] w-7 h-7 bg-black/10 rounded-lg flex items-center justify-center cursor-pointer">
          <span className="text-black/40 text-xs font-bold">≡</span>
        </span>
        <p className="font-display text-[56px] font-extrabold leading-none mt-1.5 text-black tracking-[-2px]">
          {total}
        </p>
        <p className="text-[13px] font-medium text-black/45 mt-0.5">Total across all projects</p>
        <div className="flex flex-col gap-1 mt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{doneCount}</span>
            <span className="text-[13px] font-medium text-black/50">Completed</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{overdueCount}</span>
            <span className="text-[13px] font-medium text-black/50">Overdue</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[22px] font-bold text-black">{highCount}</span>
            <span className="text-[13px] font-medium text-black/50">High priority</span>
          </div>
        </div>
        {/* Dot grid texture */}
        <svg
          className="absolute bottom-[-10px] right-[56px] w-[96px] h-[64px] opacity-[0.16] pointer-events-none"
          viewBox="0 0 96 64"
        >
          <pattern id="dp" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(0,0,0,0.8)" />
          </pattern>
          <rect width="96" height="64" fill="url(#dp)" />
        </svg>
        {/* Bar decoration */}
        <div className="absolute bottom-[18px] right-[18px] w-12 h-[58px] bg-black/16 rounded-lg" />
      </div>

      {/* Orange — In Progress */}
      <div className="relative rounded-[20px] p-6 overflow-hidden min-h-[168px] flex flex-col" style={{ background: "#D97820" }}>
        <p className="font-display text-[15px] font-bold text-white/60">In Progress</p>
        <p className="font-display text-[56px] font-extrabold leading-none mt-1.5 text-white tracking-[-2px]">
          {inProgressCount}
        </p>
        <div className="flex flex-col gap-1.5 mt-3">
          {mockProjects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2 text-[13px] font-medium text-white/80">
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: `rgba(255,255,255,${i === 0 ? 0.9 : i === 1 ? 0.5 : 0.25})` }}
              />
              {p.name}
            </div>
          ))}
        </div>
        {/* Yellow badge */}
        <div
          className="absolute top-1/2 right-[22px] -translate-y-[58%] w-[60px] h-[60px] rounded-2xl bg-accent flex items-center justify-center font-display text-[28px] font-extrabold text-black"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
        >
          {inProgressCount}
        </div>
        {/* Stripe texture */}
        <div
          className="absolute -bottom-5 -right-5 w-[130px] h-[130px] rounded-full opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(0,0,0,0.6) 0px,rgba(0,0,0,0.6) 2px,transparent 2px,transparent 10px)",
          }}
        />
      </div>

      {/* Dark — Upcoming spotlight */}
      <div className="relative rounded-[20px] p-6 bg-bg-card-2 border border-border min-h-[168px] flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="flex justify-between items-start">
          <p className="font-display text-[15px] font-bold text-text-secondary">Upcoming</p>
          <div className="w-[26px] h-[26px] bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/9 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </div>
        </div>

        {spotlight && (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[rgba(255,59,48,0.16)] text-accent-red border border-[rgba(255,59,48,0.22)]">
              <span className="w-[7px] h-[7px] rounded-full bg-accent-red" />
              High priority
            </span>
            <p className="font-display text-[18px] font-bold text-text-primary leading-[1.3] tracking-[-0.2px]">
              {spotlight.title}
            </p>
            <p className="text-[13px] text-text-muted">
              Due {spotlight.dueDate} · {spotlightProject?.name}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-[#1E1C14] flex items-center justify-center font-display text-[10px] font-bold text-accent">
                LE
              </div>
            </div>
            <span className="text-[13px] text-text-muted">
              {spotlight?.subtasks.length ?? 0} subtasks
            </span>
          </div>
          <div className="w-[34px] h-[34px] rounded-[10px] bg-accent flex items-center justify-center cursor-pointer text-black text-xl font-light shadow-[0_2px_10px_rgba(230,206,0,0.28)] hover:scale-105 transition-transform">
            +
          </div>
        </div>
      </div>
    </div>
  );
}
