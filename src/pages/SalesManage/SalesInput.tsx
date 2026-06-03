import { useState, useEffect, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import { SyncBanner, ScopeNotice } from "./salesManageUi";
import { CycleDatePicker } from "./SalesCycleDatePicker";
import { reflectsOnSalesCheck } from "./salesBackendScope";
import type { SalesCycle, ExpenseCycle } from "./salesData";
import {
  HOUR_SLOTS,
  toWon,
  toNumber,
  today,
  getWeekStart,
  monthAnchorDate,
} from "./salesData";
import {
  buildHourlySales,
  toBackendCycle,
  usePostSales,
  useDeleteSales,
  usePostVariable,
  usePostFixed,
  useSalesPeriod,
  useVariablePeriod,
  useFixedCost,
} from "../../api/sales_api";
import {
  validateFixedSave,
  validateSalesSave,
  validateVariableSave,
} from "./salesFormValidation";

interface Props {
  autoSalary: number;
  onGoToCheck?: () => void;
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

function SectionSaveFeedback({
  label,
  showSuccess,
  error,
  onGoToCheck,
}: {
  label: string;
  showSuccess: boolean;
  error: string;
  onGoToCheck?: () => void;
}) {
  if (!showSuccess && !error) return null;

  return (
    <div style={{ marginBottom: 10 }}>
      {showSuccess && (
        <>
          <S.Value>
            {label}가 저장되었습니다. 매출 확인(월 지출·순이익)에 반영됩니다.
          </S.Value>
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
        </>
      )}
      {error && <S.Value>{error}</S.Value>}
    </div>
  );
}

export default function SalesInput({ autoSalary, onGoToCheck }: Props) {
  const now = new Date();
  const [salesOpen, setSalesOpen] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(true);
  const [variableOpen, setVariableOpen] = useState(true);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [salesSaveSuccess, setSalesSaveSuccess] = useState(false);
  const [salesSaveError, setSalesSaveError] = useState("");
  const [variableSaveSuccess, setVariableSaveSuccess] = useState(false);
  const [variableSaveError, setVariableSaveError] = useState("");
  const [fixedSaveSuccess, setFixedSaveSuccess] = useState(false);
  const [fixedSaveError, setFixedSaveError] = useState("");

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
  const deleteSalesMutation = useDeleteSales();
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

  const { data: salesPeriod, isFetching: loadingSalesPeriod } = useSalesPeriod(
    salesCycle,
    salesBaseDate,
  );
  const { data: variablePeriod, isFetching: loadingVariablePeriod } =
    useVariablePeriod(expenseCycle, expenseBaseDate);
  const { data: fixedCost, isFetching: loadingFixedCost } =
    useFixedCost(fixedMonth);

  useEffect(() => {
    if (autoSalary > 0) {
      const timer = setTimeout(() => {
        setStaffSalaryInput(String(autoSalary));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoSalary]);

  useEffect(() => {
    if (!salesPeriod) return;

    const timer = setTimeout(() => {
      if (salesCycle === "hourly") {
        setHourlyInputs(
          HOUR_SLOTS.map((slot) => {
            const h = salesPeriod.hourlySales.find((x) => x.hour === slot);
            return h && h.amount > 0 ? String(h.amount) : "";
          }),
        );
        setSalesAmountInput("");
      } else {
        setSalesAmountInput(
          salesPeriod.totalAmount > 0 ? String(salesPeriod.totalAmount) : "",
        );
        setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [salesPeriod, salesCycle, salesBaseDate]);

  useEffect(() => {
    if (!variablePeriod) return;

    const timer = setTimeout(() => {
      setIngredientCostInput(
        variablePeriod.ingredientCost > 0
          ? String(variablePeriod.ingredientCost)
          : "",
      );

      if (autoSalary > 0) {
        setStaffSalaryInput(String(autoSalary));
      } else {
        setStaffSalaryInput(
          variablePeriod.salaryCost > 0
            ? String(variablePeriod.salaryCost)
            : "",
        );
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [variablePeriod, autoSalary, expenseBaseDate, expenseCycle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fixedCost) {
        setRentInput("");
        setUtilitiesInput("");
        return;
      }
      setRentInput(fixedCost.rent > 0 ? String(fixedCost.rent) : "");
      setUtilitiesInput(
        fixedCost.utilityCost > 0 ? String(fixedCost.utilityCost) : "",
      );
    }, 0);

    return () => clearTimeout(timer);
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

  const saveSales = async () => {
    setSalesSaveSuccess(false);
    setSalesSaveError("");

    const validationError =
      salesCycle === "hourly"
        ? validateSalesSave(
            salesTotalInput,
            hourlyInputs.map((input) => toNumber(input)),
          )
        : validateSalesSave(salesTotalInput);
    if (validationError) {
      setSalesSaveError(validationError);
      return;
    }

    try {
      await createSalesMutation.mutateAsync({
        saleDate: salesBaseDate,
        cycleType: toBackendCycle(salesCycle),
        totalAmount: salesTotalInput,
        hourlySales:
          salesCycle === "hourly" ? buildHourlySales(hourlyInputs) : undefined,
      });
      setSalesSaveSuccess(true);
    } catch (error) {
      setSalesSaveError(
        error instanceof Error ? error.message : "매출 저장에 실패했습니다.",
      );
    }
  };

  const removeSales = async () => {
    if (!window.confirm("해당 매출 데이터를 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteSalesMutation.mutateAsync({
        cycleType: toBackendCycle(salesCycle),
        baseDate: salesBaseDate,
      });

      setSalesAmountInput("");
      setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));

      setSalesSaveSuccess(false);
      setSalesSaveError("");
    } catch (error) {
      setSalesSaveError(
        error instanceof Error ? error.message : "매출 삭제에 실패했습니다.",
      );
    }
  };

  const saveVariable = async () => {
    setVariableSaveSuccess(false);
    setVariableSaveError("");

    const staffSalary = toNumber(staffSalaryInput);
    const ingredientCost = toNumber(ingredientCostInput);
    const validationError = validateVariableSave(staffSalary, ingredientCost);
    if (validationError) {
      setVariableSaveError(validationError);
      return;
    }

    try {
      await createVariableMutation.mutateAsync({
        costDate: expenseBaseDate,
        cycleType: toBackendCycle(expenseCycle),
        ingredientCost,
        salaryCost: staffSalary,
      });
      setVariableSaveSuccess(true);
    } catch (error) {
      setVariableSaveError(
        error instanceof Error ? error.message : "변동비 저장에 실패했습니다.",
      );
    }
  };

  const saveFixed = async () => {
    setFixedSaveSuccess(false);
    setFixedSaveError("");

    const rent = toNumber(rentInput);
    const utilityCost = toNumber(utilitiesInput);
    const validationError = validateFixedSave(rent, utilityCost);
    if (validationError) {
      setFixedSaveError(validationError);
      return;
    }

    try {
      await saveFixedMutation.mutateAsync({
        targetYearMonth: fixedMonth,
        rent,
        utilityCost,
      });
      setFixedSaveSuccess(true);
    } catch (error) {
      setFixedSaveError(
        error instanceof Error ? error.message : "고정비 저장에 실패했습니다.",
      );
    }
  };

  const isSavingSales = createSalesMutation.isPending;
  const isSavingVariable = createVariableMutation.isPending;
  const isSavingFixed = saveFixedMutation.isPending;

  const periodRangeLabel = (start?: string, end?: string) =>
    start && end ? `${start} ~ ${end}` : "-";

  return (
    <S.Section>
      <S.SectionTitle>매출 입력</S.SectionTitle>

      <SectionSaveFeedback
        label="매출 입력"
        showSuccess={salesSaveSuccess}
        error={salesSaveError}
        onGoToCheck={onGoToCheck}
      />

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
              {/* <option value="weekly">한주</option> */}
              {/* <option value="monthly">한달</option> */}
              {/* A주석 END: 한주·한달 */}
            </S.Select>
          </S.Row>
          {salesCycle === "weekly" && (
            <ScopeNotice $variant="info">
              「한주」로 저장한 매출·지출은 매출 확인의 첫째주·둘째주… 주간
              요약에 표시됩니다. 일별 칸에는 넣지 않습니다.
            </ScopeNotice>
          )}
          {salesCycle === "monthly" && (
            <ScopeNotice $variant="info">
              「한달」로 저장한 매출·지출은 매출 확인 상단의{" "}
              {Number(salesSelectedMonth.slice(5, 7))}월 매출·지출·순이익 합계에
              포함됩니다. 일별 칸에는 넣지 않습니다.
            </ScopeNotice>
          )}
          {!reflectsOnSalesCheck(salesCycle) && (
            <ScopeNotice $variant="warn">
              이 주기는 매출 확인에 반영되지 않을 수 있습니다.
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
          <div style={{ display: "flex", gap: 8 }}>
            <S.SaveButton
              type="button"
              onClick={saveSales}
              disabled={isSavingSales}
            >
              매출 저장
            </S.SaveButton>

            <S.SaveButton
              type="button"
              onClick={removeSales}
              disabled={deleteSalesMutation.isPending}
            >
              매출 삭제
            </S.SaveButton>
          </div>
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
          <SectionSaveFeedback
            label="변동비"
            showSuccess={variableSaveSuccess}
            error={variableSaveError}
            onGoToCheck={onGoToCheck}
          />

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
                  {/* <option value="weekly">한주</option> */}
                  {/* <option value="monthly">한달</option> */}
                  {/* A주석 END: 변동비 한주·한달 */}
                </S.Select>
              </S.Row>
              {expenseCycle === "weekly" && (
                <ScopeNotice $variant="info">
                  「한주」 변동비는 매출 확인의 주간 요약(첫째주·둘째주…)에
                  표시됩니다.
                </ScopeNotice>
              )}
              {expenseCycle === "monthly" && (
                <ScopeNotice $variant="info">
                  「한달」 변동비는 매출 확인 상단 월 합계에 포함됩니다.
                </ScopeNotice>
              )}
              {!reflectsOnSalesCheck(expenseCycle) && (
                <ScopeNotice $variant="warn">
                  이 주기는 매출 확인에 반영되지 않을 수 있습니다.
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
                <S.PickerHint>
                  서버에서 변동비 데이터를 불러오는 중...
                </S.PickerHint>
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
                disabled={isSavingVariable}
              >
                변동비 저장/수정
              </S.SaveButton>
            </S.Panel>
          )}

          <SectionSaveFeedback
            label="고정비"
            showSuccess={fixedSaveSuccess}
            error={fixedSaveError}
            onGoToCheck={onGoToCheck}
          />

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
                <S.PickerHint>
                  서버에서 고정비 데이터를 불러오는 중...
                </S.PickerHint>
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
                disabled={isSavingFixed}
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
