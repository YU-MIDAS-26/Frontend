import { useState, useEffect, useMemo } from "react";
import * as S from "../../style/SalesManage.Style";
import type { SalesEntry, VariableExpenseEntry, FixedExpenseMap, SalesCycle, ExpenseCycle } from "./salesData";
import { HOUR_SLOTS, toWon, toNumber, today } from "./salesData";

interface Props {
  salesEntries: SalesEntry[];
  variableEntries: VariableExpenseEntry[];
  fixedMap: FixedExpenseMap;
  autoSalary: number;
  onUpdateSales: (entries: SalesEntry[]) => void;
  onUpdateVariable: (entries: VariableExpenseEntry[]) => void;
  onUpdateFixed: (map: FixedExpenseMap) => void;
}

export default function SalesInput({
  salesEntries,
  variableEntries,
  fixedMap,
  autoSalary,
  onUpdateSales,
  onUpdateVariable,
  onUpdateFixed,
}: Props) {
  const [salesOpen, setSalesOpen] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(true);
  const [variableOpen, setVariableOpen] = useState(true);
  const [fixedOpen, setFixedOpen] = useState(false);

  const [salesDate, setSalesDate] = useState(today());
  const [salesCycle, setSalesCycle] = useState<SalesCycle>("daily");
  const [salesAmountInput, setSalesAmountInput] = useState("");
  const [hourlyInputs, setHourlyInputs] = useState<string[]>(
    Array.from({ length: HOUR_SLOTS.length }, () => ""),
  );

  const [expenseDate, setExpenseDate] = useState(today());
  const [expenseCycle, setExpenseCycle] = useState<ExpenseCycle>("daily");
  const [staffSalaryInput, setStaffSalaryInput] = useState(
    autoSalary > 0 ? String(autoSalary) : "",
  );
  const [ingredientCostInput, setIngredientCostInput] = useState("");
  const [fixedMonth, setFixedMonth] = useState(today().slice(0, 7));
  const [rentInput, setRentInput] = useState("");
  const [utilitiesInput, setUtilitiesInput] = useState("");

  useEffect(() => {
    const found = salesEntries.find(
      (entry) => entry.date === salesDate && entry.cycle === salesCycle,
    );
    if (!found) {
      setSalesAmountInput("");
      setHourlyInputs(Array.from({ length: HOUR_SLOTS.length }, () => ""));
      return;
    }
    setSalesAmountInput(found.amount > 0 ? String(found.amount) : "");
    if (found.cycle === "hourly" && found.hourlyAmounts) {
      setHourlyInputs(found.hourlyAmounts.map((v) => String(v)));
    }
  }, [salesDate, salesCycle, salesEntries]);

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

  const saveSales = () => {
    const next: SalesEntry = {
      date: salesDate,
      cycle: salesCycle,
      amount: salesTotalInput,
      hourlyAmounts:
        salesCycle === "hourly"
          ? hourlyInputs.map((v) => toNumber(v))
          : undefined,
    };
    onUpdateSales([
      ...salesEntries.filter(
        (entry) => !(entry.date === salesDate && entry.cycle === salesCycle),
      ),
      next,
    ]);
  };

  const saveVariable = () => {
    const next: VariableExpenseEntry = {
      date: expenseDate,
      cycle: expenseCycle,
      staffSalary: toNumber(staffSalaryInput),
      ingredientCost: toNumber(ingredientCostInput),
      total: variableTotalInput,
    };
    onUpdateVariable([
      ...variableEntries.filter(
        (entry) =>
          !(entry.date === expenseDate && entry.cycle === expenseCycle),
      ),
      next,
    ]);
  };

  const saveFixed = () => {
    onUpdateFixed({
      ...fixedMap,
      [fixedMonth]: {
        rent: toNumber(rentInput),
        utilities: toNumber(utilitiesInput),
        total: fixedTotalInput,
      },
    });
  };

  return (
    <S.Section>
      <S.SectionTitle>매출 입력</S.SectionTitle>

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
            <S.Label>년/월/일</S.Label>
            <S.Input
              type="date"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
            />
          </S.Row>
          <S.Row>
            <S.Label>입력 주기</S.Label>
            <S.Select
              value={salesCycle}
              onChange={(e) => setSalesCycle(e.target.value as SalesCycle)}
            >
              <option value="monthly">한달</option>
              <option value="weekly">한주</option>
              <option value="daily">하루</option>
              <option value="hourly">특정 시간</option>
            </S.Select>
          </S.Row>
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
            <S.Label>저장 예정 금액</S.Label>
            <S.Value>{toWon(salesTotalInput)}원</S.Value>
          </S.Row>
          <S.SaveButton type="button" onClick={saveSales}>
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
                <S.Label>년/월/일</S.Label>
                <S.Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </S.Row>
              <S.Row>
                <S.Label>반영 주기</S.Label>
                <S.Select
                  value={expenseCycle}
                  onChange={(e) =>
                    setExpenseCycle(e.target.value as ExpenseCycle)
                  }
                >
                  <option value="monthly">한달</option>
                  <option value="weekly">한주</option>
                  <option value="daily">하루</option>
                </S.Select>
              </S.Row>
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
                <S.Label>변동비 합계</S.Label>
                <S.Value>{toWon(variableTotalInput)}원</S.Value>
              </S.Row>
              <S.SaveButton type="button" onClick={saveVariable}>
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
              <S.SaveButton type="button" onClick={saveFixed}>
                고정비 저장/수정
              </S.SaveButton>
            </S.Panel>
          )}
        </>
      )}
    </S.Section>
  );
}
