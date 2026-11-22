export function istDateString(date = new Date()): string {
  const ist = new Date(date.getTime() + 5.5 * 3600_000);
  return ist.toISOString().slice(0, 10);
}

export function addDaysIst(days: number): string {
  return istDateString(new Date(Date.now() + days * 864e5));
}

export function startOfTodayIst(): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) -
      5.5 * 3600_000,
  );
}

export function startOfWeekIst(): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  const day = ist.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(ist.getTime() + diff * 864e5);
  return new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()) -
      5.5 * 3600_000,
  );
}

export function formatDayHeading(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getUTCDay()]}, ${d} ${months[date.getUTCMonth()]}`;
}

/**
 * The label a day control shows. A day near today is named; any other day is a
 * date. The label never carries a verb, so it can sit beside a `Go to today`
 * button without the two reading as the same thing.
 */
export function relativeDayLabel(dateStr: string, today = istDateString()): string {
  if (dateStr === today) return "Today";
  if (dateStr === addDaysIst(-1)) return "Yesterday";
  if (dateStr === addDaysIst(1)) return "Tomorrow";
  return formatDayHeading(dateStr);
}

export function formatAge(date: Date): string {
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
