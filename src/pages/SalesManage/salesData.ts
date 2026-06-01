export type SalesCycle = "daily" | "weekly" | "monthly" | "hourly";
export type ExpenseCycle = "daily" | "weekly" | "monthly";

export type SalesEntry = {
  date: string;
  cycle: SalesCycle;
  amount: number;
  hourlyAmounts?: number[];
};
export type VariableExpenseEntry = {
  date: string;
  cycle: ExpenseCycle;
  staffSalary: number;
  ingredientCost: number;
  total: number;
};
export type FixedExpenseMap = Record<
  string,
  { rent: number; utilities: number; total: number }
>;
export type DayForecast = { date: string; expectedSales: number };

export const SALES_KEY = "sales_entries_v2";
export const VAR_KEY = "sales_variable_expense_entries_v2";
export const FIX_KEY = "sales_fixed_expense_monthly_v2";
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
export const parse = <T>(v: string | null, fallback: T): T => {
  try {
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
export const monthKey = (d: string) => d.slice(0, 7);
export const today = () => new Date().toISOString().slice(0, 10);

export const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const sameWeek = (targetDate: string, anchorDate: string) => {
  const t = new Date(`${targetDate}T00:00:00`);
  const a = new Date(`${anchorDate}T00:00:00`);
  const s = new Date(a);
  s.setDate(a.getDate() - a.getDay());
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return t >= s && t <= e;
};

export const getWeekStart = (dateText: string) => {
  const date = new Date(`${dateText}T00:00:00`);
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return formatDateLocal(start);
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

export const daysInMonth = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month, 0).getDate();
};

export const entryKey = (cycle: string, date: string) => `${cycle}:${date}`;

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
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const cells: ({
    date: string;
    dailySales: number;
    dailyExpense: number;
    dailyProfit: number;
  } | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
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

export function sumWeekRow(days: CalendarWeekRow["days"]): {
  sales: number;
  expense: number;
  profit: number;
} {
  return days.reduce(
    (acc, d) =>
      d
        ? {
            sales: acc.sales + d.dailySales,
            expense: acc.expense + d.dailyExpense,
            profit: acc.profit + d.dailyProfit,
          }
        : acc,
    { sales: 0, expense: 0, profit: 0 },
  );
}

export function spreadSalesForDay(dateText: string, entries: SalesEntry[]) {
  return entries.reduce(
    (acc, entry) => acc + spreadSingleSalesEntry(dateText, entry),
    0,
  );
}

function spreadSingleSalesEntry(dateText: string, entry: SalesEntry) {
  if (entry.cycle === "daily" || entry.cycle === "hourly") {
    if (entry.date !== dateText) return 0;
    if (entry.cycle === "hourly") {
      const hourSum = (entry.hourlyAmounts ?? []).reduce(
        (sum, value) => sum + value,
        0,
      );
      return hourSum || entry.amount;
    }
    return entry.amount;
  }
  if (entry.cycle === "weekly") {
    if (!sameWeek(dateText, entry.date)) return 0;
    return Math.round(entry.amount / 7);
  }
  if (monthKey(dateText) !== monthKey(entry.date)) return 0;
  return Math.round(entry.amount / daysInMonth(monthKey(entry.date)));
}

export function spreadVariableForDay(
  dateText: string,
  entries: VariableExpenseEntry[],
) {
  return entries.reduce((acc, entry) => {
    if (entry.cycle === "daily") {
      return entry.date === dateText ? acc + entry.total : acc;
    }
    if (entry.cycle === "weekly") {
      if (!sameWeek(dateText, entry.date)) return acc;
      return acc + Math.round(entry.total / 7);
    }
    if (monthKey(dateText) !== monthKey(entry.date)) return acc;
    return acc + Math.round(entry.total / daysInMonth(monthKey(entry.date)));
  }, 0);
}

export function spreadFixedForDay(dateText: string, fixedMap: FixedExpenseMap) {
  const fixed = fixedMap[monthKey(dateText)];
  if (!fixed) return 0;
  return Math.round(fixed.total / daysInMonth(monthKey(dateText)));
}

export function findSalesEntry(
  entries: SalesEntry[],
  date: string,
  cycle: SalesCycle,
) {
  return entries.find((entry) => entry.date === date && entry.cycle === cycle);
}

export function findVariableEntry(
  entries: VariableExpenseEntry[],
  date: string,
  cycle: ExpenseCycle,
) {
  return entries.find((entry) => entry.date === date && entry.cycle === cycle);
}

export function buildMonthForecast(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const out: DayForecast[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const base =
      2900000 +
      (new Date(year, monthIndex, day).getDay() + 1) * 170000 +
      (day % 6) * 120000;
    out.push({
      date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      expectedSales: base,
    });
  }
  return out;
}

export function salesForDate(
  dateText: string,
  entries: SalesEntry[],
  fallback: number,
) {
  const matched = entries.filter((entry) => {
    if (entry.cycle === "daily" || entry.cycle === "hourly")
      return entry.date === dateText;
    if (entry.cycle === "weekly") return sameWeek(dateText, entry.date);
    return monthKey(dateText) === monthKey(entry.date);
  });
  if (!matched.length) return fallback;
  return matched.reduce((acc, entry) => {
    if (entry.cycle === "hourly") {
      const hourSum = (entry.hourlyAmounts ?? []).reduce((s, v) => s + v, 0);
      return acc + (hourSum || entry.amount);
    }
    return acc + entry.amount;
  }, 0);
}

export function variableForDate(
  dateText: string,
  entries: VariableExpenseEntry[],
) {
  return entries
    .filter((entry) =>
      entry.cycle === "daily"
        ? entry.date === dateText
        : entry.cycle === "weekly"
          ? sameWeek(dateText, entry.date)
          : monthKey(dateText) === monthKey(entry.date),
    )
    .reduce((acc, entry) => acc + entry.total, 0);
}
