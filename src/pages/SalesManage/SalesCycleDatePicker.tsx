import { useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import type { SalesCycle, ExpenseCycle } from "./salesData";
import {
  buildCalendarDays,
  getWeekStart,
  formatWeekRange,
  sameWeek,
  getMondayFirstPadCount,
  WEEKDAY_LABELS_MON_FIRST,
} from "./salesData";
import { toYearMonth } from "../../api/sales_api";

export type CyclePickerProps = {
  cycle: SalesCycle | ExpenseCycle;
  anchorDate: string;
  selectedMonth: string;
  calendarYear: number;
  calendarMonthIndex: number;
  onAnchorDateChange: (date: string) => void;
  onSelectedMonthChange: (yearMonth: string) => void;
  onCalendarYearChange: (year: number) => void;
  onCalendarMonthIndexChange: (monthIndex: number) => void;
  hint: string;
};

export function CycleDatePicker({
  cycle,
  anchorDate,
  selectedMonth,
  calendarYear,
  calendarMonthIndex,
  onAnchorDateChange,
  onSelectedMonthChange,
  onCalendarYearChange,
  onCalendarMonthIndexChange,
  hint,
}: CyclePickerProps) {
  const monthDays = useMemo(
    () => buildCalendarDays(calendarYear, calendarMonthIndex),
    [calendarYear, calendarMonthIndex],
  );
  const mondayPadCount = getMondayFirstPadCount(calendarYear, calendarMonthIndex);
  const weekAnchor = getWeekStart(anchorDate);

  if (cycle === "daily" || cycle === "hourly") {
    return (
      <>
        <S.PickerHint>{hint}</S.PickerHint>
        <S.Row>
          <S.Label>날짜 선택</S.Label>
          <S.Input
            type="date"
            value={anchorDate}
            onChange={(e) => onAnchorDateChange(e.target.value)}
          />
        </S.Row>
      </>
    );
  }

  if (cycle === "weekly") {
    return (
      <>
        <S.PickerHint>{hint}</S.PickerHint>
        <S.Row>
          <S.Label>선택한 주</S.Label>
          <S.Value>{formatWeekRange(anchorDate)}</S.Value>
        </S.Row>
        <S.CalendarHeader>
          <S.CalendarTitle>
            {calendarYear}년 {calendarMonthIndex + 1}월
          </S.CalendarTitle>
          <S.NavButtons>
            <S.NavButton
              type="button"
              onClick={() => {
                const base = new Date(calendarYear, calendarMonthIndex - 1, 1);
                onCalendarYearChange(base.getFullYear());
                onCalendarMonthIndexChange(base.getMonth());
              }}
            >
              이전 달
            </S.NavButton>
            <S.NavButton
              type="button"
              onClick={() => {
                const base = new Date(calendarYear, calendarMonthIndex + 1, 1);
                onCalendarYearChange(base.getFullYear());
                onCalendarMonthIndexChange(base.getMonth());
              }}
            >
              다음 달
            </S.NavButton>
          </S.NavButtons>
        </S.CalendarHeader>
        <S.WeekHeader>
          {WEEKDAY_LABELS_MON_FIRST.map((label) => (
            <S.WeekDay key={label}>{label}</S.WeekDay>
          ))}
        </S.WeekHeader>
        <S.CalendarGrid>
          {Array.from({ length: mondayPadCount }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {monthDays.map((date) => (
            <S.CompactDayCard
              key={date}
              type="button"
              $selected={weekAnchor === getWeekStart(date)}
              $inRange={sameWeek(date, anchorDate)}
              onClick={() => onAnchorDateChange(getWeekStart(date))}
            >
              {Number(date.slice(-2))}
            </S.CompactDayCard>
          ))}
        </S.CalendarGrid>
      </>
    );
  }

  return (
    <>
      <S.PickerHint>{hint}</S.PickerHint>
      <S.Row>
        <S.Label>선택한 달</S.Label>
        <S.Value>
          {selectedMonth.slice(0, 4)}년 {Number(selectedMonth.slice(5, 7))}월
        </S.Value>
      </S.Row>
      <S.CalendarHeader>
        <S.CalendarTitle>{calendarYear}년</S.CalendarTitle>
        <S.NavButtons>
          <S.NavButton
            type="button"
            onClick={() => onCalendarYearChange(calendarYear - 1)}
          >
            이전 년
          </S.NavButton>
          <S.NavButton
            type="button"
            onClick={() => onCalendarYearChange(calendarYear + 1)}
          >
            다음 년
          </S.NavButton>
        </S.NavButtons>
      </S.CalendarHeader>
      <S.MonthGrid>
        {Array.from({ length: 12 }, (_, index) => {
          const yearMonth = toYearMonth(calendarYear, index);
          return (
            <S.MonthButton
              key={yearMonth}
              type="button"
              $selected={selectedMonth === yearMonth}
              onClick={() => onSelectedMonthChange(yearMonth)}
            >
              {index + 1}월
            </S.MonthButton>
          );
        })}
      </S.MonthGrid>
    </>
  );
}
