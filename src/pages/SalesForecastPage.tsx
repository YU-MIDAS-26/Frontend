import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

type DayForecast = {
  date: string;
  expectedSales: number;
};

type VariableCycle = "daily" | "weekly" | "monthly";

const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: var(--app-page-bg);
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

const ToggleButton = styled(ActionButton)<{ $active: boolean }>`
  border-color: ${(props) => (props.$active ? "#5d839f" : "#9cb5c7")};
  background: ${(props) => (props.$active ? "#6f93ab" : "#a5bbca")};
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

const TopActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InputLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroupTitle = styled.h4`
  margin: 0 0 8px;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
`;

const InputRow = styled.div`
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

const InputLabel = styled.label`
  color: #222;
  font-size: 14px;
`;

const NumberInput = styled.input`
  width: 170px;
  border: 1px solid #d0d4d9;
  background: #ffffff;
  color: #111111;
  font-size: 14px;
  border-radius: 6px;
  padding: 6px 8px;
`;

const SelectInput = styled.select`
  width: 170px;
  border: 1px solid #d0d4d9;
  background: #ffffff;
  color: #111111;
  font-size: 14px;
  border-radius: 6px;
  padding: 6px 8px;
`;

const CompleteButton = styled.button`
  border: 1px solid #7ea0b7;
  background: #7ea0b7;
  color: #101010;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

const HintText = styled.p`
  margin: 8px 0 0;
  color: #3a3f45;
  font-size: 12px;
`;

function toWon(value: number) {
  return value.toLocaleString("ko-KR");
}

function toNumber(value: string) {
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) {
    return 0;
  }
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function sumVariableCosts(
  dailySalesInput: string,
  staffSalaryInput: string,
  ingredientCostInput: string,
  costOfGoodsInput: string,
) {
  return (
    toNumber(dailySalesInput) +
    toNumber(staffSalaryInput) +
    toNumber(ingredientCostInput) +
    toNumber(costOfGoodsInput)
  );
}

function sumFixedCosts(rentInput: string, utilitiesInput: string) {
  return toNumber(rentInput) + toNumber(utilitiesInput);
}

function getExpenseForDate(
  dateText: string,
  fixedExpenseSaved: number,
  fixedAnchorDate: string,
  variableExpenseSaved: number,
  variableCycleSaved: VariableCycle,
  variableAnchorDate: string,
) {
  const target = new Date(`${dateText}T00:00:00`);
  const fixedAnchor = fixedAnchorDate
    ? new Date(`${fixedAnchorDate}T00:00:00`)
    : null;
  const isFixedMonth =
    fixedAnchor !== null &&
    target.getFullYear() === fixedAnchor.getFullYear() &&
    target.getMonth() === fixedAnchor.getMonth();
  const fixedExpense = isFixedMonth ? fixedExpenseSaved : 0;

  if (!variableAnchorDate) {
    return fixedExpense;
  }

  const anchor = new Date(`${variableAnchorDate}T00:00:00`);

  if (variableCycleSaved === "daily") {
    const isSameDay =
      target.getFullYear() === anchor.getFullYear() &&
      target.getMonth() === anchor.getMonth() &&
      target.getDate() === anchor.getDate();
    return isSameDay ? fixedExpense + variableExpenseSaved : fixedExpense;
  }

  if (variableCycleSaved === "weekly") {
    const weekStart = new Date(anchor);
    weekStart.setDate(anchor.getDate() - anchor.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const inSameWeek = target >= weekStart && target <= weekEnd;
    return inSameWeek ? fixedExpense + variableExpenseSaved : fixedExpense;
  }

  const inSameMonth =
    target.getFullYear() === anchor.getFullYear() &&
    target.getMonth() === anchor.getMonth();
  return inSameMonth ? fixedExpense + variableExpenseSaved : fixedExpense;
}

const FIXED_EXPENSE_KEY = "sales_fixed_expense_saved";
const FIXED_ANCHOR_KEY = "sales_fixed_anchor_date";
const VARIABLE_EXPENSE_KEY = "sales_variable_expense_saved";
const VARIABLE_CYCLE_KEY = "sales_variable_cycle_saved";
const VARIABLE_ANCHOR_KEY = "sales_variable_anchor_date";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState<"forecast" | "input">(
    "forecast",
  );
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonthIndex, setViewMonthIndex] = useState(3);
  const monthData = useMemo(
    () => buildMonthForecast(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex],
  );
  const [selectedDate, setSelectedDate] = useState(
    monthData[4]?.date ?? monthData[0].date,
  );
  const [dailySalesInput, setDailySalesInput] = useState("");
  const [staffSalaryInput, setStaffSalaryInput] = useState("");
  const [ingredientCostInput, setIngredientCostInput] = useState("");
  const [costOfGoodsInput, setCostOfGoodsInput] = useState("");
  const [variableCycleInput, setVariableCycleInput] =
    useState<VariableCycle>("daily");
  const [rentInput, setRentInput] = useState("");
  const [utilitiesInput, setUtilitiesInput] = useState("");
  const [fixedExpenseSaved, setFixedExpenseSaved] = useState(0);
  const [fixedAnchorDate, setFixedAnchorDate] = useState("");
  const [variableExpenseSaved, setVariableExpenseSaved] = useState(0);
  const [variableCycleSaved, setVariableCycleSaved] =
    useState<VariableCycle>("daily");
  const [variableAnchorDate, setVariableAnchorDate] = useState("");

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

  const variableInputTotal = useMemo(
    () =>
      sumVariableCosts(
        dailySalesInput,
        staffSalaryInput,
        ingredientCostInput,
        costOfGoodsInput,
      ),
    [dailySalesInput, staffSalaryInput, ingredientCostInput, costOfGoodsInput],
  );

  const fixedInputTotal = useMemo(
    () => sumFixedCosts(rentInput, utilitiesInput),
    [rentInput, utilitiesInput],
  );

  const totalExpense = useMemo(
    () =>
      getExpenseForDate(
        selected.date,
        fixedExpenseSaved,
        fixedAnchorDate,
        variableExpenseSaved,
        variableCycleSaved,
        variableAnchorDate,
      ),
    [
      selected.date,
      fixedExpenseSaved,
      fixedAnchorDate,
      variableExpenseSaved,
      variableCycleSaved,
      variableAnchorDate,
    ],
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "forecast") {
      setActivePage("forecast");
      return;
    }
    setActivePage("input");
  }, [searchParams]);

  useEffect(() => {
    const savedFixed = Number(localStorage.getItem(FIXED_EXPENSE_KEY) ?? "0");
    const savedFixedAnchor = localStorage.getItem(FIXED_ANCHOR_KEY) ?? "";
    const savedVariable = Number(
      localStorage.getItem(VARIABLE_EXPENSE_KEY) ?? "0",
    );
    const savedCycle = localStorage.getItem(VARIABLE_CYCLE_KEY) as VariableCycle;
    const savedAnchor = localStorage.getItem(VARIABLE_ANCHOR_KEY) ?? "";

    setFixedExpenseSaved(Number.isFinite(savedFixed) ? savedFixed : 0);
    setFixedAnchorDate(savedFixedAnchor);
    setVariableExpenseSaved(Number.isFinite(savedVariable) ? savedVariable : 0);
    if (savedCycle === "daily" || savedCycle === "weekly" || savedCycle === "monthly") {
      setVariableCycleSaved(savedCycle);
      setVariableCycleInput(savedCycle);
    }
    setVariableAnchorDate(savedAnchor);
  }, []);

  const moveToPage = (tab: "forecast" | "input") => {
    if (tab === "forecast") {
      navigate("/sales-check");
      return;
    }
    setActivePage(tab);
    setSearchParams({});
  };

  const handleVariableComplete = () => {
    setVariableExpenseSaved(variableInputTotal);
    setVariableCycleSaved(variableCycleInput);
    const anchorDate = new Date().toISOString().slice(0, 10);
    setVariableAnchorDate(anchorDate);
    localStorage.setItem(VARIABLE_EXPENSE_KEY, String(variableInputTotal));
    localStorage.setItem(VARIABLE_CYCLE_KEY, variableCycleInput);
    localStorage.setItem(VARIABLE_ANCHOR_KEY, anchorDate);
  };

  const handleFixedComplete = () => {
    setFixedExpenseSaved(fixedInputTotal);
    const anchorDate = new Date().toISOString().slice(0, 10);
    setFixedAnchorDate(anchorDate);
    localStorage.setItem(FIXED_EXPENSE_KEY, String(fixedInputTotal));
    localStorage.setItem(FIXED_ANCHOR_KEY, anchorDate);
  };

  return (
    <Page>
      <Section>
        <SectionTitle>
          {activePage === "forecast" ? "추후 예상 매출 확인" : "매출 입력"}
        </SectionTitle>
        <MonthSummary>
          <SummaryText>
            {viewMonthIndex + 1}월달 예상매출: {toWon(monthTotal)}원
          </SummaryText>
          <TopActionButtons>
            <ToggleButton
              type="button"
              $active={activePage === "forecast"}
              onClick={() => moveToPage("forecast")}
            >
              추후 예상 매출 확인
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={activePage === "input"}
              onClick={() => moveToPage("input")}
            >
              매출 입력
            </ToggleButton>
            <ActionButton type="button" onClick={() => navigate("/report")}>
              보고서 확인
            </ActionButton>
          </TopActionButtons>
        </MonthSummary>
      </Section>

      {activePage === "input" ? (
        <Section>
          <SectionTitle>매출 입력</SectionTitle>
          <InputLayout>
            <Panel>
              <InputGroupTitle>변동비</InputGroupTitle>
              <InputRow>
                <InputLabel htmlFor="daily-sales">일별 매출</InputLabel>
                <NumberInput
                  id="daily-sales"
                  inputMode="numeric"
                  value={dailySalesInput}
                  onChange={(event) => setDailySalesInput(event.target.value)}
                  placeholder="0"
                />
              </InputRow>
              <InputRow>
                <InputLabel htmlFor="staff-salary">직원 월급</InputLabel>
                <NumberInput
                  id="staff-salary"
                  inputMode="numeric"
                  value={staffSalaryInput}
                  onChange={(event) => setStaffSalaryInput(event.target.value)}
                  placeholder="0"
                />
              </InputRow>
              <InputRow>
                <InputLabel htmlFor="ingredient-cost">재료값</InputLabel>
                <NumberInput
                  id="ingredient-cost"
                  inputMode="numeric"
                  value={ingredientCostInput}
                  onChange={(event) =>
                    setIngredientCostInput(event.target.value)
                  }
                  placeholder="0"
                />
              </InputRow>
              <InputRow>
                <InputLabel htmlFor="cost-of-goods">원가</InputLabel>
                <NumberInput
                  id="cost-of-goods"
                  inputMode="numeric"
                  value={costOfGoodsInput}
                  onChange={(event) => setCostOfGoodsInput(event.target.value)}
                  placeholder="0"
                />
              </InputRow>
              <InputRow>
                <InputLabel htmlFor="variable-cycle">변동비 주기</InputLabel>
                <SelectInput
                  id="variable-cycle"
                  value={variableCycleInput}
                  onChange={(event) =>
                    setVariableCycleInput(event.target.value as VariableCycle)
                  }
                >
                  <option value="daily">오늘</option>
                  <option value="weekly">이번 주</option>
                  <option value="monthly">이번 달</option>
                </SelectInput>
              </InputRow>
              <InputRow>
                <RowLabel>변동비 합계</RowLabel>
                <RowValue>{toWon(variableInputTotal)}원</RowValue>
              </InputRow>
              <InputRow>
                <CompleteButton type="button" onClick={handleVariableComplete}>
                  변동비 완료
                </CompleteButton>
                <RowValue>{toWon(variableExpenseSaved)}원 저장됨</RowValue>
              </InputRow>
              <HintText>
                변동비는 선택한 주기(매일/매주/매월 1회)로 지출에 반영됩니다.
              </HintText>
            </Panel>

            <Panel>
              <InputGroupTitle>고정비</InputGroupTitle>
              <InputRow>
                <InputLabel htmlFor="rent">임대료</InputLabel>
                <NumberInput
                  id="rent"
                  inputMode="numeric"
                  value={rentInput}
                  onChange={(event) => setRentInput(event.target.value)}
                  placeholder="0"
                />
              </InputRow>
              <InputRow>
                <InputLabel htmlFor="utilities">공과금</InputLabel>
                <NumberInput
                  id="utilities"
                  inputMode="numeric"
                  value={utilitiesInput}
                  onChange={(event) => setUtilitiesInput(event.target.value)}
                  placeholder="0"
                />
              </InputRow>
              <Row>
                <RowLabel>고정비 합계</RowLabel>
                <RowValue>{toWon(fixedInputTotal)}원</RowValue>
              </Row>
              <InputRow>
                <CompleteButton type="button" onClick={handleFixedComplete}>
                  고정비 완료
                </CompleteButton>
                <RowValue>{toWon(fixedExpenseSaved)}원 저장됨</RowValue>
              </InputRow>
              <HintText>
                고정비는 한 번 저장하면 한 달 동안 매일 지출에 고정 반영됩니다.
              </HintText>
            </Panel>
          </InputLayout>
        </Section>
      ) : (
        <>
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
              {monthData.map((day) =>
                (() => {
                  const dayExpense = getExpenseForDate(
                    day.date,
                    fixedExpenseSaved,
                    fixedAnchorDate,
                    variableExpenseSaved,
                    variableCycleSaved,
                    variableAnchorDate,
                  );
                  return (
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
                      <DaySales>지출: {toWon(dayExpense)}원</DaySales>
                      <DaySales>
                        순이익: {toWon(day.expectedSales - dayExpense)}원
                      </DaySales>
                    </DayCard>
                  );
                })(),
              )}
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
                  <RowLabel>지출</RowLabel>
                  <RowValue>{toWon(totalExpense)}원</RowValue>
                </Row>
                <Row>
                  <RowLabel>순이익</RowLabel>
                  <RowValue>
                    {toWon(selected.expectedSales - totalExpense)}원
                  </RowValue>
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
        </>
      )}
    </Page>
  );
}
