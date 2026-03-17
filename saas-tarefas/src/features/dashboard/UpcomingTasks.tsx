"use client";

import Link from "next/link";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";
import { PriorityBadge } from "@/components/ui/PriorityBadge";

export function UpcomingTasks() {
  const tasks = useTaskStore((s) => s.tasks);

  const upcoming = tasks
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <div className="bg-bg-card rounded-xl border border-border p-5">
      <p className="text-sm font-semibold text-text-primary mb-4">Upcoming Tasks</p>
      <div className="space-y-3">
        {upcoming.map((task) => {
          const project = mockProjects.find((p) => p.id === task.projectId);
          return (
            <Link
              key={task.id}
              href={`/board/${task.projectId}`}
              className="flex items-center gap-3 group"
            >
              <div
                className="w-1.5 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: project?.color ?? "#7C3AED" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                  {task.title}
                </p>
                <p className="text-xs text-text-muted">{project?.name} · Due {task.dueDate}</p>
              </div>
              <PriorityBadge priority={task.priority} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
