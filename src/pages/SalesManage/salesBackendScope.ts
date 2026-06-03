import type { ExpenseCycle, SalesCycle } from "./salesData";

/**
 * 백엔드 현재 지원 범위 + A주석 일괄 해제용 플래그
 *
 * BACK3: costs GET(period/fixed) 없음 → 조회 false, POST는 sales_api mutation 그대로.
 * 매출 확인 표시: DAILY/HOURLY → 일별 칸, WEEKLY → 주간 요약, MONTHLY → 월 상단 합계
 */
export const A_SCOPE = {
  /** POST/GET period — 하루·한주·한달·시간별 매출 입력·조회 */
  salesPeriodApi: true,
  /** GET period / POST variable — BACK3는 POST만 지원 */
  variablePeriodApi: false,
  /** GET fixed / POST fixed — BACK3는 POST만 지원 */
  fixedCostApi: false,
  /** finance/calendar·daily — 일·시간별 집계 (매출 확인 캘린더) */
  financeDailyHourlyCalendar: true,
  /** period API로 WEEKLY/MONTHLY를 주간·월 합계 영역에 반영 */
  calendarWeeklyMonthly: true,
  /** 매출 확인 — 주간 합계 사이드 버튼 UI */
  checkWeekSummaryUi: true,
  /** ai-insight 보고서 */
  aiInsightReport: true,
  /** GET /api/finance/forecast — BACK3 미제공 */
  financeForecastApi: false,
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
    "매출 확인: 하루·시간별은 일별 칸, 한주는 주간 요약, 한달은 월 상단 합계에 표시됩니다.",
  savedPeriodOnly:
    "저장되었습니다. 주기별 데이터는 period API 기준으로 반영됩니다.",
  savedCalendar:
    "저장되었습니다. 매출 확인에 반영됩니다(한주: 주간 요약, 한달: 월 합계).",
  back3NoCostRead:
    "변동비·고정비는 저장 후 매출 확인 캘린더에 반영됩니다. 이 화면에서는 서버에서 기존 값을 불러오지 않습니다.",
  back3WeekExpenseFromCalendar:
    "주간 지출은 해당 주 일별 캘린더 지출 합계로 표시됩니다.",
} as const;
