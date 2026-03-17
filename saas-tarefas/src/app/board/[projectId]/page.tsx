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
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {project && (
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
            )}
            <h1 className="text-2xl font-bold text-text-primary">
              {project?.name ?? "Project"}
            </h1>
          </div>
          <p className="text-text-muted text-sm">{projectTasks.length} tasks total</p>
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

      {/* Detail panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
