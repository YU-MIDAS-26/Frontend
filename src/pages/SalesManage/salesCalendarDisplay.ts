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
