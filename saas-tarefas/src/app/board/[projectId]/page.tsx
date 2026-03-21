"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { mockProjects } from "@/data/mock";
import { Status } from "@/data/mock";
import { KanbanCounters } from "@/features/board/KanbanCounters";
import { TaskList } from "@/features/board/TaskList";
import { TaskDetailPanel } from "@/features/board/TaskDetailPanel";


export default function BoardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  const tasks = useTaskStore((s) => s.tasks);
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const setSelectedTask = useTaskStore((s) => s.setSelectedTask);

  const project = mockProjects.find((p) => p.id === projectId);
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  const todoCnt = projectTasks.filter((t) => t.status === "todo").length;
  const inProgressCnt = projectTasks.filter((t) => t.status === "in_progress").length;
  const doneCnt = projectTasks.filter((t) => t.status === "done").length;

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) ?? null
    : null;

  return (
    <div className="relative flex h-full">
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-5 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {project && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
              {project?.name ?? "Project"}
            </h1>
            <span className="text-[14px] text-text-muted font-medium">
              {projectTasks.length} tasks
            </span>
          </div>
        </div>

        {/* Kanban counters */}
        <KanbanCounters
          todoCnt={todoCnt}
          inProgressCnt={inProgressCnt}
          doneCnt={doneCnt}
          activeFilter={statusFilter}
          onFilter={setStatusFilter}
        />

        {/* Task list */}
        <TaskList
          projectId={projectId}
          statusFilter={statusFilter}
          onSelectTask={setSelectedTask}
        />
      </div>

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
