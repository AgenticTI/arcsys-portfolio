"use client";

import { Status } from "@/data/mock";

type Props = {
  todoCnt: number;
  inProgressCnt: number;
  doneCnt: number;
  activeFilter: Status | null;
  onFilter: (status: Status | null) => void;
};

const columns: { status: Status; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "bg-gray-100 text-gray-600" },
  { status: "in_progress", label: "In Progress", color: "bg-amber-50 text-amber-600" },
  { status: "done", label: "Done", color: "bg-green-50 text-green-600" },
];

export function KanbanCounters({ todoCnt, inProgressCnt, doneCnt, activeFilter, onFilter }: Props) {
  const counts: Record<Status, number> = {
    todo: todoCnt,
    in_progress: inProgressCnt,
    done: doneCnt,
  };

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {columns.map(({ status, label, color }) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`rounded-xl border p-4 text-left transition-all ${
              isActive
                ? "border-accent bg-accent/5"
                : "border-border bg-bg-card hover:border-accent/40"
            }`}
          >
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{counts[status]}</p>
            <div className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
              {counts[status] === 1 ? "task" : "tasks"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
