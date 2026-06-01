import { useState, useEffect, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import { SyncBanner, ScopeNotice } from "./salesManageUi";
import {
  reflectsOnSalesCheck,
  SCOPE_MESSAGES,
  A_SCOPE,
} from "./salesBackendScope";
import type { SalesCycle, ExpenseCycle } from "./salesData";
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
} from "./salesData";
import {
  toYearMonth,
  buildHourlySales,
  toBackendCycle,
  usePostSales,
  usePostVariable,
  usePostFixed,
  useSalesPeriod,
  useVariablePeriod,
  useFixedCost,
} from "./salesApi";

interface Props {
  autoSalary: number;
  onFinanceUpdated?: () => void;
  onGoToCheck?: () => void;
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

const resolveBaseDate = (
  cycle: SalesCycle | ExpenseCycle,
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

export default function SalesInput({
  autoSalary,
  onFinanceUpdated,
  onGoToCheck,
}: Props) {
  const now = new Date();
  const [salesOpen, setSalesOpen] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(true);
  const [variableOpen, setVariableOpen] = useState(true);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showSyncBanner, setShowSyncBanner] = useState(false);

  const [salesCycle, setSalesCycle] = useState<SalesCycle>("daily");
  const [salesAnchorDate, setSalesAnchorDate] = useState(today());
  const [salesSelectedMonth, setSalesSelectedMonth] = useState(
    today().slice(0, 7),
  );
  const [salesCalendarYear, setSalesCalendarYear] = useState(now.getFullYear());
  const [salesCalendarMonthIndex, setSalesCalendarMonthIndex] = useState(
    now.getMonth(),
  );
  const [salesAmountInput, setSalesAmountInput] = useState("");
  const [hourlyInputs, setHourlyInputs] = useState<string[]>(
    Array.from({ length: HOUR_SLOTS.length }, () => ""),
  );

  const [expenseCycle, setExpenseCycle] = useState<ExpenseCycle>("daily");
  const [expenseAnchorDate, setExpenseAnchorDate] = useState(today());
  const [expenseSelectedMonth, setExpenseSelectedMonth] = useState(
    today().slice(0, 7),
  );
  const [expenseCalendarYear, setExpenseCalendarYear] = useState(
    now.getFullYear(),
  );
  const [expenseCalendarMonthIndex, setExpenseCalendarMonthIndex] = useState(
    now.getMonth(),
  );
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

  const salesBaseDate = useMemo(
    () => resolveBaseDate(salesCycle, salesAnchorDate, salesSelectedMonth),
    [salesCycle, salesAnchorDate, salesSelectedMonth],
  );

  const expenseBaseDate = useMemo(
    () =>
      resolveBaseDate(expenseCycle, expenseAnchorDate, expenseSelectedMonth),
    [expenseCycle, expenseAnchorDate, expenseSelectedMonth],
  );

  const {
    data: salesPeriod,
    refetch: refetchSales,
    isFetching: loadingSalesPeriod,
  } = useSalesPeriod(salesCycle, salesBaseDate);
  const {
    data: variablePeriod,
    refetch: refetchVariable,
    isFetching: loadingVariablePeriod,
  } = useVariablePeriod(expenseCycle, expenseBaseDate);
  const {
    data: fixedCost,
    refetch: refetchFixed,
    isFetching: loadingFixedCost,
  } = useFixedCost(fixedMonth);

  useEffect(() => {
    if (autoSalary > 0) {
      setStaffSalaryInput(String(autoSalary));
    }
  }, [autoSalary]);

  useEffect(() => {
    if (!salesPeriod) return;
    if (salesCycle === "hourly") {
      setHourlyInputs(
        HOUR_SLOTS.map((slot) => {
          const h = salesPeriod.hourlySales.find((x) => x.hour === slot);
          return h && h.amount > 0 ? String(h.amount) : "";
        }),
      );
      setSalesAmountInput("");
      return;
    }
    setSalesAmountInput(
      salesPeriod.totalAmount > 0 ? String(salesPeriod.totalAmount) : "",
    );
    setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));
  }, [salesPeriod, salesCycle, salesBaseDate]);

  useEffect(() => {
    if (!variablePeriod) return;
    setIngredientCostInput(
      variablePeriod.ingredientCost > 0
        ? String(variablePeriod.ingredientCost)
        : "",
    );
    if (autoSalary > 0) {
      setStaffSalaryInput(String(autoSalary));
    } else {
      setStaffSalaryInput(
        variablePeriod.salaryCost > 0 ? String(variablePeriod.salaryCost) : "",
      );
    }
  }, [variablePeriod, autoSalary, expenseBaseDate, expenseCycle]);

  useEffect(() => {
    if (!fixedCost) {
      setRentInput("");
      setUtilitiesInput("");
      return;
    }
    setRentInput(fixedCost.rent > 0 ? String(fixedCost.rent) : "");
    setUtilitiesInput(
      fixedCost.utilityCost > 0 ? String(fixedCost.utilityCost) : "",
    );
  }, [fixedCost, fixedMonth]);

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

  const notifyFinanceUpdated = async () => {
    onFinanceUpdated?.();
    setShowSyncBanner(true);
  };

  const saveSales = async () => {
    setSaveMessage("");
    setSaveError("");
    setShowSyncBanner(false);

    try {
      await createSalesMutation.mutateAsync({
        saleDate: salesBaseDate,
        cycleType: toBackendCycle(salesCycle),
        totalAmount: salesTotalInput,
        hourlySales:
          salesCycle === "hourly" ? buildHourlySales(hourlyInputs) : undefined,
      });
      await refetchSales();
      await notifyFinanceUpdated();
      setSaveMessage(
        reflectsOnSalesCheck(salesCycle)
          ? `매출이 ${SCOPE_MESSAGES.savedCalendar}`
          : `매출이 ${SCOPE_MESSAGES.savedPeriodOnly}`,
      );
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "매출 저장에 실패했습니다.",
      );
    }
  };

  const saveVariable = async () => {
    setSaveMessage("");
    setSaveError("");
    setShowSyncBanner(false);

    try {
      await createVariableMutation.mutateAsync({
        costDate: expenseBaseDate,
        cycleType: toBackendCycle(expenseCycle),
        ingredientCost: toNumber(ingredientCostInput),
        salaryCost: toNumber(staffSalaryInput),
      });
      await refetchVariable();
      await notifyFinanceUpdated();
      setSaveMessage(
        reflectsOnSalesCheck(expenseCycle)
          ? `변동비가 ${SCOPE_MESSAGES.savedCalendar}`
          : `변동비가 ${SCOPE_MESSAGES.savedPeriodOnly}`,
      );
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "변동비 저장에 실패했습니다.",
      );
    }
  };

  const saveFixed = async () => {
    setSaveMessage("");
    setSaveError("");
    setShowSyncBanner(false);

    try {
      await saveFixedMutation.mutateAsync({
        targetYearMonth: fixedMonth,
        rent: toNumber(rentInput),
        utilityCost: toNumber(utilitiesInput),
      });
      await refetchFixed();
      await notifyFinanceUpdated();
      setSaveMessage(
        `고정비가 저장되었습니다. ${A_SCOPE.financeDailyHourlyCalendar ? "매출 확인(월 지출·순이익)에 반영됩니다." : ""}`,
      );
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

  const periodRangeLabel = (start?: string, end?: string) =>
    start && end ? `${start} ~ ${end}` : "-";

  return (
    <S.Section>
      <S.SectionTitle>매출 입력</S.SectionTitle>
      <ScopeNotice>
        저장·조회: POST/GET period API (하루·한주·한달·시간 / 변동비·고정비). 매출 확인
        캘린더는 하루·시간별 집계만 표시됩니다.
      </ScopeNotice>

      {saveMessage && <S.Value>{saveMessage}</S.Value>}
      {saveError && <S.Value>{saveError}</S.Value>}
      {showSyncBanner && (
        <SyncBanner>
          저장한 내용이 서버에 반영되었습니다.
          {onGoToCheck && (
            <S.NavButton
              type="button"
              style={{ marginLeft: 8, padding: "4px 10px", fontSize: 12 }}
              onClick={onGoToCheck}
            >
              매출 확인으로 이동
            </S.NavButton>
          )}
        </SyncBanner>
      )}

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
            <S.Label>반영 주기</S.Label>
            <S.Select
              value={salesCycle}
              onChange={(e) => setSalesCycle(e.target.value as SalesCycle)}
            >
              <option value="daily">하루</option>
              <option value="hourly">특정 시간</option>
              {/* A주석 BEGIN: 한주·한달 — period API 지원, 캘린더 미반영 시에도 입력 가능 */}
              <option value="weekly">한주</option>
              <option value="monthly">한달</option>
              {/* A주석 END: 한주·한달 */}
            </S.Select>
          </S.Row>
          {!reflectsOnSalesCheck(salesCycle) && (
            <ScopeNotice $variant="warn">
              「한주」「한달」은 이 화면에서 저장·조회됩니다. 매출 확인 캘린더에는 나타나지
              않을 수 있습니다.
            </ScopeNotice>
          )}

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
                ? "반영할 하루 날짜를 선택하세요."
                : salesCycle === "weekly"
                  ? "캘린더에서 주간 매출을 반영할 주를 선택하세요."
                  : salesCycle === "monthly"
                    ? "캘린더에서 월간 매출을 반영할 달을 선택하세요."
                    : "시간대별 매출을 반영할 날짜를 선택하세요."
            }
          />

          {loadingSalesPeriod && (
            <S.PickerHint>서버에서 매출 데이터를 불러오는 중...</S.PickerHint>
          )}

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
            <S.Value>{salesBaseDate}</S.Value>
          </S.Row>
          <S.Row>
            <S.Label>적용 기간</S.Label>
            <S.Value>
              {periodRangeLabel(
                salesPeriod?.periodStartDate,
                salesPeriod?.periodEndDate,
              )}
            </S.Value>
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
                  {/* A주석 BEGIN: 변동비 한주·한달 */}
                  <option value="weekly">한주</option>
                  <option value="monthly">한달</option>
                  {/* A주석 END: 변동비 한주·한달 */}
                </S.Select>
              </S.Row>
              {!reflectsOnSalesCheck(expenseCycle) && (
                <ScopeNotice $variant="warn">
                  「한주」「한달」 변동비는 period API로 저장·조회됩니다. 매출 확인
                  캘린더 일별 합계와 다를 수 있습니다.
                </ScopeNotice>
              )}

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

              {loadingVariablePeriod && (
                <S.PickerHint>서버에서 변동비 데이터를 불러오는 중...</S.PickerHint>
              )}

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
                <S.Value>{expenseBaseDate}</S.Value>
              </S.Row>
              <S.Row>
                <S.Label>적용 기간</S.Label>
                <S.Value>
                  {periodRangeLabel(
                    variablePeriod?.periodStartDate,
                    variablePeriod?.periodEndDate,
                  )}
                </S.Value>
              </S.Row>
              <S.Row>
                <S.Label>변동비 합계</S.Label>
                <S.Value>{toWon(variableTotalInput)}원</S.Value>
              </S.Row>
              <S.SaveButton
                type="button"
                onClick={saveVariable}
                disabled={isSaving}
              >
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
              {loadingFixedCost && (
                <S.PickerHint>서버에서 고정비 데이터를 불러오는 중...</S.PickerHint>
              )}
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
              <S.SaveButton
                type="button"
                onClick={saveFixed}
                disabled={isSaving}
              >
                고정비 저장/수정
              </S.SaveButton>
            </S.Panel>
          )}
        </>
      )}
    </S.Section>
  );
}
