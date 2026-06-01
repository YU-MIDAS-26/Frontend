import { useState, useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import * as S from "../../style/SalesManage.Style";
import {
  toWon,
  groupCalendarIntoWeeks,
  buildCalendarDays,
  getWeekStart,
  monthAnchorDate,
} from "./salesData";
import {
  sumDayRows,
  sumWeeklyPeriodMaps,
  periodProfit,
  type PeriodTotals,
} from "./salesCalendarDisplay";
import {
  toYearMonth,
  useCalendar,
  useDaily,
  getSalesPeriod,
  getVariablePeriod,
  salesQueryKeys,
} from "../../api/sales_api";
import { A_SCOPE } from "./salesBackendScope";
import {
  MonthSummaryRow,
  MonthStatCard,
  MonthStatLabel,
  MonthStatValue,
  WeekRowWrap,
  WeekSidePanel,
  WeekToggleBtn,
  WeekSummaryBox,
} from "./salesManageUi";

type DayRow = {
  date: string;
  dailySales: number;
  dailyExpense: number;
  dailyProfit: number;
};

export default function SalesCheck() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);
  const {
    data: days = [],
    isLoading,
    isError,
    error,
    isFetching: fetchingCalendar,
  } = useCalendar(yearMonth);
  const [selectedDate, setSelectedDate] = useState(`${yearMonth}-01`);
  const [expandedWeekKey, setExpandedWeekKey] = useState<string | null>(null);

  const monthDays = useMemo(
    () => buildCalendarDays(year, monthIndex),
    [year, monthIndex],
  );

  const selected = monthDays.includes(selectedDate)
    ? selectedDate
    : monthDays[0] ?? `${yearMonth}-01`;

  const { data: detail, isLoading: loadingDetail, isFetching: fetchingDetail } =
    useDaily(selected);

  const weekBaseDates = useMemo(() => {
    const set = new Set(monthDays.map((date) => getWeekStart(date)));
    return [...set];
  }, [monthDays]);

  const monthBaseDate = useMemo(() => monthAnchorDate(yearMonth), [yearMonth]);

  const weeklySalesQueries = useQueries({
    queries: weekBaseDates.map((baseDate) => ({
      queryKey: salesQueryKeys.salesPeriod("WEEKLY", baseDate),
      queryFn: () => getSalesPeriod("WEEKLY", baseDate),
      enabled: A_SCOPE.calendarWeeklyMonthly,
      staleTime: 0,
    })),
  });

  const monthlySalesQuery = useQuery({
    queryKey: salesQueryKeys.salesPeriod("MONTHLY", monthBaseDate),
    queryFn: () => getSalesPeriod("MONTHLY", monthBaseDate),
    enabled: A_SCOPE.calendarWeeklyMonthly,
    staleTime: 0,
  });

  const weeklyVariableQueries = useQueries({
    queries: weekBaseDates.map((baseDate) => ({
      queryKey: salesQueryKeys.varPeriod("WEEKLY", baseDate),
      queryFn: () => getVariablePeriod("WEEKLY", baseDate),
      enabled: A_SCOPE.calendarWeeklyMonthly,
      staleTime: 0,
    })),
  });

  const monthlyVariableQuery = useQuery({
    queryKey: salesQueryKeys.varPeriod("MONTHLY", monthBaseDate),
    queryFn: () => getVariablePeriod("MONTHLY", monthBaseDate),
    enabled: A_SCOPE.calendarWeeklyMonthly,
    staleTime: 0,
  });

  /** 하루·시간별 — finance/calendar 일별 값만 (주·월 period는 일 칸에 넣지 않음) */
  const calendarDays = useMemo<DayRow[]>(() => {
    const baseMap = new Map(days.map((d) => [d.date, d]));
    return monthDays.map((date) => {
      const base =
        baseMap.get(date) ||
        ({ date, dailySales: 0, dailyExpense: 0, dailyProfit: 0 } as DayRow);
      return {
        date,
        dailySales: base.dailySales,
        dailyExpense: base.dailyExpense,
        dailyProfit: base.dailySales - base.dailyExpense,
      };
    });
  }, [days, monthDays]);

  const weeklyPeriodByWeekStart = useMemo(() => {
    const map = new Map<string, { sales: number; expense: number }>();
    if (!A_SCOPE.calendarWeeklyMonthly) return map;

    weekBaseDates.forEach((baseDate, index) => {
      const salesData = weeklySalesQueries[index]?.data;
      const varData = weeklyVariableQueries[index]?.data;
      const weekStart = getWeekStart(salesData?.baseDate || varData?.baseDate || baseDate);
      map.set(weekStart, {
        sales: salesData?.totalAmount ?? 0,
        expense: varData?.totalCost ?? 0,
      });
    });
    return map;
  }, [weekBaseDates, weeklySalesQueries, weeklyVariableQueries]);

  const monthlyPeriod = useMemo<PeriodTotals>(() => {
    if (!A_SCOPE.calendarWeeklyMonthly) {
      return periodProfit(0, 0);
    }
    const sales = monthlySalesQuery.data?.totalAmount ?? 0;
    const expense = monthlyVariableQuery.data?.totalCost ?? 0;
    return periodProfit(sales, expense);
  }, [
    monthlySalesQuery.data,
    monthlyVariableQuery.data,
  ]);

  const monthTotals = useMemo(() => {
    const daily = sumDayRows(calendarDays);
    const weekly = sumWeeklyPeriodMaps(weeklyPeriodByWeekStart);
    return periodProfit(
      daily.sales + weekly.sales + monthlyPeriod.sales,
      daily.expense + weekly.expense + monthlyPeriod.expense,
    );
  }, [calendarDays, weeklyPeriodByWeekStart, monthlyPeriod]);

  const dayMap = useMemo(
    () => new Map(calendarDays.map((d) => [d.date, d])),
    [calendarDays],
  );

  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const weekRows = useMemo(
    () => groupCalendarIntoWeeks(year, monthIndex, calendarDays),
    [year, monthIndex, calendarDays],
  );

  const getWeekPeriodTotals = (weekStart: string): PeriodTotals => {
    const row = weeklyPeriodByWeekStart.get(weekStart);
    if (!row) return periodProfit(0, 0);
    return periodProfit(row.sales, row.expense);
  };

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
        {(fetchingCalendar || fetchingDetail || overlayLoading) && (
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
                const weekPeriod = getWeekPeriodTotals(row.weekStart);
                const expanded = expandedWeekKey === row.weekKey;
                const weekIndex = weekRows.findIndex((w) => w.weekKey === row.weekKey);
                const weekLabel = weekOrdinalLabel[weekIndex] ?? `${weekIndex + 1}째주`;
                const weekDates = row.days
                  .filter((d): d is DayRow => d !== null)
                  .map((d) => d.date);
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
                        <div>{rangeLabel}의 매출: {toWon(weekPeriod.sales)}원</div>
                        <div>{rangeLabel}의 지출: {toWon(weekPeriod.expense)}원</div>
                        <div>{rangeLabel}의 순이익: {toWon(weekPeriod.profit)}원</div>
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
        {loadingDetail && <S.Value>불러오는 중...</S.Value>}
        {detail && (
          <S.DetailGrid>
            <S.Panel>
              <S.PanelTitle>상세 매출</S.PanelTitle>
              <S.Row>
                <S.Label>총 매출</S.Label>
                <S.Value>{toWon(detail.totalSales)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>변동비</S.Label>
                <S.Value>{toWon(detail.variableCost)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>고정비</S.Label>
                <S.Value>{toWon(detail.fixedCost)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>총 지출</S.Label>
                <S.Value>{toWon(detail.totalExpense)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>순이익</S.Label>
                <S.Value>{toWon(detail.netProfit)}원</S.Value>
              </S.Row>
            </S.Panel>
            <S.Panel>
              <S.PanelTitle>시간대 매출</S.PanelTitle>
              {!detail.hourlySales.length && <S.Value>데이터 없음</S.Value>}
              {detail.hourlySales.map((h) => (
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
