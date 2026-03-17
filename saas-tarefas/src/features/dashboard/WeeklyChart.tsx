// Dados mockados fixos — representa uma semana de atividade realista
const weeklyData = [
  { day: "Mon", completed: 2 },
  { day: "Tue", completed: 4 },
  { day: "Wed", completed: 1 },
  { day: "Thu", completed: 5 },
  { day: "Fri", completed: 3 },
  { day: "Sat", completed: 0 },
  { day: "Sun", completed: 2 },
];

const maxValue = Math.max(...weeklyData.map((d) => d.completed));

export function WeeklyChart() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-5">
      <p className="text-sm font-semibold text-text-primary mb-4">Weekly Progress</p>
      <div className="flex items-end gap-2 h-20">
        {weeklyData.map((d) => {
          const heightPct = maxValue > 0 ? (d.completed / maxValue) * 100 : 0;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: "64px" }}>
                <div
                  className="w-full rounded-t bg-accent transition-all"
                  style={{ height: `${heightPct}%`, minHeight: d.completed > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-[10px] text-text-muted">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
