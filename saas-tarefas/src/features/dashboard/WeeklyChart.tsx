const weeklyData = [
  { day: "Mon", value: 26, type: "low" },
  { day: "Tue", value: 44, type: "orange" },
  { day: "Wed", value: 62, type: "yellow" },
  { day: "Thu", value: 50, type: "orange" },
  { day: "Fri", value: 70, type: "yellow" },
  { day: "Sat", value: 18, type: "low" },
  { day: "Sun", value: 10, type: "low" },
];

const barColor: Record<string, string> = {
  yellow: "bg-accent",
  orange: "bg-accent-orange",
  low:    "bg-bg-card-2",
};

export function WeeklyChart() {
  return (
    <div className="bg-bg-card border border-border rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-[15px] font-bold text-text-primary">Weekly Activity</p>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-text-muted">Mar 10 – 16</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 h-[76px]">
        {weeklyData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-[5px] cursor-pointer hover:opacity-80 transition-opacity ${barColor[d.type]}`}
              style={{ height: `${d.value}px` }}
            />
            <span className="text-[12px] font-medium text-text-muted">{d.day}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-4 mt-3 pt-2.5 border-t border-border-soft">
        {[
          { color: "bg-accent",       label: "Completed", num: 12 },
          { color: "bg-accent-orange", label: "Started",   num: 8 },
          { color: "bg-bg-card-2",    label: "Created",   num: 5 },
        ].map(({ color, label, num }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-[3px] flex-shrink-0 ${color}`} />
            <span className="text-[13px] text-text-muted">{label}</span>
            <span className="font-display text-[14px] font-bold text-text-primary">{num}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
