"use client";

import { useTaskStore } from "@/store/useTaskStore";

export function SummaryCards() {
  const tasks = useTaskStore((s) => s.tasks);

  const today = new Date().toISOString().split("T")[0];
  const todayCount = tasks.filter((t) => t.dueDate === today).length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const cards = [
    { label: "Due Today", value: todayCount, color: "bg-accent/10 text-accent" },
    { label: "In Progress", value: inProgressCount, color: "bg-amber-50 text-amber-600" },
    { label: "Completed", value: doneCount, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-text-muted font-medium">{card.label}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{card.value}</p>
          <div className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${card.color}`}>
            {card.label === "Due Today" ? "tasks today" : card.label === "In Progress" ? "active" : "all time"}
          </div>
        </div>
      ))}
    </div>
  );
}
