export function getWeekRange(date: Date): [Date, Date] {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // shift to Monday
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return [monday, sunday]
}

export function getMonthRange(date: Date): [Date, Date] {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return [start, end]
}
