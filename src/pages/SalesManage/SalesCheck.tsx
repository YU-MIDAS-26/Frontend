import { useState, useMemo, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import * as S from "../../style/SalesManage.Style";
import {
  toWon,
  groupCalendarIntoWeeks,
  sumWeekRow,
  buildCalendarDays,
  getWeekStart,
  monthAnchorDate,
  spreadSalesForDay,
  spreadVariableForDay,
  type SalesEntry,
  type VariableExpenseEntry,
} from "./salesData";
import {
  toYearMonth,
  useCalendar,
  useDaily,
  getSalesPeriod,
  getVariablePeriod,
  financeKeys,
} from "./salesApi";
import { A_SCOPE, SCOPE_MESSAGES } from "./salesBackendScope";
import {
  MonthSummaryRow,
  MonthStatCard,
  MonthStatLabel,
  MonthStatValue,
  ScopeNotice,
  WeekRowWrap,
  WeekSidePanel,
  WeekToggleBtn,
  WeekSummaryBox,
} from "./salesManageUi";

type Props = {
  isActive: boolean;
  refreshKey: number;
};

type DayRow = {
  date: string;
  dailySales: number;
  dailyExpense: number;
  dailyProfit: number;
};

export default function SalesCheck({ isActive, refreshKey }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);
  const {
    data: days = [],
    isLoading,
    isError,
    error,
    refetch: refetchCalendar,
    isFetching: fetchingCalendar,
  } = useCalendar(yearMonth, true);
  const [selectedDate, setSelectedDate] = useState(`${yearMonth}-01`);
  const [expandedWeekKey, setExpandedWeekKey] = useState<string | null>(null);

  const monthDays = useMemo(
    () => buildCalendarDays(year, monthIndex),
    [year, monthIndex],
  );

  const selected = monthDays.includes(selectedDate)
    ? selectedDate
    : monthDays[0] ?? `${yearMonth}-01`;

  const {
    data: detail,
    isLoading: loadingDetail,
    refetch: refetchDaily,
    isFetching: fetchingDetail,
  } = useDaily(selected, true);

  useEffect(() => {
    if (!isActive) return;
    void refetchCalendar();
    void refetchDaily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, refreshKey, yearMonth, selected]);

  const weekBaseDates = useMemo(() => {
    const set = new Set(monthDays.map((date) => getWeekStart(date)));
    return [...set];
  }, [monthDays]);

  const monthBaseDate = useMemo(() => monthAnchorDate(yearMonth), [yearMonth]);

  const weeklySalesQueries = useQueries({
    queries: weekBaseDates.map((baseDate) => ({
      queryKey: financeKeys.salesPeriod("WEEKLY", baseDate),
      queryFn: () => getSalesPeriod("WEEKLY", baseDate),
      enabled: A_SCOPE.calendarWeeklyMonthly,
      staleTime: 0,
    })),
  });

  const monthlySalesQuery = useQuery({
    queryKey: financeKeys.salesPeriod("MONTHLY", monthBaseDate),
    queryFn: () => getSalesPeriod("MONTHLY", monthBaseDate),
    enabled: A_SCOPE.calendarWeeklyMonthly,
    staleTime: 0,
  });

  const weeklyVariableQueries = useQueries({
    queries: weekBaseDates.map((baseDate) => ({
      queryKey: financeKeys.varPeriod("WEEKLY", baseDate),
      queryFn: () => getVariablePeriod("WEEKLY", baseDate),
      enabled: A_SCOPE.calendarWeeklyMonthly,
      staleTime: 0,
    })),
  });

  const monthlyVariableQuery = useQuery({
    queryKey: financeKeys.varPeriod("MONTHLY", monthBaseDate),
    queryFn: () => getVariablePeriod("MONTHLY", monthBaseDate),
    enabled: A_SCOPE.calendarWeeklyMonthly,
    staleTime: 0,
  });

  const salesOverlayEntries = useMemo<SalesEntry[]>(() => {
    if (!A_SCOPE.calendarWeeklyMonthly) return [];
    const weeklyEntries = weeklySalesQueries
      .map((query, index) => ({ query, baseDate: weekBaseDates[index] }))
      .filter(({ query }) => (query.data?.totalAmount ?? 0) > 0)
      .map(({ query, baseDate }) => ({
        cycle: "weekly" as const,
        date: query.data?.baseDate || baseDate,
        amount: query.data?.totalAmount ?? 0,
      }));

    const monthlyAmount = monthlySalesQuery.data?.totalAmount ?? 0;
    const monthlyEntries =
      monthlyAmount > 0
        ? [
            {
              cycle: "monthly" as const,
              date: monthlySalesQuery.data?.baseDate || monthBaseDate,
              amount: monthlyAmount,
            },
          ]
        : [];

    return [...weeklyEntries, ...monthlyEntries];
  }, [weeklySalesQueries, monthlySalesQuery.data, monthBaseDate, weekBaseDates]);

  const variableOverlayEntries = useMemo<VariableExpenseEntry[]>(() => {
    if (!A_SCOPE.calendarWeeklyMonthly) return [];
    const weeklyEntries = weeklyVariableQueries
      .map((query, index) => ({ query, baseDate: weekBaseDates[index] }))
      .filter(({ query }) => (query.data?.totalCost ?? 0) > 0)
      .map(({ query, baseDate }) => ({
        cycle: "weekly" as const,
        date: query.data?.baseDate || baseDate,
        staffSalary: query.data?.salaryCost ?? 0,
        ingredientCost: query.data?.ingredientCost ?? 0,
        total: query.data?.totalCost ?? 0,
      }));

    const monthlyTotal = monthlyVariableQuery.data?.totalCost ?? 0;
    const monthlyEntries =
      monthlyTotal > 0
        ? [
            {
              cycle: "monthly" as const,
              date: monthlyVariableQuery.data?.baseDate || monthBaseDate,
              staffSalary: monthlyVariableQuery.data?.salaryCost ?? 0,
              ingredientCost: monthlyVariableQuery.data?.ingredientCost ?? 0,
              total: monthlyTotal,
            },
          ]
        : [];

    return [...weeklyEntries, ...monthlyEntries];
  }, [weeklyVariableQueries, monthlyVariableQuery.data, monthBaseDate, weekBaseDates]);

  const mergedDays = useMemo<DayRow[]>(() => {
    const baseMap = new Map(days.map((d) => [d.date, d]));
    return monthDays.map((date) => {
      const base =
        baseMap.get(date) ||
        ({ date, dailySales: 0, dailyExpense: 0, dailyProfit: 0 } as DayRow);

      const overlaySales = A_SCOPE.calendarWeeklyMonthly
        ? spreadSalesForDay(date, salesOverlayEntries)
        : 0;
      const overlayExpense = A_SCOPE.calendarWeeklyMonthly
        ? spreadVariableForDay(date, variableOverlayEntries)
        : 0;

      const dailySales = base.dailySales + overlaySales;
      const dailyExpense = base.dailyExpense + overlayExpense;
      return {
        date,
        dailySales,
        dailyExpense,
        dailyProfit: dailySales - dailyExpense,
      };
    });
  }, [days, monthDays, salesOverlayEntries, variableOverlayEntries]);

  const dayMap = useMemo(
    () => new Map(mergedDays.map((d) => [d.date, d])),
    [mergedDays],
  );

  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const monthTotals = useMemo(
    () =>
      mergedDays.reduce(
        (acc, d) => ({
          sales: acc.sales + d.dailySales,
          expense: acc.expense + d.dailyExpense,
          profit: acc.profit + d.dailyProfit,
        }),
        { sales: 0, expense: 0, profit: 0 },
      ),
    [mergedDays],
  );

  const weekRows = useMemo(
    () => groupCalendarIntoWeeks(year, monthIndex, mergedDays),
    [year, monthIndex, mergedDays],
  );

  const shift = (dy: number, dm: number) => {
    const b = new Date(year + dy, monthIndex + dm, 1);
    setYear(b.getFullYear());
    setMonthIndex(b.getMonth());
    setSelectedDate(`${toYearMonth(b.getFullYear(), b.getMonth())}-01`);
    setExpandedWeekKey(null);
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeekKey((prev) => (prev === weekKey ? null : weekKey));
  };

  const monthLabel = `${monthIndex + 1}월`;
  const weekOrdinalLabel = ["첫째주", "둘째주", "셋째주", "넷째주", "다섯째주", "여섯째주"];

  const overlayLoading =
    monthlySalesQuery.isFetching ||
    monthlyVariableQuery.isFetching ||
    weeklySalesQueries.some((q) => q.isFetching) ||
    weeklyVariableQueries.some((q) => q.isFetching);

  const selectedSalesOverlay = A_SCOPE.calendarWeeklyMonthly
    ? spreadSalesForDay(selected, salesOverlayEntries)
    : 0;
  const selectedVariableOverlay = A_SCOPE.calendarWeeklyMonthly
    ? spreadVariableForDay(selected, variableOverlayEntries)
    : 0;

  const mergedDetail = useMemo(() => {
    if (!detail) return null;
    const totalSales = detail.totalSales + selectedSalesOverlay;
    const totalExpense = detail.totalExpense + selectedVariableOverlay;
    const variableCost = detail.variableCost + selectedVariableOverlay;
    return {
      ...detail,
      totalSales,
      totalExpense,
      variableCost,
      netProfit: totalSales - totalExpense,
    };
  }, [detail, selectedSalesOverlay, selectedVariableOverlay]);

  const renderDayCard = (d: DayRow) => (
    <S.DayCard
      key={d.date}
      type="button"
      $selected={selected === d.date}
      onClick={() => setSelectedDate(d.date)}
    >
      <div>{Number(d.date.slice(-2))}</div>
      <S.DayText>매출: {toWon(d.dailySales)}원</S.DayText>
      <S.DayText>지출: {toWon(d.dailyExpense)}원</S.DayText>
      <S.DayText>순이익: {toWon(d.dailyProfit)}원</S.DayText>
    </S.DayCard>
  );

  return (
    <>
      <S.Section>
        <S.SectionTitle>매출 확인</S.SectionTitle>
        <ScopeNotice>{SCOPE_MESSAGES.calendarLimit}</ScopeNotice>
        {(fetchingCalendar || fetchingDetail || overlayLoading) && isActive && (
          <S.Value style={{ fontSize: 13, color: "#555" }}>
            데이터 동기화 중...
          </S.Value>
        )}
      </S.Section>
      <S.Section>
        <S.CalendarHeader>
          <div style={{ flex: 1, minWidth: 260 }}>
            <S.CalendarTitle>
              {year}년 {monthIndex + 1}월 매출 캘린더
            </S.CalendarTitle>
            <MonthSummaryRow>
              <MonthStatCard $tone="sales">
                <MonthStatLabel>{monthLabel}의 매출</MonthStatLabel>
                <MonthStatValue>{toWon(monthTotals.sales)}원</MonthStatValue>
              </MonthStatCard>
              <MonthStatCard $tone="expense">
                <MonthStatLabel>{monthLabel}의 지출</MonthStatLabel>
                <MonthStatValue>{toWon(monthTotals.expense)}원</MonthStatValue>
              </MonthStatCard>
              <MonthStatCard $tone="profit">
                <MonthStatLabel>{monthLabel}의 순이익</MonthStatLabel>
                <MonthStatValue>{toWon(monthTotals.profit)}원</MonthStatValue>
              </MonthStatCard>
            </MonthSummaryRow>
          </div>
          <S.NavButtons>
            <S.NavButton type="button" onClick={() => shift(-1, 0)}>
              이전 년
            </S.NavButton>
            <S.NavButton type="button" onClick={() => shift(0, -1)}>
              이전 달
            </S.NavButton>
            <S.NavButton type="button" onClick={() => shift(0, 1)}>
              다음 달
            </S.NavButton>
            <S.NavButton type="button" onClick={() => shift(1, 0)}>
              다음 년
            </S.NavButton>
          </S.NavButtons>
        </S.CalendarHeader>
        {isLoading && <S.Value>불러오는 중...</S.Value>}
        {isError && (
          <S.Value>
            {error instanceof Error ? error.message : "조회 실패"}
          </S.Value>
        )}
        {!isLoading && !isError && (
          <>
            <S.WeekHeader style={{ marginLeft: 82 }}>
              {["일", "월", "화", "수", "목", "금", "토"].map((l) => (
                <S.WeekDay key={l}>{l}</S.WeekDay>
              ))}
            </S.WeekHeader>

            {A_SCOPE.checkWeekSummaryUi &&
              weekRows.map((row) => {
                const weekSum = sumWeekRow(row.days);
                const expanded = expandedWeekKey === row.weekKey;
                const weekIndex = weekRows.findIndex((w) => w.weekKey === row.weekKey);
                const weekLabel = weekOrdinalLabel[weekIndex] ?? `${weekIndex + 1}째주`;
                const weekDates = row.days.filter((d): d is DayRow => d !== null).map((d) => d.date);
                const rangeStart = weekDates[0] ?? "";
                const rangeEnd = weekDates[weekDates.length - 1] ?? "";
                const rangeLabel =
                  rangeStart && rangeEnd
                    ? `${rangeStart.replace(/-/g, "/")}~${rangeEnd.replace(/-/g, "/")}`
                    : "";
                return (
                  <WeekRowWrap key={row.weekKey}>
                    <WeekSidePanel>
                      <WeekToggleBtn
                        type="button"
                        $expanded={expanded}
                        onClick={() => toggleWeek(row.weekKey)}
                      >
                        {expanded ? "닫기" : weekLabel}
                      </WeekToggleBtn>
                    </WeekSidePanel>
                    {expanded ? (
                      <WeekSummaryBox>
                        <div>{rangeLabel}의 매출: {toWon(weekSum.sales)}원</div>
                        <div>{rangeLabel}의 지출: {toWon(weekSum.expense)}원</div>
                        <div>{rangeLabel}의 순이익: {toWon(weekSum.profit)}원</div>
                      </WeekSummaryBox>
                    ) : (
                      <S.CalendarGrid>
                        {row.days.map((d, idx) =>
                          d ? (
                            renderDayCard(d)
                          ) : (
                            <div key={`empty-${row.weekKey}-${idx}`} />
                          ),
                        )}
                      </S.CalendarGrid>
                    )}
                  </WeekRowWrap>
                );
              })}

            {!A_SCOPE.checkWeekSummaryUi && (
              <S.CalendarGrid>
                {Array.from({ length: firstWeekday }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {monthDays.map((date) => {
                  const d = dayMap.get(date) ?? {
                    date,
                    dailySales: 0,
                    dailyExpense: 0,
                    dailyProfit: 0,
                  };
                  return renderDayCard(d);
                })}
              </S.CalendarGrid>
            )}
          </>
        )}
      </S.Section>
      <S.Section>
        <S.SectionTitle>{`${Number(selected.slice(5, 7))}월 ${Number(selected.slice(8, 10))}일 상세`}</S.SectionTitle>
        <ScopeNotice>
          일별 상세는 finance/daily + period(한주/한달) 오버레이 합산으로 표시됩니다.
        </ScopeNotice>
        {loadingDetail && <S.Value>불러오는 중...</S.Value>}
        {mergedDetail && (
          <S.DetailGrid>
            <S.Panel>
              <S.PanelTitle>상세 매출</S.PanelTitle>
              <S.Row>
                <S.Label>총 매출</S.Label>
                <S.Value>{toWon(mergedDetail.totalSales)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>변동비</S.Label>
                <S.Value>{toWon(mergedDetail.variableCost)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>고정비</S.Label>
                <S.Value>{toWon(mergedDetail.fixedCost)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>총 지출</S.Label>
                <S.Value>{toWon(mergedDetail.totalExpense)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>순이익</S.Label>
                <S.Value>{toWon(mergedDetail.netProfit)}원</S.Value>
              </S.Row>
            </S.Panel>
            <S.Panel>
              <S.PanelTitle>시간대 매출</S.PanelTitle>
              {!mergedDetail.hourlySales.length && <S.Value>데이터 없음</S.Value>}
              {mergedDetail.hourlySales.map((h) => (
                <S.Row key={h.hour}>
                  <S.Label>{h.hour}</S.Label>
                  <S.Value>{toWon(h.amount)}원</S.Value>
                </S.Row>
              ))}
            </S.Panel>
          </S.DetailGrid>
        )}
      </S.Section>
    </>
  );
}
