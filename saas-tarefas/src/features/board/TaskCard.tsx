"use client";

import { motion } from "framer-motion";
import { Task, Status } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { Calendar } from "lucide-react";

const statusCycle: Record<Status, Status> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const statusLabel: Record<Status, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const statusStyle: Record<Status, string> = {
  todo: "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-50 text-amber-600",
  done: "bg-green-50 text-green-600",
};

type Props = {
  task: Task;
  onSelect: (id: string) => void;
};

export function TaskCard({ task, onSelect }: Props) {
  const { updateTaskStatus } = useTaskStore();
  const isDone = task.status === "done";

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, statusCycle[task.status]);
  };

  return (
    <div
      onClick={() => onSelect(task.id)}
      className="bg-bg-card border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-accent/40 hover:shadow-sm transition-all group"
    >
      {/* Animated checkbox */}
      <button
        onClick={handleStatusClick}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-border group-hover:border-accent/60 flex items-center justify-center transition-colors"
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-3 h-3 rounded-full bg-priority-low"
          />
        )}
      </button>

      {/* Title */}
      <p className={`flex-1 text-sm font-medium truncate ${isDone ? "line-through text-text-muted" : "text-text-primary"}`}>
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <button
          onClick={handleStatusClick}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${statusStyle[task.status]} hover:opacity-80`}
        >
          {statusLabel[task.status]}
        </button>
      </div>
    </div>
  );
}
