import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTasks, mockProjects, mockPages, Task, Status, WikiPage } from "@/data/mock";

type TaskStore = {
  tasks: Task[];
  activeProjectId: string;
  selectedTaskId: string | null;
  pages: WikiPage[];
  setActiveProject: (projectId: string) => void;
  setSelectedTask: (taskId: string | null) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (projectId: string, orderedIds: string[]) => void;
  addPage: (page: WikiPage) => void;
  updatePage: (id: string, updates: Partial<Pick<WikiPage, "title" | "content" | "updatedAt">>) => void;
  deletePage: (id: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      activeProjectId: mockProjects[0].id,
      selectedTaskId: null,
      pages: mockPages,

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

      addPage: (page) =>
        set((state) => ({ pages: [...state.pages, page] })),

      updatePage: (id, updates) =>
        set((state) => ({
          pages: state.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePage: (id) =>
        set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
    }),
    {
      name: "hazel-tasks",
    }
  )
);
