interface WeeklyChartProps {
  data: { day: string; count: number }[];
  currentDay: string;
}

export function WeeklyChart({ data, currentDay }: WeeklyChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border flex-1">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-white">Consultas da Semana</span>
        <span className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
          Esta Semana
        </span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {data.map(({ day, count }) => {
          const height = (count / maxCount) * 100;
          const isCurrent = day === currentDay;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              {isCurrent && (
                <span className="text-[9px] text-primary font-bold">{count}</span>
              )}
              <div
                className={`w-full rounded-t ${isCurrent ? "bg-primary" : "bg-primary/15"}`}
                style={{ height: `${Math.max(height, 8)}%` }}
              />
              <span className={`text-[9px] ${isCurrent ? "text-white font-semibold" : "text-neutral-500"}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
