import { useState, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import type { SalesEntry, VariableExpenseEntry, FixedExpenseMap } from "./salesData";
import {
  HOUR_SLOTS,
  toWon,
  monthKey,
  today,
  buildMonthForecast,
  salesForDate,
  variableForDate,
} from "./salesData";

interface Props {
  salesEntries: SalesEntry[];
  variableEntries: VariableExpenseEntry[];
  fixedMap: FixedExpenseMap;
}

export default function SalesCheck({
  salesEntries,
  variableEntries,
  fixedMap,
}: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const monthData = useMemo(
    () => buildMonthForecast(year, monthIndex),
    [year, monthIndex],
  );
  const [selectedDate, setSelectedDate] = useState(
    monthData[0]?.date ?? today(),
  );

  const selectedFallback =
    monthData.find((d) => d.date === selectedDate)?.expectedSales ??
    monthData[0]?.expectedSales ??
    0;
  const selectedSales = useMemo(
    () => salesForDate(selectedDate, salesEntries, selectedFallback),
    [selectedDate, salesEntries, selectedFallback],
  );
  const selectedVariableExpense = useMemo(
    () => variableForDate(selectedDate, variableEntries),
    [selectedDate, variableEntries],
  );
  const selectedFixedExpense = fixedMap[monthKey(selectedDate)]?.total ?? 0;
  const selectedTotalExpense = selectedVariableExpense + selectedFixedExpense;
  const monthTotalSales = useMemo(
    () =>
      monthData.reduce(
        (acc, day) =>
          acc + salesForDate(day.date, salesEntries, day.expectedSales),
        0,
      ),
    [monthData, salesEntries],
  );
  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const hourlySales = useMemo(() => {
    const hourlyEntry = salesEntries.find(
      (entry) => entry.date === selectedDate && entry.cycle === "hourly",
    );
    if (
      hourlyEntry?.hourlyAmounts &&
      hourlyEntry.hourlyAmounts.length === HOUR_SLOTS.length
    ) {
      return HOUR_SLOTS.map((time, index) => ({
        time,
        amount: hourlyEntry.hourlyAmounts?.[index] ?? 0,
      }));
    }
    const ratios = [
      0.04, 0.05, 0.06, 0.11, 0.13, 0.12, 0.09, 0.08, 0.1, 0.09, 0.07, 0.06,
    ];
    return HOUR_SLOTS.map((time, index) => ({
      time,
      amount: Math.round(selectedSales * ratios[index]),
    }));
  }, [salesEntries, selectedDate, selectedSales]);

  const changeMonth = (delta: number) => {
    const base = new Date(year, monthIndex + delta, 1);
    setYear(base.getFullYear());
    setMonthIndex(base.getMonth());
    setSelectedDate(
      buildMonthForecast(base.getFullYear(), base.getMonth())[0].date,
    );
  };

  const changeYear = (delta: number) => {
    const nextYear = year + delta;
    setYear(nextYear);
    setSelectedDate(buildMonthForecast(nextYear, monthIndex)[0].date);
  };

  return (
    <>
      <S.Section>
        <S.SectionTitle>매출 확인</S.SectionTitle>
        <S.Value>
          {monthIndex + 1}월 매출 합계: {toWon(monthTotalSales)}원
        </S.Value>
      </S.Section>

      <S.Section>
        <S.CalendarHeader>
          <S.CalendarTitle>
            {year}년 {monthIndex + 1}월 매출 캘린더
          </S.CalendarTitle>
          <S.NavButtons>
            <S.NavButton type="button" onClick={() => changeYear(-1)}>
              이전 년
            </S.NavButton>
            <S.NavButton type="button" onClick={() => changeMonth(-1)}>
              이전 달
            </S.NavButton>
            <S.NavButton type="button" onClick={() => changeMonth(1)}>
              다음 달
            </S.NavButton>
            <S.NavButton type="button" onClick={() => changeYear(1)}>
              다음 년
            </S.NavButton>
          </S.NavButtons>
        </S.CalendarHeader>
        <S.WeekHeader>
          {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
            <S.WeekDay key={label}>{label}</S.WeekDay>
          ))}
        </S.WeekHeader>
        <S.CalendarGrid>
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {monthData.map((day) => {
            const sales = salesForDate(
              day.date,
              salesEntries,
              day.expectedSales,
            );
            const variable = variableForDate(day.date, variableEntries);
            const fixed = fixedMap[monthKey(day.date)]?.total ?? 0;
            const expense = variable + fixed;
            return (
              <S.DayCard
                key={day.date}
                type="button"
                $selected={selectedDate === day.date}
                onClick={() => setSelectedDate(day.date)}
              >
                <div>{Number(day.date.slice(-2))}</div>
                <S.DayText>매출: {toWon(sales)}원</S.DayText>
                <S.DayText>지출: {toWon(expense)}원</S.DayText>
                <S.DayText>순이익: {toWon(sales - expense)}원</S.DayText>
              </S.DayCard>
            );
          })}
        </S.CalendarGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>{`${Number(selectedDate.slice(5, 7))}월 ${Number(selectedDate.slice(8, 10))}일 상세 매출`}</S.SectionTitle>
        <S.DetailGrid>
          <S.Panel>
            <S.PanelTitle>상세 매출</S.PanelTitle>
            <S.Row>
              <S.Label>총 매출</S.Label>
              <S.Value>{toWon(selectedSales)}원</S.Value>
            </S.Row>
            <S.Row>
              <S.Label>변동비</S.Label>
              <S.Value>{toWon(selectedVariableExpense)}원</S.Value>
            </S.Row>
            <S.Row>
              <S.Label>고정비</S.Label>
              <S.Value>{toWon(selectedFixedExpense)}원</S.Value>
            </S.Row>
            <S.Row>
              <S.Label>총 지출</S.Label>
              <S.Value>{toWon(selectedTotalExpense)}원</S.Value>
            </S.Row>
            <S.Row>
              <S.Label>순이익</S.Label>
              <S.Value>{toWon(selectedSales - selectedTotalExpense)}원</S.Value>
            </S.Row>
          </S.Panel>
          <S.Panel>
            <S.PanelTitle>시간대 매출</S.PanelTitle>
            {hourlySales.map((hour) => (
              <S.Row key={hour.time}>
                <S.Label>{hour.time}</S.Label>
                <S.Value>{toWon(hour.amount)}원</S.Value>
              </S.Row>
            ))}
          </S.Panel>
        </S.DetailGrid>
      </S.Section>
    </>
  );
}
