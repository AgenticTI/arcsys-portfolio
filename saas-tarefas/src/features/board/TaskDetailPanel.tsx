"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Task } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { X, Calendar, CheckSquare } from "lucide-react";

type Props = {
  task: Task | null;
  onClose: () => void;
};

export function TaskDetailPanel({ task, onClose }: Props) {
  const { toggleSubtask, updateTaskStatus } = useTaskStore();

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/10 z-10"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-96 bg-bg-card border-l border-border z-20 flex flex-col shadow-xl overflow-y-auto"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Task Detail
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold text-text-primary leading-snug">
                  {task.title}
                </h2>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Description
                </p>
                <p className="text-sm text-text-primary leading-relaxed">{task.description}</p>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Priority
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1 text-sm text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                </p>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <button
                      key={subtask.id}
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className="w-full flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded border-2 border-border group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                        <AnimatePresence>
                          {subtask.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-sm bg-accent"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`text-sm text-left transition-colors ${
                          subtask.completed
                            ? "line-through text-text-muted"
                            : "text-text-primary group-hover:text-accent"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Footer — Mark as done */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => {
                  updateTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  task.status === "done"
                    ? "bg-gray-100 text-text-muted hover:bg-gray-200"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {task.status === "done" ? "Mark as To Do" : "Mark as Complete"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
