import { useState, useMemo } from "react";

import { useQueries, useQuery } from "@tanstack/react-query";

import * as S from "../../style/SalesManage.Style";

import {

  toWon,

  groupCalendarIntoWeeks,

  buildCalendarDays,

  getWeekStart,

  monthAnchorDate,

  getMondayFirstPadCount,

  WEEKDAY_LABELS_MON_FIRST,

} from "./salesData";

import {

  sumDayRows,

  sumWeeklyPeriodMaps,

  resolveWeekDisplayTotals,

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
import { getStoredFixedCost } from "./salesFixedStorage";

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



  const monthFinanceReady = !isLoading && !isError;

  const storedFixed = useMemo(() => getStoredFixedCost(yearMonth), [yearMonth]);

  /** 캘린더 API 지출에서 변동비만 빼기 위한 하루 몫(월 합계는 monthFixedTotal 그대로) */
  const dailyFixedShare = useMemo(() => {
    const total = storedFixed?.totalCost ?? 0;
    return monthDays.length > 0 ? total / monthDays.length : 0;
  }, [storedFixed, monthDays.length]);

  const monthFixedTotal = storedFixed?.totalCost ?? 0;

  const { data: detail, isLoading: loadingDetail, isFetching: fetchingDetail } =

    useDaily(selected, monthFinanceReady);



  const weekBaseDates = useMemo(() => {

    const set = new Set(monthDays.map((date) => getWeekStart(date)));

    return [...set].sort();

  }, [monthDays]);



  const monthBaseDate = useMemo(() => monthAnchorDate(yearMonth), [yearMonth]);



  const weeklySalesQueries = useQueries({

    queries: weekBaseDates.map((baseDate) => ({

      queryKey: salesQueryKeys.salesPeriod("WEEKLY", baseDate),

      queryFn: () => getSalesPeriod("WEEKLY", baseDate),

      enabled:

        A_SCOPE.calendarWeeklyMonthly &&

        A_SCOPE.salesPeriodApi &&

        monthFinanceReady,

      staleTime: 0,

      retry: false,

    })),

  });



  const monthlySalesQuery = useQuery({

    queryKey: salesQueryKeys.salesPeriod("MONTHLY", monthBaseDate),

    queryFn: () => getSalesPeriod("MONTHLY", monthBaseDate),

    enabled:

      A_SCOPE.calendarWeeklyMonthly && A_SCOPE.salesPeriodApi && monthFinanceReady,

    staleTime: 0,

    retry: false,

  });



  const weeklyVariableQueries = useQueries({

    queries: weekBaseDates.map((baseDate) => ({

      queryKey: salesQueryKeys.varPeriod("WEEKLY", baseDate),

      queryFn: () => getVariablePeriod("WEEKLY", baseDate),

      enabled: A_SCOPE.calendarWeeklyMonthly && A_SCOPE.variablePeriodApi,

      staleTime: 0,

      retry: false,

    })),

  });



  const monthlyVariableQuery = useQuery({

    queryKey: salesQueryKeys.varPeriod("MONTHLY", monthBaseDate),

    queryFn: () => getVariablePeriod("MONTHLY", monthBaseDate),

    enabled: A_SCOPE.calendarWeeklyMonthly && A_SCOPE.variablePeriodApi,

    staleTime: 0,

    retry: false,

  });



  /** 하루·시간별 — finance/calendar 일별 값만 (주·월 period는 일 칸에 넣지 않음) */

  const calendarDays = useMemo<DayRow[]>(() => {

    const baseMap = new Map(days.map((d) => [d.date, d]));

    return monthDays.map((date) => {

      const base =

        baseMap.get(date) ||

        ({ date, dailySales: 0, dailyExpense: 0, dailyProfit: 0 } as DayRow);

      const variableExpense = Math.max(0, base.dailyExpense - dailyFixedShare);

      return {

        date,

        dailySales: base.dailySales,

        dailyExpense: variableExpense,

        dailyProfit: base.dailySales - variableExpense,

      };

    });

  }, [days, monthDays, dailyFixedShare]);



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

  }, [monthlySalesQuery.data, monthlyVariableQuery.data]);



  const monthTotals = useMemo(() => {

    const daily = sumDayRows(calendarDays);

    const weekly = sumWeeklyPeriodMaps(weeklyPeriodByWeekStart);

    return periodProfit(

      daily.sales + weekly.sales + monthlyPeriod.sales,

      daily.expense + monthFixedTotal + weekly.expense + monthlyPeriod.expense,

    );

  }, [calendarDays, weeklyPeriodByWeekStart, monthlyPeriod, monthFixedTotal]);



  const dayMap = useMemo(

    () => new Map(calendarDays.map((d) => [d.date, d])),

    [calendarDays],

  );



  const mondayPadCount = getMondayFirstPadCount(year, monthIndex);

  const weekRows = useMemo(

    () => groupCalendarIntoWeeks(year, monthIndex, calendarDays),

    [year, monthIndex, calendarDays],

  );

  const visibleWeekRows = useMemo(

    () =>

      weekRows.filter((row) =>

        row.days.some((d) => d !== null && d.date.startsWith(yearMonth)),

      ),

    [weekRows, yearMonth],

  );



  const getWeekDisplayTotals = (row: (typeof visibleWeekRows)[number]): PeriodTotals =>
    resolveWeekDisplayTotals(
      row,
      yearMonth,
      weeklyPeriodByWeekStart.get(row.weekStart),
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



  const selectedDayRow = dayMap.get(selected);

  /** 일별 상세 — 해당 일만 (총 지출=변동비, 고정비는 월 상단에만) */
  const displayDetail = useMemo(() => {
    if (detail) {
      const variableCost = detail.variableCost;
      const totalSales = detail.totalSales;
      const totalExpense = variableCost;
      return {
        totalSales,
        variableCost,
        totalExpense,
        netProfit: totalSales - totalExpense,
        hourlySales: detail.hourlySales,
      };
    }
    if (selectedDayRow) {
      const totalExpense = selectedDayRow.dailyExpense;
      return {
        totalSales: selectedDayRow.dailySales,
        variableCost: totalExpense,
        totalExpense,
        netProfit: selectedDayRow.dailyProfit,
        hourlySales: [] as { hour: string; amount: number }[],
      };
    }
    return null;
  }, [detail, selectedDayRow]);



  const renderDayCard = (d: DayRow) => (

    <S.DayCard

      key={d.date}

      type="button"

      $selected={selected === d.date}

      onClick={() => setSelectedDate(d.date)}

    >

      <div>{Number(d.date.slice(-2))}</div>

      <S.DayText>매출: {toWon(d.dailySales)}원</S.DayText>

      <S.DayText>변동비: {toWon(d.dailyExpense)}원</S.DayText>

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

                <MonthStatLabel>

                  {monthLabel}의 지출

                  {monthFixedTotal > 0 ? " (변동+고정)" : ""}

                </MonthStatLabel>

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

          <S.Value style={{ color: "#b45309", marginBottom: 8 }}>

            {year}년 {monthIndex + 1}월 캘린더 데이터를 불러오지 못했습니다.

            {error instanceof Error ? ` (${error.message})` : ""} 해당 월 DB

            데이터 오류일 수 있습니다. 백엔드 로그를 확인하세요.

          </S.Value>

        )}

        {!isLoading && (

          <>

            <S.WeekHeader style={{ marginLeft: 82 }}>

              {WEEKDAY_LABELS_MON_FIRST.map((l) => (

                <S.WeekDay key={l}>{l}</S.WeekDay>

              ))}

            </S.WeekHeader>



            {A_SCOPE.checkWeekSummaryUi &&

              visibleWeekRows.map((row, weekIndex) => {

                const weekPeriod = getWeekDisplayTotals(row);

                const expanded = expandedWeekKey === row.weekKey;

                const weekLabel = weekOrdinalLabel[weekIndex] ?? `${weekIndex + 1}째주`;

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

                        <div>{weekLabel}의 매출: {toWon(weekPeriod.sales)}원</div>

                        <div>{weekLabel}의 지출: {toWon(weekPeriod.expense)}원</div>

                        <div>{weekLabel}의 순이익: {toWon(weekPeriod.profit)}원</div>

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

                {Array.from({ length: mondayPadCount }).map((_, i) => (

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

        {displayDetail && (

          <S.DetailGrid>

            <S.Panel>

              <S.PanelTitle>상세 매출</S.PanelTitle>

              <S.Row>

                <S.Label>총 매출</S.Label>

                <S.Value>{toWon(displayDetail.totalSales)}원</S.Value>

              </S.Row>

              <S.Row>

                <S.Label>변동비</S.Label>

                <S.Value>{toWon(displayDetail.variableCost)}원</S.Value>

              </S.Row>

              <S.Row>

                <S.Label>총 지출</S.Label>

                <S.Value>{toWon(displayDetail.totalExpense)}원</S.Value>

              </S.Row>

              <S.Row>

                <S.Label>순이익</S.Label>

                <S.Value>{toWon(displayDetail.netProfit)}원</S.Value>

              </S.Row>

            </S.Panel>

            <S.Panel>

              <S.PanelTitle>시간대 매출</S.PanelTitle>

              {!displayDetail.hourlySales.length && <S.Value>데이터 없음</S.Value>}

              {displayDetail.hourlySales.map((h) => (

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


