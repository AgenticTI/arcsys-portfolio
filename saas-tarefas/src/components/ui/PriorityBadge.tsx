import { Priority } from "@/data/mock";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-50 text-priority-high" },
  medium: { label: "Medium", className: "bg-amber-50 text-priority-medium" },
  low: { label: "Low", className: "bg-green-50 text-priority-low" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
