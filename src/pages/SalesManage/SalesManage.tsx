import { useState, useEffect } from "react";
import SalesCheck from "./SalesCheck";
import SalesInput from "./SalesInput";
import SalesCSV from "./SalesCSV";
import SalesReport from "./SalesReport";
// import SalesFuture from "./SalesFuture";
import * as S from "../../style/SalesManage.Style";
import { FIX_KEY, EMPLOYEE_AUTO_KEY, parse } from "./salesData";
import type { FixedExpenseMap } from "./salesData";

type SalesTab = "check" | "input-csv" | "input" | "report";

export default function SalesManage() {
  const [activeTab, setActiveTab] = useState<SalesTab>("check");
  const [fixedMap, setFixedMap] = useState<FixedExpenseMap>({});
  const [autoSalary, setAutoSalary] = useState(0);

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
            $active={activeTab === "input-csv"}
            onClick={() => setActiveTab("input-csv")}
          >
            매출 입력 - CSV
          </S.MenuButton>

          {/* 2. 기존 매출 입력을 '수기'로 명칭만 변경 */}
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
          {/* 추후 예상 매출 - 백엔드 API 미제공
          <S.MenuButton type="button" $active={activeTab === "future"} onClick={() => setActiveTab("future")}>
            추후 예상 매출
          </S.MenuButton>
          */}
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
