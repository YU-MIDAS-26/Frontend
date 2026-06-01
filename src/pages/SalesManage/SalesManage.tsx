import { useState, useEffect, useCallback } from "react";
import SalesCheck from "./SalesCheck";
import SalesInput from "./SalesInput";
import SalesCSV from "./SalesCSV";
import SalesReport from "./SalesReport";
// import SalesFuture from "./SalesFuture";
import * as S from "../../style/SalesManage.Style";
import { TabPanel, ScopeNotice } from "./salesManageUi";
import { EMPLOYEE_AUTO_KEY } from "./salesData";
import { A_SCOPE } from "./salesBackendScope";

type SalesTab = "check" | "input-csv" | "input" | "report";

export default function SalesManage() {
  const [activeTab, setActiveTab] = useState<SalesTab>("check");
  const [autoSalary, setAutoSalary] = useState(0);
  const [financeRefreshKey, setFinanceRefreshKey] = useState(0);

  const onFinanceUpdated = useCallback(() => {
    setFinanceRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedFixed = parse<FixedExpenseMap>(
        localStorage.getItem(FIX_KEY),
        {},
      );
      setFixedMap(savedFixed);

      const auto = Number(localStorage.getItem(EMPLOYEE_AUTO_KEY) ?? "0");
      if (Number.isFinite(auto) && auto > 0) {
        setAutoSalary(auto);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
            $active={activeTab === "input-csv"}
            onClick={() => setActiveTab("input-csv")}
          >
            매출 입력 - CSV
          </S.MenuButton>

          <S.MenuButton
            type="button"
            $active={activeTab === "input"}
            onClick={() => setActiveTab("input")}
          >
            매출 입력 - 수기
          </S.MenuButton>

          <S.MenuButton
            type="button"
            $active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
          >
            보고서 확인
          </S.MenuButton>
          {/* A주석 BEGIN: 추후 예상 매출 — GET /api/finance/forecast API 제공 후 탭 추가
          <S.MenuButton type="button" $active={activeTab === "future"} onClick={() => setActiveTab("future")}>
            추후 예상 매출
          </S.MenuButton>
          A주석 END */}
        </S.Sidebar>

        <S.Content>
          {activeTab === "check" && <SalesCheck />}

          {activeTab === "input-csv" && <SalesCSV />}

          {activeTab === "input" && (
            <SalesInput
              fixedMap={fixedMap}
              autoSalary={autoSalary}
              onUpdateFixed={updateFixed}
            />
          )}

          {activeTab === "report" && <SalesReport />}
          {/* {activeTab === "future" && <SalesFuture />} */}
        </S.Content>
      </S.Layout>
    </S.Page>
  );
}
