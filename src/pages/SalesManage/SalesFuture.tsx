import { useMemo, useState } from "react";
// 추후 예상 매출 - 백엔드 API 미제공으로 메뉴 비활성화 (SalesManage.tsx 참고)
import * as S from "../../style/SalesManage.Style";
import { toWon } from "./salesData";
import { toYearMonth, useForecast } from "../../api/sales_api";

export default function SalesFuture() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);

  const { data: forecastDays = [], isLoading, isError, error } = useForecast(yearMonth);
  const [selectedDate, setSelectedDate] = useState(`${yearMonth}-01`);

  const selectedDateInView = useMemo(() => {
    if (forecastDays.some((day) => day.date === selectedDate)) {
      return selectedDate;
    }
    return forecastDays[0]?.date ?? `${yearMonth}-01`;
  }, [forecastDays, selectedDate, yearMonth]);

  const selectedDay = forecastDays.find((day) => day.date === selectedDateInView);
  const monthTotal = useMemo(
    () => forecastDays.reduce((acc, day) => acc + day.expectedSales, 0),
    [forecastDays],
  );
  const futureTotal = useMemo(
    () =>
      forecastDays
        .filter((day) => !day.past)
        .reduce((acc, day) => acc + day.expectedSales, 0),
    [forecastDays],
  );

  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const changeMonth = (delta: number) => {
    const base = new Date(year, monthIndex + delta, 1);
    setYear(base.getFullYear());
    setMonthIndex(base.getMonth());
    setSelectedDate(
      `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-01`,
    );
  };

  const changeYear = (delta: number) => {
    const nextYear = year + delta;
    setYear(nextYear);
    setSelectedDate(`${nextYear}-${String(monthIndex + 1).padStart(2, "0")}-01`);
  };

  return (
    <>
      <S.Section>
        <S.SectionTitle>추후 예상 매출</S.SectionTitle>
        <S.Value>{monthIndex + 1}월 예상 매출 합계: {toWon(monthTotal)}원</S.Value>
        <S.SubTitle>
          미래 일자 예상 합계 {toWon(futureTotal)}원 (과거 일자는 실적, 이후 일자는
          예측값)
        </S.SubTitle>
      </S.Section>

      <S.Section>
        <S.CalendarHeader>
          <S.CalendarTitle>
            {year}년 {monthIndex + 1}월 예상 매출 캘린더
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

        {isLoading && <S.Value>예상 매출 데이터를 불러오는 중...</S.Value>}
        {isError && (
          <S.Value>
            {error instanceof Error
              ? error.message
              : "예상 매출 데이터를 불러오지 못했습니다."}
          </S.Value>
        )}

        {!isLoading && !isError && (
          <>
            <S.WeekHeader>
              {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
                <S.WeekDay key={label}>{label}</S.WeekDay>
              ))}
            </S.WeekHeader>
            <S.CalendarGrid>
              {Array.from({ length: firstWeekday }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {forecastDays.map((day) => (
                <S.DayCard
                  key={day.date}
                  type="button"
                  $selected={selectedDateInView === day.date}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div>{Number(day.date.slice(-2))}</div>
                  <S.DayText>
                    {day.past ? "매출" : "예상매출"}: {toWon(day.expectedSales)}원
                  </S.DayText>
                  <S.DayText>지출: {toWon(day.expectedExpense)}원</S.DayText>
                  <S.DayText>순이익: {toWon(day.expectedProfit)}원</S.DayText>
                </S.DayCard>
              ))}
            </S.CalendarGrid>
          </>
        )}
      </S.Section>

      {selectedDay && (
        <S.Section>
          <S.SectionTitle>
            {`${Number(selectedDateInView.slice(5, 7))}월 ${Number(selectedDateInView.slice(8, 10))}일 상세 ${selectedDay.past ? "매출" : "예상매출"}`}
          </S.SectionTitle>
          <S.DetailGrid>
            <S.Panel>
              <S.PanelTitle>상세 내역</S.PanelTitle>
              <S.Row>
                <S.Label>{selectedDay.past ? "실적 매출" : "예상 매출"}</S.Label>
                <S.Value>{toWon(selectedDay.expectedSales)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>{selectedDay.past ? "실적 지출" : "예상 지출"}</S.Label>
                <S.Value>{toWon(selectedDay.expectedExpense)}원</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>{selectedDay.past ? "실적 순이익" : "예상 순이익"}</S.Label>
                <S.Value>{toWon(selectedDay.expectedProfit)}원</S.Value>
              </S.Row>
            </S.Panel>
          </S.DetailGrid>
        </S.Section>
      )}
    </>
  );
}
