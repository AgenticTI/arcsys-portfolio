"use client";

import Link from "next/link";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";

export function UpcomingTasks() {
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <div className="bg-bg-card border border-border rounded-[20px] p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-[15px] font-bold text-text-primary">Projects</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {mockProjects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const donePct = projectTasks.length > 0
            ? Math.round((projectTasks.filter((t) => t.status === "done").length / projectTasks.length) * 100)
            : 0;

          return (
            <Link
              key={project.id}
              href={`/board/${project.id}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-bg-card-2 hover:bg-white/[0.04] cursor-pointer transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="flex-1 text-[14px] font-medium text-text-primary">
                {project.name}
              </span>
              <span className="text-[13px] text-text-muted">{projectTasks.length} tasks</span>
              <div className="w-[56px] h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${donePct}%`, backgroundColor: project.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
