import { AppointmentStatus } from "@/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const config: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmado",
    className: "bg-primary-light text-primary border border-primary/20",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-50 text-red-500 border border-red-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase ${className}`}
    >
      {label}
    </span>
  );
}
