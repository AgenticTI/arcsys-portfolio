"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskStore } from "@/store/useTaskStore";
import { Task, Status } from "@/data/mock";
import { TaskCard } from "./TaskCard";
import { GripVertical } from "lucide-react";

function SortableTaskCard({
  task,
  onSelect,
}: {
  task: Task;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-text-muted hover:text-text-primary cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1">
        <TaskCard task={task} onSelect={onSelect} />
      </div>
    </div>
  );
}

type Props = {
  projectId: string;
  statusFilter: Status | null;
  onSelectTask: (id: string) => void;
};

export function TaskList({ projectId, statusFilter, onSelectTask }: Props) {
  const { tasks, reorderTasks } = useTaskStore();

  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const filtered = statusFilter
    ? projectTasks.filter((t) => t.status === statusFilter)
    : projectTasks;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentIds = projectTasks.map((t) => t.id);
      const oldIndex = currentIds.indexOf(active.id as string);
      const newIndex = currentIds.indexOf(over.id as string);
      const newOrder = arrayMove(currentIds, oldIndex, newIndex);
      reorderTasks(projectId, newOrder);
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm">
        No tasks in this category.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={projectTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {filtered.map((task) => (
            <SortableTaskCard key={task.id} task={task} onSelect={onSelectTask} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
