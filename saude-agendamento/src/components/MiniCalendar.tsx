interface MiniCalendarProps {
  today: string; // "2026-03-17"
}

export function MiniCalendar({ today }: MiniCalendarProps) {
  const date = new Date(today + "T00:00:00");
  const year = date.getFullYear();
  const month = date.getMonth();
  const todayDay = date.getDate();

  const monthName = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="bg-dark-card rounded-[14px] p-4 border border-dark-border">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-white capitalize">{monthName}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d, i) => (
          <div key={i} className="text-[9px] text-neutral-500 py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = day === todayDay;
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              className={`text-[10px] py-1 rounded-md ${
                isToday
                  ? "bg-primary text-dark-card font-bold"
                  : isWeekend
                  ? "text-neutral-600"
                  : "text-white"
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
