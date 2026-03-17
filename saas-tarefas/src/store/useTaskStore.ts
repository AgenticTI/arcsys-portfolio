import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTasks, mockProjects, Task, Status } from "@/data/mock";

type TaskStore = {
  tasks: Task[];
  activeProjectId: string;
  selectedTaskId: string | null;
  setActiveProject: (projectId: string) => void;
  setSelectedTask: (taskId: string | null) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (projectId: string, orderedIds: string[]) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      activeProjectId: mockProjects[0].id,
      selectedTaskId: null,

      setActiveProject: (projectId) =>
        set({ activeProjectId: projectId, selectedTaskId: null }),

      setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),

      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : t
          ),
        })),

      reorderTasks: (projectId, orderedIds) =>
        set((state) => {
          const otherTasks = state.tasks.filter((t) => t.projectId !== projectId);
          const projectTasks = state.tasks.filter((t) => t.projectId === projectId);
          const reordered = orderedIds
            .map((id) => projectTasks.find((t) => t.id === id))
            .filter(Boolean) as Task[];
          return { tasks: [...otherTasks, ...reordered] };
        }),
    }),
    {
      name: "hazel-tasks",
    }
  )
);
