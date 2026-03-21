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

const statusConfig: Record<Status, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-white/[0.05] text-text-muted border border-border",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.2)]",
  },
  done: {
    label: "Done",
    className: "bg-[rgba(52,199,89,0.12)] text-accent-green border border-[rgba(52,199,89,0.2)]",
  },
};

type Props = {
  task: Task;
  onSelect: (id: string) => void;
};

export function TaskCard({ task, onSelect }: Props) {
  const { updateTaskStatus } = useTaskStore();
  const isDone = task.status === "done";
  const { label, className } = statusConfig[task.status];

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTaskStatus(task.id, statusCycle[task.status]);
  };

  return (
    <div
      onClick={() => onSelect(task.id)}
      className="bg-bg-card border border-border rounded-2xl px-3 py-3 md:px-5 md:py-3.5 flex items-center gap-4 cursor-pointer hover:border-white/10 hover:bg-bg-card-2 transition-all group"
    >
      {/* Checkbox */}
      <button
        onClick={handleStatusClick}
        className="relative flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] border-text-muted group-hover:border-text-secondary flex items-center justify-center transition-colors before:absolute before:inset-[-12px] before:content-['']"
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[7px] h-[7px] rounded-full bg-accent"
          />
        )}
      </button>

      {/* Title */}
      <p className={`flex-1 min-w-0 text-[15px] font-medium truncate ${
        isDone ? "line-through text-text-muted" : "text-text-primary"
      }`}>
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
        <div className="hidden sm:flex items-center gap-1.5 text-[13px] text-text-muted">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <button
          onClick={handleStatusClick}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 truncate max-w-[72px] sm:max-w-none ${className}`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
