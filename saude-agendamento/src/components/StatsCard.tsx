import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendColor?: string;
}

export function StatsCard({ icon: Icon, label, value, trend, trendColor = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border flex-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <span className="text-[11px] text-neutral-500">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      {trend && <p className={`text-[10px] ${trendColor} mt-1`}>{trend}</p>}
    </div>
  );
}
