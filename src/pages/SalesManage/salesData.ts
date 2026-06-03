export type SalesCycle = "daily" | "weekly" | "monthly" | "hourly";
export type ExpenseCycle = "daily" | "weekly" | "monthly";

export const EMPLOYEE_AUTO_KEY = "employee_auto_salary_total";
export const HOUR_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export const toWon = (v: number) => v.toLocaleString("ko-KR");
export const toNumber = (v: string) => {
  const n = Number(v.replace(/,/g, "").trim() || "0");
  return Number.isFinite(n) ? n : 0;
};
export const monthKey = (d: string) => d.slice(0, 7);

export const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const today = () => formatDateLocal(new Date());

/** BACK3 WEEKLY: 월요일 시작 (previousOrSame MONDAY) */
export const WEEKDAY_LABELS_MON_FIRST = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
] as const;

export const getWeekStart = (dateText: string) => {
  const date = new Date(`${dateText}T12:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  return formatDateLocal(start);
};

export const sameWeek = (targetDate: string, anchorDate: string) =>
  getWeekStart(targetDate) === getWeekStart(anchorDate);

/** 월요일 첫 열 캘린더 — 1일 앞 빈 칸 개수 */
export const getMondayFirstPadCount = (year: number, monthIndex: number) => {
  const jsDay = new Date(year, monthIndex, 1).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
};

export const getWeekEnd = (dateText: string) => {
  const start = new Date(`${getWeekStart(dateText)}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return formatDateLocal(end);
};

export const formatWeekRange = (anchorDate: string) =>
  `${getWeekStart(anchorDate)} ~ ${getWeekEnd(anchorDate)}`;

export const buildCalendarDays = (year: number, monthIndex: number) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });
};

export const monthAnchorDate = (yearMonth: string) => `${yearMonth}-01`;

export const monthsInDateRange = (start: string, end: string) => {
  const set = new Set<string>();
  const cur = new Date(`${start}T12:00:00`);
  const endD = new Date(`${end}T12:00:00`);
  while (cur <= endD) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    set.add(`${y}-${m}`);
    cur.setDate(cur.getDate() + 1);
  }
  return [...set];
};

export const yearMonthsForBaseDate = (
  cycleType: "DAILY" | "WEEKLY" | "MONTHLY" | "HOURLY",
  baseDate: string,
) => {
  if (cycleType === "WEEKLY") {
    return monthsInDateRange(getWeekStart(baseDate), getWeekEnd(baseDate));
  }
  return [monthKey(baseDate)];
};

export type CalendarWeekRow = {
  weekKey: string;
  weekStart: string;
  days: ({
    date: string;
    dailySales: number;
    dailyExpense: number;
    dailyProfit: number;
  } | null)[];
};

/** 해당 주 행에 실제로 그려진 이번 달 날짜만 (주간 라벨·요약용) */
export function getWeekDatesInMonth(
  days: CalendarWeekRow["days"],
  yearMonth: string,
): string[] {
  return days
    .filter(
      (d): d is NonNullable<CalendarWeekRow["days"][number]> =>
        d !== null && d.date.startsWith(yearMonth),
    )
    .map((d) => d.date);
}

export function formatWeekRangeInMonth(
  days: CalendarWeekRow["days"],
  yearMonth: string,
): string {
  const dates = getWeekDatesInMonth(days, yearMonth);
  if (dates.length === 0) return "";
  const fmt = (d: string) => d.replace(/-/g, "/");
  if (dates.length === 1) return fmt(dates[0]);
  return `${fmt(dates[0])}~${fmt(dates[dates.length - 1])}`;
}

export function groupCalendarIntoWeeks(
  year: number,
  monthIndex: number,
  days: {
    date: string;
    dailySales: number;
    dailyExpense: number;
    dailyProfit: number;
  }[],
): CalendarWeekRow[] {
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const monthDays = buildCalendarDays(year, monthIndex);
  const padCount = getMondayFirstPadCount(year, monthIndex);
  const cells: ({
    date: string;
    dailySales: number;
    dailyExpense: number;
    dailyProfit: number;
  } | null)[] = [
    ...Array.from({ length: padCount }, () => null),
    ...monthDays.map(
      (date) =>
        dayMap.get(date) ?? {
          date,
          dailySales: 0,
          dailyExpense: 0,
          dailyProfit: 0,
        },
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: CalendarWeekRow[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const weekDays = cells.slice(i, i + 7);
    const firstInWeek = weekDays.find((d) => d !== null);
    const weekStart = firstInWeek ? getWeekStart(firstInWeek.date) : `pad-${i}`;
    rows.push({ weekKey: weekStart, weekStart, days: weekDays });
  }
  return rows;
}
