import { useState, useEffect, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import type { SalesCycle, ExpenseCycle, FixedExpenseMap, VariableExpenseEntry } from "./salesData";
import {
  HOUR_SLOTS,
  toWon,
  toNumber,
  today,
  getWeekStart,
  formatWeekRange,
  buildCalendarDays,
  monthAnchorDate,
  sameWeek,
  entryKey,
  VAR_KEY,
  parse,
} from "./salesData";
import {
  toYearMonth,
  getDaily,
  buildHourlySales,
  toBackendCycle,
  usePostSales,
  usePostVariable,
  usePostFixed,
} from "./salesApi";

interface Props {
  fixedMap: FixedExpenseMap;
  autoSalary: number;
  onUpdateFixed: (map: FixedExpenseMap) => void;
}

type CyclePickerProps = {
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

function CycleDatePicker({
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
  const firstWeekday = new Date(calendarYear, calendarMonthIndex, 1).getDay();
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
          {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
            <S.WeekDay key={label}>{label}</S.WeekDay>
          ))}
        </S.WeekHeader>
        <S.CalendarGrid>
          {Array.from({ length: firstWeekday }).map((_, index) => (
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

const resolveSaleDate = (
  cycle: SalesCycle,
  anchorDate: string,
  selectedMonth: string,
) => {
  if (cycle === "monthly") {
    return monthAnchorDate(selectedMonth);
  }
  if (cycle === "weekly") {
    return getWeekStart(anchorDate);
  }
  return anchorDate;
};

export default function SalesInput({ fixedMap, autoSalary, onUpdateFixed }: Props) {
  const now = new Date();
  const [salesOpen, setSalesOpen] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(true);
  const [variableOpen, setVariableOpen] = useState(true);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [salesCycle, setSalesCycle] = useState<SalesCycle>("daily");
  const [salesAnchorDate, setSalesAnchorDate] = useState(today());
  const [salesSelectedMonth, setSalesSelectedMonth] = useState(today().slice(0, 7));
  const [salesCalendarYear, setSalesCalendarYear] = useState(now.getFullYear());
  const [salesCalendarMonthIndex, setSalesCalendarMonthIndex] = useState(now.getMonth());
  const [salesAmountInput, setSalesAmountInput] = useState("");
  const [hourlyInputs, setHourlyInputs] = useState<string[]>(
    Array.from({ length: HOUR_SLOTS.length }, () => ""),
  );

  const [expenseCycle, setExpenseCycle] = useState<ExpenseCycle>("daily");
  const [expenseAnchorDate, setExpenseAnchorDate] = useState(today());
  const [expenseSelectedMonth, setExpenseSelectedMonth] = useState(today().slice(0, 7));
  const [expenseCalendarYear, setExpenseCalendarYear] = useState(now.getFullYear());
  const [expenseCalendarMonthIndex, setExpenseCalendarMonthIndex] = useState(now.getMonth());
  const [staffSalaryInput, setStaffSalaryInput] = useState(
    autoSalary > 0 ? String(autoSalary) : "",
  );
  const [ingredientCostInput, setIngredientCostInput] = useState("");
  const [fixedMonth, setFixedMonth] = useState(today().slice(0, 7));
  const [rentInput, setRentInput] = useState("");
  const [utilitiesInput, setUtilitiesInput] = useState("");

  const createSalesMutation = usePostSales();
  const createVariableMutation = usePostVariable();
  const saveFixedMutation = usePostFixed();

  const salesDate = useMemo(
    () => resolveSaleDate(salesCycle, salesAnchorDate, salesSelectedMonth),
    [salesCycle, salesAnchorDate, salesSelectedMonth],
  );

  const expenseDate = useMemo(() => {
    if (expenseCycle === "monthly") {
      return monthAnchorDate(expenseSelectedMonth);
    }
    if (expenseCycle === "weekly") {
      return getWeekStart(expenseAnchorDate);
    }
    return expenseAnchorDate;
  }, [expenseCycle, expenseAnchorDate, expenseSelectedMonth]);

  useEffect(() => {
    if (autoSalary > 0) {
      setStaffSalaryInput(String(autoSalary));
    }
  }, [autoSalary]);

  useEffect(() => {
    let cancelled = false;

    getDaily(salesDate)
      .then((detail) => {
        if (cancelled) return;
        if (salesCycle === "hourly" && detail.hourlySales.length) {
          setHourlyInputs(
            HOUR_SLOTS.map((slot) => {
              const h = detail.hourlySales.find((x) => x.hour === slot);
              return h && h.amount > 0 ? String(h.amount) : "";
            }),
          );
          setSalesAmountInput("");
        } else {
          setSalesAmountInput(detail.totalSales > 0 ? String(detail.totalSales) : "");
          setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSalesAmountInput("");
          setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));
        }
      });
    return () => { cancelled = true; };
  }, [salesDate, salesCycle]);

  useEffect(() => {
    const varEntries = parse<VariableExpenseEntry[]>(localStorage.getItem(VAR_KEY), []);
    const cached = varEntries.find((e) => e.date === expenseDate && e.cycle === expenseCycle);
    if (cached) {
      setStaffSalaryInput(cached.staffSalary > 0 ? String(cached.staffSalary) : "");
      setIngredientCostInput(cached.ingredientCost > 0 ? String(cached.ingredientCost) : "");
      return;
    }
    getDaily(expenseDate)
      .then((detail) => {
        if (detail.variableCost > 0) {
          setIngredientCostInput(String(detail.variableCost));
        } else {
          setIngredientCostInput("");
        }
        if (!(autoSalary > 0)) setStaffSalaryInput("");
      })
      .catch(() => {
        setIngredientCostInput("");
        if (!(autoSalary > 0)) setStaffSalaryInput("");
      });
  }, [expenseDate, expenseCycle, autoSalary]);

  useEffect(() => {
    const fixed = fixedMap[fixedMonth];
    setRentInput(fixed?.rent ? String(fixed.rent) : "");
    setUtilitiesInput(fixed?.utilities ? String(fixed.utilities) : "");
  }, [fixedMap, fixedMonth]);

  const salesTotalInput = useMemo(
    () =>
      salesCycle === "hourly"
        ? hourlyInputs.reduce((acc, input) => acc + toNumber(input), 0)
        : toNumber(salesAmountInput),
    [hourlyInputs, salesAmountInput, salesCycle],
  );
  const variableTotalInput = useMemo(
    () => toNumber(staffSalaryInput) + toNumber(ingredientCostInput),
    [staffSalaryInput, ingredientCostInput],
  );
  const fixedTotalInput = useMemo(
    () => toNumber(rentInput) + toNumber(utilitiesInput),
    [rentInput, utilitiesInput],
  );

  const saveSales = async () => {
    setSaveMessage("");
    setSaveError("");

    try {
      await createSalesMutation.mutateAsync({
        saleDate: salesDate,
        cycleType: toBackendCycle(salesCycle),
        totalAmount: salesTotalInput,
        hourlySales:
          salesCycle === "hourly" ? buildHourlySales(hourlyInputs) : undefined,
      });
      setSaveMessage("매출이 저장되었습니다.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "매출 저장에 실패했습니다.",
      );
    }
  };

  const saveVariable = async () => {
    setSaveMessage("");
    setSaveError("");

    try {
      await createVariableMutation.mutateAsync({
        costDate: expenseDate,
        cycleType: toBackendCycle(expenseCycle),
        ingredientCost: toNumber(ingredientCostInput),
        salaryCost: toNumber(staffSalaryInput),
      });
      const varEntries = parse<VariableExpenseEntry[]>(localStorage.getItem(VAR_KEY), []);
      const next: VariableExpenseEntry = {
        date: expenseDate,
        cycle: expenseCycle,
        staffSalary: toNumber(staffSalaryInput),
        ingredientCost: toNumber(ingredientCostInput),
        total: variableTotalInput,
      };
      localStorage.setItem(
        VAR_KEY,
        JSON.stringify([
          ...varEntries.filter((e) => entryKey(e.cycle, e.date) !== entryKey(expenseCycle, expenseDate)),
          next,
        ]),
      );
      setSaveMessage("변동비가 저장되었습니다.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "변동비 저장에 실패했습니다.",
      );
    }
  };

  const saveFixed = async () => {
    setSaveMessage("");
    setSaveError("");

    const nextFixed = {
      rent: toNumber(rentInput),
      utilities: toNumber(utilitiesInput),
      total: fixedTotalInput,
    };

    try {
      await saveFixedMutation.mutateAsync({
        targetYearMonth: fixedMonth,
        rent: nextFixed.rent,
        utilityCost: nextFixed.utilities,
      });

      onUpdateFixed({
        ...fixedMap,
        [fixedMonth]: nextFixed,
      });
      setSaveMessage("고정비가 저장되었습니다.");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "고정비 저장에 실패했습니다.",
      );
    }
  };

  const isSaving =
    createSalesMutation.isPending ||
    createVariableMutation.isPending ||
    saveFixedMutation.isPending;

  return (
    <S.Section>
      <S.SectionTitle>매출 입력</S.SectionTitle>

      {saveMessage && <S.Value>{saveMessage}</S.Value>}
      {saveError && <S.Value>{saveError}</S.Value>}

      <S.AccordionTitle
        type="button"
        $open={salesOpen}
        onClick={() => setSalesOpen((p) => !p)}
      >
        매출 입력
      </S.AccordionTitle>
      {salesOpen && (
        <S.Panel>
          <S.Row>
            <S.Label>입력 주기</S.Label>
            <S.Select
              value={salesCycle}
              onChange={(e) => setSalesCycle(e.target.value as SalesCycle)}
            >
              <option value="daily">하루</option>
              <option value="weekly">한주</option>
              <option value="monthly">한달</option>
              <option value="hourly">특정 시간</option>
            </S.Select>
          </S.Row>

          <CycleDatePicker
            cycle={salesCycle}
            anchorDate={salesAnchorDate}
            selectedMonth={salesSelectedMonth}
            calendarYear={salesCalendarYear}
            calendarMonthIndex={salesCalendarMonthIndex}
            onAnchorDateChange={setSalesAnchorDate}
            onSelectedMonthChange={setSalesSelectedMonth}
            onCalendarYearChange={setSalesCalendarYear}
            onCalendarMonthIndexChange={setSalesCalendarMonthIndex}
            hint={
              salesCycle === "daily"
                ? "입력할 하루 날짜를 선택하세요."
                : salesCycle === "weekly"
                  ? "캘린더에서 주간 매출을 입력할 주를 선택하세요."
                  : salesCycle === "monthly"
                    ? "캘린더에서 월간 매출을 입력할 달을 선택하세요."
                    : "시간대별 매출을 입력할 날짜를 선택하세요."
            }
          />

          {salesCycle === "hourly" ? (
            HOUR_SLOTS.map((slot, idx) => (
              <S.Row key={slot}>
                <S.Label>{slot}</S.Label>
                <S.Input
                  value={hourlyInputs[idx]}
                  onChange={(e) =>
                    setHourlyInputs((prev) =>
                      prev.map((v, i) => (i === idx ? e.target.value : v)),
                    )
                  }
                />
              </S.Row>
            ))
          ) : (
            <S.Row>
              <S.Label>매출 금액</S.Label>
              <S.Input
                value={salesAmountInput}
                onChange={(e) => setSalesAmountInput(e.target.value)}
              />
            </S.Row>
          )}
          <S.Row>
            <S.Label>저장 기준일</S.Label>
            <S.Value>{salesDate}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>저장 예정 금액</S.Label>
            <S.Value>{toWon(salesTotalInput)}원</S.Value>
          </S.Row>
          <S.SaveButton type="button" onClick={saveSales} disabled={isSaving}>
            매출 저장/수정
          </S.SaveButton>
        </S.Panel>
      )}

      <S.AccordionTitle
        type="button"
        $open={expenseOpen}
        onClick={() => setExpenseOpen((p) => !p)}
      >
        지출 입력
      </S.AccordionTitle>
      {expenseOpen && (
        <>
          <S.AccordionTitle
            type="button"
            $open={variableOpen}
            onClick={() => setVariableOpen((p) => !p)}
          >
            변동비
          </S.AccordionTitle>
          {variableOpen && (
            <S.Panel>
              <S.Row>
                <S.Label>반영 주기</S.Label>
                <S.Select
                  value={expenseCycle}
                  onChange={(e) =>
                    setExpenseCycle(e.target.value as ExpenseCycle)
                  }
                >
                  <option value="daily">하루</option>
                  <option value="weekly">한주</option>
                  <option value="monthly">한달</option>
                </S.Select>
              </S.Row>

              <CycleDatePicker
                cycle={expenseCycle}
                anchorDate={expenseAnchorDate}
                selectedMonth={expenseSelectedMonth}
                calendarYear={expenseCalendarYear}
                calendarMonthIndex={expenseCalendarMonthIndex}
                onAnchorDateChange={setExpenseAnchorDate}
                onSelectedMonthChange={setExpenseSelectedMonth}
                onCalendarYearChange={setExpenseCalendarYear}
                onCalendarMonthIndexChange={setExpenseCalendarMonthIndex}
                hint={
                  expenseCycle === "daily"
                    ? "변동비를 반영할 하루 날짜를 선택하세요."
                    : expenseCycle === "weekly"
                      ? "캘린더에서 변동비를 반영할 주를 선택하세요."
                      : "캘린더에서 변동비를 반영할 달을 선택하세요."
                }
              />

              <S.Row>
                <S.Label>직원 월급(자동값 연동)</S.Label>
                <S.Input
                  value={staffSalaryInput}
                  onChange={(e) => setStaffSalaryInput(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>재료값</S.Label>
                <S.Input
                  value={ingredientCostInput}
                  onChange={(e) => setIngredientCostInput(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>저장 기준일</S.Label>
                <S.Value>{expenseDate}</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>변동비 합계</S.Label>
                <S.Value>{toWon(variableTotalInput)}원</S.Value>
              </S.Row>
              <S.SaveButton type="button" onClick={saveVariable} disabled={isSaving}>
                변동비 저장/수정
              </S.SaveButton>
            </S.Panel>
          )}

          <S.AccordionTitle
            type="button"
            $open={fixedOpen}
            onClick={() => setFixedOpen((p) => !p)}
          >
            고정비
          </S.AccordionTitle>
          {fixedOpen && (
            <S.Panel>
              <S.Row>
                <S.Label>년/월</S.Label>
                <S.Input
                  type="month"
                  value={fixedMonth}
                  onChange={(e) => setFixedMonth(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>임대료</S.Label>
                <S.Input
                  value={rentInput}
                  onChange={(e) => setRentInput(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>공과금</S.Label>
                <S.Input
                  value={utilitiesInput}
                  onChange={(e) => setUtilitiesInput(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>고정비 합계</S.Label>
                <S.Value>{toWon(fixedTotalInput)}원</S.Value>
              </S.Row>
              <S.SaveButton type="button" onClick={saveFixed} disabled={isSaving}>
                고정비 저장/수정
              </S.SaveButton>
            </S.Panel>
          )}
        </>
      )}
    </S.Section>
  );
}
