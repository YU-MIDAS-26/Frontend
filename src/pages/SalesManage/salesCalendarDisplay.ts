import type { CalendarWeekRow } from "./salesData";

/** 주·월 period API 합계 (일별 칸에 분배하지 않음) */
export type PeriodTotals = {
  sales: number;
  expense: number;
  profit: number;
};

export function periodProfit(sales: number, expense: number): PeriodTotals {
  return { sales, expense, profit: sales - expense };
}

export function sumDayRows(
  rows: { dailySales: number; dailyExpense: number }[],
): PeriodTotals {
  const sales = rows.reduce((acc, d) => acc + d.dailySales, 0);
  const expense = rows.reduce((acc, d) => acc + d.dailyExpense, 0);
  return periodProfit(sales, expense);
}

/** 매출 확인 주간 요약 — 해당 주 캘린더 칸(일별) 합계 */
export function sumWeekRowTotals(row: CalendarWeekRow, yearMonth: string): PeriodTotals {
  const inMonth = row.days.filter(
    (d): d is NonNullable<CalendarWeekRow["days"][number]> =>
      d !== null && d.date.startsWith(yearMonth),
  );
  const sales = inMonth.reduce((acc, d) => acc + d.dailySales, 0);
  const expense = inMonth.reduce((acc, d) => acc + d.dailyExpense, 0);
  return periodProfit(sales, expense);
}

/** 칸에 숫자가 없을 때만 period API(한주 저장분) 사용 */
export function resolveWeekDisplayTotals(
  row: CalendarWeekRow,
  yearMonth: string,
  periodFallback?: { sales: number; expense: number },
): PeriodTotals {
  const fromRow = sumWeekRowTotals(row, yearMonth);
  if (fromRow.sales > 0 || fromRow.expense > 0) return fromRow;
  if (periodFallback) {
    return periodProfit(periodFallback.sales, periodFallback.expense);
  }
  return fromRow;
}

export function sumWeeklyPeriodMaps(
  weeks: Map<string, { sales: number; expense: number }>,
): PeriodTotals {
  let sales = 0;
  let expense = 0;
  weeks.forEach((w) => {
    sales += w.sales;
    expense += w.expense;
  });
  return periodProfit(sales, expense);
}
