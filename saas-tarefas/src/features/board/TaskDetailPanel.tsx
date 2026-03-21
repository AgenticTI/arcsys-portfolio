"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Task } from "@/data/mock";
import { useTaskStore } from "@/store/useTaskStore";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { X, Calendar, CheckSquare } from "lucide-react";

type Props = { task: Task | null; onClose: () => void };

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
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-bg-card border-l border-border z-50 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em]">
                Task Detail
              </p>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg-card-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              <h2 className="font-display text-[20px] font-bold text-text-primary leading-snug tracking-[-0.3px]">
                {task.title}
              </h2>

              <div>
                <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                  Description
                </p>
                <p className="text-[15px] text-text-secondary leading-relaxed">{task.description}</p>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                    Priority
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-1.5">
                    Due Date
                  </p>
                  <div className="flex items-center gap-1.5 text-[15px] text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-text-label uppercase tracking-[0.06em] mb-3">
                  Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                </p>
                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <button
                      key={subtask.id}
                      onClick={() => toggleSubtask(task.id, subtask.id)}
                      className="w-full flex items-center gap-3 group"
                    >
                      <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-border group-hover:border-accent flex items-center justify-center transition-colors flex-shrink-0">
                        <AnimatePresence>
                          {subtask.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-2 h-2 rounded-[2px] bg-accent"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`text-[15px] text-left transition-colors ${
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => {
                  updateTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                  task.status === "done"
                    ? "bg-bg-card-2 text-text-muted hover:bg-white/[0.06]"
                    : "bg-accent text-black hover:opacity-90 shadow-[0_2px_10px_rgba(230,206,0,0.28)]"
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
