import { useState, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import { toWon } from "./salesData";
import { toYearMonth, useCalendar, useDaily } from "./salesApi";

export default function SalesCheck() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);
  const { data: days = [], isLoading, isError, error } = useCalendar(yearMonth);
  const [selectedDate, setSelectedDate] = useState(`${yearMonth}-01`);
  const selected = days.some((d) => d.date === selectedDate)
    ? selectedDate
    : days[0]?.date ?? `${yearMonth}-01`;
  const { data: detail, isLoading: loadingDetail } = useDaily(selected);
  const monthTotal = useMemo(() => days.reduce((a, d) => a + d.dailySales, 0), [days]);
  const firstWeekday = new Date(year, monthIndex, 1).getDay();

  const shift = (dy: number, dm: number) => {
    const b = new Date(year + dy, monthIndex + dm, 1);
    setYear(b.getFullYear());
    setMonthIndex(b.getMonth());
    setSelectedDate(`${toYearMonth(b.getFullYear(), b.getMonth())}-01`);
  };

  return (
    <>
      <S.Section>
        <S.SectionTitle>매출 확인</S.SectionTitle>
        <S.Value>{monthIndex + 1}월 매출 합계: {toWon(monthTotal)}원</S.Value>
      </S.Section>
      <S.Section>
        <S.CalendarHeader>
          <S.CalendarTitle>{year}년 {monthIndex + 1}월 매출 캘린더</S.CalendarTitle>
          <S.NavButtons>
            <S.NavButton type="button" onClick={() => shift(-1, 0)}>이전 년</S.NavButton>
            <S.NavButton type="button" onClick={() => shift(0, -1)}>이전 달</S.NavButton>
            <S.NavButton type="button" onClick={() => shift(0, 1)}>다음 달</S.NavButton>
            <S.NavButton type="button" onClick={() => shift(1, 0)}>다음 년</S.NavButton>
          </S.NavButtons>
        </S.CalendarHeader>
        {isLoading && <S.Value>불러오는 중...</S.Value>}
        {isError && <S.Value>{error instanceof Error ? error.message : "조회 실패"}</S.Value>}
        {!isLoading && !isError && (
          <>
            <S.WeekHeader>
              {["일", "월", "화", "수", "목", "금", "토"].map((l) => (
                <S.WeekDay key={l}>{l}</S.WeekDay>
              ))}
            </S.WeekHeader>
            <S.CalendarGrid>
              {Array.from({ length: firstWeekday }).map((_, i) => <div key={i} />)}
              {days.map((d) => (
                <S.DayCard key={d.date} type="button" $selected={selected === d.date} onClick={() => setSelectedDate(d.date)}>
                  <div>{Number(d.date.slice(-2))}</div>
                  <S.DayText>매출: {toWon(d.dailySales)}원</S.DayText>
                  <S.DayText>지출: {toWon(d.dailyExpense)}원</S.DayText>
                  <S.DayText>순이익: {toWon(d.dailyProfit)}원</S.DayText>
                </S.DayCard>
              ))}
            </S.CalendarGrid>
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
              <S.Row><S.Label>총 매출</S.Label><S.Value>{toWon(detail.totalSales)}원</S.Value></S.Row>
              <S.Row><S.Label>변동비</S.Label><S.Value>{toWon(detail.variableCost)}원</S.Value></S.Row>
              <S.Row><S.Label>고정비</S.Label><S.Value>{toWon(detail.fixedCost)}원</S.Value></S.Row>
              <S.Row><S.Label>총 지출</S.Label><S.Value>{toWon(detail.totalExpense)}원</S.Value></S.Row>
              <S.Row><S.Label>순이익</S.Label><S.Value>{toWon(detail.netProfit)}원</S.Value></S.Row>
            </S.Panel>
            <S.Panel>
              <S.PanelTitle>시간대 매출</S.PanelTitle>
              {!detail.hourlySales.length && <S.Value>데이터 없음</S.Value>}
              {detail.hourlySales.map((h) => (
                <S.Row key={h.hour}><S.Label>{h.hour}</S.Label><S.Value>{toWon(h.amount)}원</S.Value></S.Row>
              ))}
            </S.Panel>
          </S.DetailGrid>
        )}
      </S.Section>
    </>
  );
}
