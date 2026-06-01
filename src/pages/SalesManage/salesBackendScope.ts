import type { ExpenseCycle, SalesCycle } from "./salesData";

/**
 * 백엔드 현재 지원 범위 + A주석 일괄 해제용 플래그
 *
 * 현재 설정은 "2번 방식"(프론트 합산 오버레이)입니다.
 * finance/calendar 에 WEEKLY/MONTHLY가 없어도 period API 값을 일별로 분배해 표시합니다.
 */
export const A_SCOPE = {
  /** POST/GET period — 하루·한주·한달·시간별 매출 입력·조회 */
  salesPeriodApi: true,
  /** POST/GET period — 하루·한주·한달 변동비 */
  variablePeriodApi: true,
  /** POST/GET fixed — 월 고정비 */
  fixedCostApi: true,
  /** finance/calendar·daily — 일·시간별 집계 (매출 확인 캘린더) */
  financeDailyHourlyCalendar: true,
  /**
   * 프론트 오버레이로 WEEKLY/MONTHLY를 캘린더에 반영
   * false로 내리면 DAILY/HOURLY만 캘린더 반영
   */
  calendarWeeklyMonthly: true,
  /** 매출 확인 — 주간 합계 사이드 버튼 UI */
  checkWeekSummaryUi: true,
  /** ai-insight 보고서 */
  aiInsightReport: true,
} as const;

/** 매출 확인 캘린더·일별 상세에 바로 반영되는 주기 */
export const calendarDisplayCycles = ["daily", "hourly"] as const;

export function reflectsOnSalesCheck(
  cycle: SalesCycle | ExpenseCycle,
): boolean {
  if (!A_SCOPE.financeDailyHourlyCalendar) return false;
  if (A_SCOPE.calendarWeeklyMonthly) return true;
  return (calendarDisplayCycles as readonly string[]).includes(cycle);
}

export const SCOPE_MESSAGES = {
  calendarLimit:
    "매출 확인 캘린더는 period API(한주/한달) 오버레이를 포함해 표시됩니다.",
  savedPeriodOnly:
    "저장되었습니다. 주기별 데이터는 period API 기준으로 반영됩니다.",
  savedCalendar: "저장되었습니다. 매출 확인 캘린더에 반영됩니다.",
} as const;
