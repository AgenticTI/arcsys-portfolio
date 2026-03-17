"use client";

import { Status } from "@/data/mock";

type Props = {
  todoCnt: number;
  inProgressCnt: number;
  doneCnt: number;
  activeFilter: Status | null;
  onFilter: (status: Status | null) => void;
};

const columns: {
  status: Status;
  label: string;
  activeBg: string;
  activeText: string;
  badgeClass: string;
}[] = [
  {
    status: "todo",
    label: "To Do",
    activeBg: "border-white/10 bg-white/[0.04]",
    activeText: "text-text-primary",
    badgeClass: "bg-white/[0.05] text-text-muted border border-border",
  },
  {
    status: "in_progress",
    label: "In Progress",
    activeBg: "border-accent-orange/30 bg-accent-orange-dim",
    activeText: "text-accent-orange",
    badgeClass: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.22)]",
  },
  {
    status: "done",
    label: "Done",
    activeBg: "border-[rgba(52,199,89,0.3)] bg-[rgba(52,199,89,0.08)]",
    activeText: "text-accent-green",
    badgeClass: "bg-[rgba(52,199,89,0.12)] text-accent-green border border-[rgba(52,199,89,0.2)]",
  },
];

export function KanbanCounters({
  todoCnt, inProgressCnt, doneCnt, activeFilter, onFilter,
}: Props) {
  const counts: Record<Status, number> = {
    todo: todoCnt,
    in_progress: inProgressCnt,
    done: doneCnt,
  };

  return (
    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
      {columns.map(({ status, label, activeBg, activeText, badgeClass }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`rounded-[20px] border p-5 text-left transition-all ${
              isActive ? activeBg : "border-border bg-bg-card hover:border-white/10 hover:bg-bg-card-2"
            }`}
          >
            <p className={`text-[12px] font-semibold uppercase tracking-[0.06em] ${
              isActive ? activeText : "text-text-muted"
            }`}>
              {label}
            </p>
            <p className="font-display text-[40px] font-extrabold text-text-primary mt-1 tracking-[-1.5px] leading-none">
              {counts[status]}
            </p>
            <span className={`inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
              {counts[status] === 1 ? "task" : "tasks"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
