import { useState, useEffect } from "react";
import SalesCheck from "./SalesCheck";
import SalesInput from "./SalesInput";
import SalesReport from "./SalesReport";
import SalesFuture from "./SalesFuture";
import * as S from "../../style/SalesManage.Style";
import type { SalesEntry, VariableExpenseEntry, FixedExpenseMap } from "./salesData";
import { SALES_KEY, VAR_KEY, FIX_KEY, EMPLOYEE_AUTO_KEY, parse } from "./salesData";

type SalesTab = "check" | "input" | "report" | "future";

export default function SalesManage() {
  const [activeTab, setActiveTab] = useState<SalesTab>("check");
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [variableEntries, setVariableEntries] = useState<
    VariableExpenseEntry[]
  >([]);
  const [fixedMap, setFixedMap] = useState<FixedExpenseMap>({});
  const [autoSalary, setAutoSalary] = useState(0);

  useEffect(() => {
    setSalesEntries(parse<SalesEntry[]>(localStorage.getItem(SALES_KEY), []));
    setVariableEntries(
      parse<VariableExpenseEntry[]>(localStorage.getItem(VAR_KEY), []),
    );
    setFixedMap(parse<FixedExpenseMap>(localStorage.getItem(FIX_KEY), {}));
    const auto = Number(localStorage.getItem(EMPLOYEE_AUTO_KEY) ?? "0");
    if (Number.isFinite(auto) && auto > 0) setAutoSalary(auto);
  }, []);

  const updateSales = (entries: SalesEntry[]) => {
    setSalesEntries(entries);
    localStorage.setItem(SALES_KEY, JSON.stringify(entries));
  };

  const updateVariable = (entries: VariableExpenseEntry[]) => {
    setVariableEntries(entries);
    localStorage.setItem(VAR_KEY, JSON.stringify(entries));
  };

  const updateFixed = (map: FixedExpenseMap) => {
    setFixedMap(map);
    localStorage.setItem(FIX_KEY, JSON.stringify(map));
  };

  return (
    <S.Page>
      <S.Layout>
        <S.Sidebar>
          <S.SideTitle>매출 관리</S.SideTitle>
          <S.MenuButton
            type="button"
            $active={activeTab === "check"}
            onClick={() => setActiveTab("check")}
          >
            매출 확인
          </S.MenuButton>
          <S.MenuButton
            type="button"
            $active={activeTab === "input"}
            onClick={() => setActiveTab("input")}
          >
            매출 입력
          </S.MenuButton>
          <S.MenuButton
            type="button"
            $active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
          >
            보고서 확인
          </S.MenuButton>
          <S.MenuButton
            type="button"
            $active={activeTab === "future"}
            onClick={() => setActiveTab("future")}
          >
            추후 예상 매출
          </S.MenuButton>
        </S.Sidebar>

        <S.Content>
          {activeTab === "check" && (
            <SalesCheck
              salesEntries={salesEntries}
              variableEntries={variableEntries}
              fixedMap={fixedMap}
            />
          )}
          {activeTab === "input" && (
            <SalesInput
              salesEntries={salesEntries}
              variableEntries={variableEntries}
              fixedMap={fixedMap}
              autoSalary={autoSalary}
              onUpdateSales={updateSales}
              onUpdateVariable={updateVariable}
              onUpdateFixed={updateFixed}
            />
          )}
          {activeTab === "report" && <SalesReport />}
          {activeTab === "future" && <SalesFuture />}
        </S.Content>
      </S.Layout>
    </S.Page>
  );
}
