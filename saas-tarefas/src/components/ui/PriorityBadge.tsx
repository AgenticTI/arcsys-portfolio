import { Priority } from "@/data/mock";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-[rgba(255,59,48,0.16)] text-accent-red border border-[rgba(255,59,48,0.22)]",
  },
  medium: {
    label: "Medium",
    className: "bg-accent-orange-dim text-accent-orange border border-[rgba(217,120,32,0.22)]",
  },
  low: {
    label: "Low",
    className: "bg-[rgba(10,132,255,0.16)] text-accent-blue border border-[rgba(10,132,255,0.22)]",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = priorityConfig[priority];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}>
      {label}
    </span>
  );
}
