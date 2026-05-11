export type SalesCycle = "daily" | "weekly" | "monthly" | "hourly";
export type ExpenseCycle = "daily" | "weekly" | "monthly";

export type SalesEntry = { date: string; cycle: SalesCycle; amount: number; hourlyAmounts?: number[] };
export type VariableExpenseEntry = { date: string; cycle: ExpenseCycle; staffSalary: number; ingredientCost: number; total: number };
export type FixedExpenseMap = Record<string, { rent: number; utilities: number; total: number }>;
export type DayForecast = { date: string; expectedSales: number };

export const SALES_KEY = "sales_entries_v2";
export const VAR_KEY = "sales_variable_expense_entries_v2";
export const FIX_KEY = "sales_fixed_expense_monthly_v2";
export const EMPLOYEE_AUTO_KEY = "employee_auto_salary_total";
export const HOUR_SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export const toWon = (v: number) => v.toLocaleString("ko-KR");
export const toNumber = (v: string) => { const n = Number(v.replace(/,/g, "").trim() || "0"); return Number.isFinite(n) ? n : 0; };
export const parse = <T,>(v: string | null, fallback: T): T => { try { return v ? JSON.parse(v) as T : fallback; } catch { return fallback; } };
export const monthKey = (d: string) => d.slice(0, 7);
export const today = () => new Date().toISOString().slice(0, 10);

export const sameWeek = (targetDate: string, anchorDate: string) => {
  const t = new Date(`${targetDate}T00:00:00`);
  const a = new Date(`${anchorDate}T00:00:00`);
  const s = new Date(a); s.setDate(a.getDate() - a.getDay());
  const e = new Date(s); e.setDate(s.getDate() + 6);
  return t >= s && t <= e;
};

export function buildMonthForecast(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const out: DayForecast[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const base = 2900000 + ((new Date(year, monthIndex, day).getDay() + 1) * 170000) + ((day % 6) * 120000);
    out.push({ date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, expectedSales: base });
  }
  return out;
}

export function salesForDate(dateText: string, entries: SalesEntry[], fallback: number) {
  const matched = entries.filter((entry) => {
    if (entry.cycle === "daily" || entry.cycle === "hourly") return entry.date === dateText;
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

export function variableForDate(dateText: string, entries: VariableExpenseEntry[]) {
  return entries
    .filter((entry) => entry.cycle === "daily" ? entry.date === dateText : entry.cycle === "weekly" ? sameWeek(dateText, entry.date) : monthKey(dateText) === monthKey(entry.date))
    .reduce((acc, entry) => acc + entry.total, 0);
}
