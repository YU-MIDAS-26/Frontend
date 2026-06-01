import { useState, useEffect, useCallback } from "react";
import SalesCheck from "./SalesCheck";
import SalesInput from "./SalesInput";
import SalesReport from "./SalesReport";
import * as S from "../../style/SalesManage.Style";
import { TabPanel, ScopeNotice } from "./salesManageUi";
import { EMPLOYEE_AUTO_KEY } from "./salesData";
import { A_SCOPE } from "./salesBackendScope";

type SalesTab = "check" | "input" | "report";

export default function SalesManage() {
  const [activeTab, setActiveTab] = useState<SalesTab>("check");
  const [autoSalary, setAutoSalary] = useState(0);
  const [financeRefreshKey, setFinanceRefreshKey] = useState(0);

  const onFinanceUpdated = useCallback(() => {
    setFinanceRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const auto = Number(localStorage.getItem(EMPLOYEE_AUTO_KEY) ?? "0");
    if (Number.isFinite(auto) && auto > 0) setAutoSalary(auto);
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
          {/* A주석 BEGIN: 추후 예상 매출 — GET /api/finance/forecast API 제공 후 탭 추가
          <S.MenuButton type="button" $active={activeTab === "future"} onClick={() => setActiveTab("future")}>
            추후 예상 매출
          </S.MenuButton>
          A주석 END */}
        </S.Sidebar>
        <S.Content>
          <ScopeNotice $variant="info">
            연동 범위: 매출·변동비·고정비 저장/period 조회
            {A_SCOPE.financeDailyHourlyCalendar && " · 매출 확인(일·시간)"}
            {A_SCOPE.aiInsightReport && " · AI 보고서"}
            {!A_SCOPE.calendarWeeklyMonthly &&
              " · 한주/한달 캘린더 표시는 백엔드 확장 후 (salesBackendScope.ts A주석 참고)"}
          </ScopeNotice>
          <TabPanel $hidden={activeTab !== "check"}>
            <SalesCheck
              isActive={activeTab === "check"}
              refreshKey={financeRefreshKey}
            />
          </TabPanel>
          <TabPanel $hidden={activeTab !== "input"}>
            <SalesInput
              autoSalary={autoSalary}
              onFinanceUpdated={onFinanceUpdated}
              onGoToCheck={() => setActiveTab("check")}
            />
          </TabPanel>
          <TabPanel $hidden={activeTab !== "report"}>
            <SalesReport
              isActive={activeTab === "report"}
              refreshKey={financeRefreshKey}
            />
          </TabPanel>
        </S.Content>
      </S.Layout>
    </S.Page>
  );
}
