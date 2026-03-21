"use client";

import { Task, mockProjects } from "@/data/mock";

type Props = {
  tasks: Task[];
};

export function MobileCalendarList({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-text-muted text-sm">
        No tasks in this period
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {tasks.map((task) => {
        const project = mockProjects.find((p) => p.id === task.projectId);
        const doneSubtasks = task.subtasks.filter((s) => s.completed).length;
        const totalSubtasks = task.subtasks.length;
        const progress = totalSubtasks > 0 ? doneSubtasks / totalSubtasks : 0;

        return (
          <div
            key={task.id}
            className="bg-bg-card border border-border rounded-xl p-3 border-l-4"
            style={{ borderLeftColor: project?.color ?? "#666" }}
          >
            <p className="text-[14px] font-medium text-text-primary">
              {task.title}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-text-muted">
              <span>{task.createdAt} → {task.dueDate}</span>
              {totalSubtasks > 0 && (
                <span>{doneSubtasks}/{totalSubtasks} subtasks</span>
              )}
            </div>
            {totalSubtasks > 0 && (
              <div className="w-full h-1 bg-white/[0.06] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: project?.color ?? "#666",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
