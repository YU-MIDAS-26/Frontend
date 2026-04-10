import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type DayForecast = {
  date: string;
  expectedSales: number;
};

const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: #dfe1e5;
  padding: 24px;
`;

const Section = styled.section`
  background: #ffffff;
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #131313;
  font-size: 20px;
  font-weight: 700;
`;

const MonthSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SummaryText = styled.p`
  margin: 0;
  color: #121212;
  font-size: 18px;
  font-weight: 600;
`;

const ActionButton = styled.button`
  border: 1px solid #7ea0b7;
  background: #7ea0b7;
  color: #101010;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const CalendarTitle = styled.h3`
  margin: 0;
  color: #202020;
  font-size: 18px;
  font-weight: 700;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  border: 1px solid #c2ccd5;
  background: #f0f4f7;
  color: #111111;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
`;

const WeekDay = styled.div`
  text-align: center;
  color: #333333;
  font-size: 13px;
  font-weight: 700;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

const DayCard = styled.button<{ $selected: boolean }>`
  min-height: 92px;
  border: 1px solid ${(props) => (props.$selected ? "#5d839f" : "#d0d4d9")};
  background: ${(props) => (props.$selected ? "#dcebf5" : "#f8f9fb")};
  border-radius: 8px;
  padding: 8px;
  text-align: left;
  cursor: pointer;
`;

const DayNumber = styled.div`
  color: #111111;
  font-size: 14px;
  font-weight: 700;
`;

const DaySales = styled.div`
  margin-top: 8px;
  color: #202020;
  font-size: 12px;
  line-height: 1.4;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 12px;
  background: #fafbfd;
`;

const PanelTitle = styled.h3`
  margin: 0 0 8px;
  color: #111111;
  font-size: 16px;
  font-weight: 700;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid #e4e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const RowLabel = styled.span`
  color: #222;
  font-size: 14px;
`;

const RowValue = styled.span`
  color: #111;
  font-size: 14px;
  font-weight: 700;
`;

function toWon(value: number) {
  return value.toLocaleString("ko-KR");
}

function isPastDate(dateText: string) {
  const target = new Date(`${dateText}T00:00:00`);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return target < todayStart;
}

function buildMonthForecast(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const data: DayForecast[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const base = 2_900_000;
    const weekdayFactor =
      (new Date(year, monthIndex, day).getDay() + 1) * 170_000;
    const dayFactor = (day % 6) * 120_000;
    data.push({
      date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      expectedSales: base + weekdayFactor + dayFactor,
    });
  }

  return data;
}

const hourSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function SalesForecastPage() {
  const navigate = useNavigate();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonthIndex, setViewMonthIndex] = useState(3);
  const monthData = useMemo(
    () => buildMonthForecast(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex],
  );
  const [selectedDate, setSelectedDate] = useState(
    monthData[4]?.date ?? monthData[0].date,
  );

  const monthTotal = useMemo(
    () => monthData.reduce((acc, day) => acc + day.expectedSales, 0),
    [monthData],
  );

  const selected =
    monthData.find((day) => day.date === selectedDate) ?? monthData[0];
  const firstWeekday = new Date(viewYear, viewMonthIndex, 1).getDay();
  const selectedIsPast = isPastDate(selected.date);

  const changeMonth = (delta: number) => {
    const base = new Date(viewYear, viewMonthIndex + delta, 1);
    const nextYear = base.getFullYear();
    const nextMonth = base.getMonth();
    setViewYear(nextYear);
    setViewMonthIndex(nextMonth);
    const nextMonthData = buildMonthForecast(nextYear, nextMonth);
    setSelectedDate(nextMonthData[0].date);
  };

  const changeYear = (delta: number) => {
    const nextYear = viewYear + delta;
    setViewYear(nextYear);
    const nextMonthData = buildMonthForecast(nextYear, viewMonthIndex);
    setSelectedDate(nextMonthData[0].date);
  };

  const hourlyForecast = useMemo(() => {
    return hourSlots.map((time, index) => {
      const ratio = [
        0.04, 0.05, 0.06, 0.11, 0.13, 0.12, 0.09, 0.08, 0.1, 0.09, 0.07, 0.06,
      ][index];
      return {
        time,
        amount: Math.round(selected.expectedSales * ratio),
      };
    });
  }, [selected.expectedSales]);

  return (
    <Page>
      <Section>
        <SectionTitle>매출 확인</SectionTitle>
        <MonthSummary>
          <SummaryText>
            {viewMonthIndex + 1}월달 예상매출: {toWon(monthTotal)}원
          </SummaryText>
          <ActionButton type="button" onClick={() => navigate("/report")}>
            보고서 확인
          </ActionButton>
        </MonthSummary>
      </Section>

      <Section>
        <CalendarHeader>
          <CalendarTitle>
            {viewYear}년 {viewMonthIndex + 1}월 매출 캘린더
          </CalendarTitle>
          <NavButtons>
            <NavButton type="button" onClick={() => changeYear(-1)}>
              이전 년
            </NavButton>
            <NavButton type="button" onClick={() => changeMonth(-1)}>
              이전 달
            </NavButton>
            <NavButton type="button" onClick={() => changeMonth(1)}>
              다음 달
            </NavButton>
            <NavButton type="button" onClick={() => changeYear(1)}>
              다음 년
            </NavButton>
          </NavButtons>
        </CalendarHeader>
        <WeekHeader>
          {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
            <WeekDay key={label}>{label}</WeekDay>
          ))}
        </WeekHeader>

        <CalendarGrid>
          {Array.from({ length: firstWeekday }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {monthData.map((day) => (
            <DayCard
              key={day.date}
              type="button"
              $selected={selectedDate === day.date}
              onClick={() => setSelectedDate(day.date)}
            >
              <DayNumber>{Number(day.date.slice(-2))}</DayNumber>
              <DaySales>
                {isPastDate(day.date) ? "매출" : "예상매출"}:{" "}
                {toWon(day.expectedSales)}원
              </DaySales>
            </DayCard>
          ))}
        </CalendarGrid>
      </Section>

      <Section>
        <SectionTitle>
          {`${Number(selected.date.slice(5, 7))}월 ${Number(selected.date.slice(8, 10))}일 상세 ${selectedIsPast ? "매출" : "예상매출"}`}
        </SectionTitle>
        <DetailGrid>
          <Panel>
            <PanelTitle>일자 상세</PanelTitle>
            <Row>
              <RowLabel>일자</RowLabel>
              <RowValue>{selected.date}</RowValue>
            </Row>
            <Row>
              <RowLabel>{`총 ${selectedIsPast ? "매출" : "예상매출"}`}</RowLabel>
              <RowValue>{toWon(selected.expectedSales)}원</RowValue>
            </Row>
            <Row>
              <RowLabel>{`점심 피크 ${selectedIsPast ? "매출" : "예상"}(12~14시)`}</RowLabel>
              <RowValue>
                {toWon(
                  hourlyForecast[3].amount +
                    hourlyForecast[4].amount +
                    hourlyForecast[5].amount,
                )}
                원
              </RowValue>
            </Row>
            <Row>
              <RowLabel>{`저녁 피크 ${selectedIsPast ? "매출" : "예상"}(17~20시)`}</RowLabel>
              <RowValue>
                {toWon(
                  hourlyForecast[8].amount +
                    hourlyForecast[9].amount +
                    hourlyForecast[10].amount +
                    hourlyForecast[11].amount,
                )}
                원
              </RowValue>
            </Row>
          </Panel>

          <Panel>
            <PanelTitle>{`시간대 ${selectedIsPast ? "매출" : "예상 매출"}`}</PanelTitle>
            {hourlyForecast.map((hour) => (
              <Row key={hour.time}>
                <RowLabel>{hour.time}</RowLabel>
                <RowValue>{toWon(hour.amount)}원</RowValue>
              </Row>
            ))}
          </Panel>
        </DetailGrid>
      </Section>
    </Page>
  );
}
