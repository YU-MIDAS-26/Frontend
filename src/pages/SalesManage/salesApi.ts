/**
 * 매출 관리 API (백엔드 연동)
 * - 저장: POST sales, costs/variable, costs/fixed
 * - 입력 조회: GET sales/period, costs/variable/period, costs/fixed
 * - 매출 확인: GET finance/calendar, finance/daily (DAILY·HOURLY 집계)
 * - 보고서: GET finance/ai-insight
 * 범위 플래그: salesBackendScope.ts (A주석)
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import type { ExpenseCycle, SalesCycle } from "./salesData";
import { HOUR_SLOTS, yearMonthsForBaseDate } from "./salesData";

type ApiResponse<T> = { status: string; message: string; data: T };
export type BackendCycle = "MONTHLY" | "WEEKLY" | "DAILY" | "HOURLY";

export type CalendarDay = {
  date: string;
  dailySales: number;
  dailyExpense: number;
  dailyProfit: number;
};
export type DailyDetail = {
  totalSales: number;
  totalExpense: number;
  variableCost: number;
  fixedCost: number;
  netProfit: number;
  hourlySales: { hour: string; amount: number }[];
};
export type AiInsight = {
  coreSummary: string;
  financeSummary: string;
  recommendations: string[];
  salesFlow: string;
  additionalInsight: string;
};
export type PeriodSales = {
  cycleType: BackendCycle;
  baseDate: string;
  periodStartDate: string;
  periodEndDate: string;
  totalAmount: number;
  hourlySales: { hour: string; amount: number }[];
};
export type PeriodVariable = {
  cycleType: BackendCycle;
  baseDate: string;
  periodStartDate: string;
  periodEndDate: string;
  ingredientCost: number;
  salaryCost: number;
  totalCost: number;
};
export type FixedCost = {
  targetYearMonth: string;
  rent: number;
  utilityCost: number;
  totalCost: number;
};

const unwrap = <T,>(r: { data: ApiResponse<T> }) => r.data.data;
export const toYearMonth = (y: number, m: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}`;
export const toBackendCycle = (c: SalesCycle | ExpenseCycle): BackendCycle =>
  c.toUpperCase() as BackendCycle;

export const getCalendar = (yearMonth: string) =>
  apiClient
    .get<ApiResponse<CalendarDay[]>>("/api/finance/calendar", { params: { yearMonth } })
    .then(unwrap);

export const getDaily = (date: string) =>
  apiClient
    .get<ApiResponse<DailyDetail>>("/api/finance/daily", { params: { date } })
    .then(unwrap);

export const getAiInsight = (yearMonth: string) =>
  apiClient
    .get<ApiResponse<AiInsight>>("/api/finance/ai-insight", { params: { yearMonth } })
    .then(unwrap);

export const getSalesPeriod = (cycleType: BackendCycle, baseDate: string) =>
  apiClient
    .get<ApiResponse<PeriodSales>>("/api/sales/period", {
      params: { cycleType, baseDate },
    })
    .then(unwrap);

export const getVariablePeriod = (cycleType: BackendCycle, baseDate: string) =>
  apiClient
    .get<ApiResponse<PeriodVariable>>("/api/costs/variable/period", {
      params: { cycleType, baseDate },
    })
    .then(unwrap);

export const getFixedCost = (yearMonth: string) =>
  apiClient
    .get<ApiResponse<FixedCost>>("/api/costs/fixed", { params: { yearMonth } })
    .then(unwrap);

export const postSales = (body: {
  saleDate: string;
  cycleType: BackendCycle;
  totalAmount: number;
  hourlySales?: { saleHour: string; amount: number }[];
}) => apiClient.post<ApiResponse<number>>("/api/sales", body).then(unwrap);

export const postVariable = (body: {
  costDate: string;
  cycleType: BackendCycle;
  ingredientCost: number;
  salaryCost: number;
}) => apiClient.post<ApiResponse<number>>("/api/costs/variable", body).then(unwrap);

export const postFixed = (body: {
  targetYearMonth: string;
  rent: number;
  utilityCost: number;
}) => apiClient.post<ApiResponse<number>>("/api/costs/fixed", body).then(unwrap);

export const buildHourlySales = (inputs: string[]) =>
  HOUR_SLOTS.map((saleHour, i) => ({
    saleHour,
    amount: Number(inputs[i]?.replace(/,/g, "") || 0) || 0,
  }));

export const financeKeys = {
  cal: (ym: string) => ["sm-cal", ym] as const,
  daily: (d: string) => ["sm-daily", d] as const,
  ai: (ym: string) => ["sm-ai", ym] as const,
  salesPeriod: (cycle: BackendCycle, base: string) =>
    ["sm-sales-period", cycle, base] as const,
  varPeriod: (cycle: BackendCycle, base: string) =>
    ["sm-var-period", cycle, base] as const,
  fixed: (ym: string) => ["sm-fixed", ym] as const,
};

const queryDefaults = {
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
};

/** 저장 후 매출 확인·보고서·입력 폼이 즉시 반영되도록 관련 쿼리를 모두 다시 불러옵니다. */
export async function refreshFinanceAfterChange(
  qc: QueryClient,
  input:
    | { baseDate: string; cycleType: BackendCycle }
    | { yearMonth: string },
) {
  const yearMonths =
    "yearMonth" in input
      ? [input.yearMonth]
      : yearMonthsForBaseDate(input.cycleType, input.baseDate);

  const tasks: Promise<unknown>[] = [];

  for (const ym of yearMonths) {
    tasks.push(
      qc.refetchQueries({ queryKey: financeKeys.cal(ym), type: "all" }),
      qc.refetchQueries({ queryKey: financeKeys.ai(ym), type: "all" }),
    );
  }

  if ("baseDate" in input) {
    const { baseDate, cycleType } = input;
    tasks.push(
      qc.refetchQueries({
        queryKey: financeKeys.salesPeriod(cycleType, baseDate),
        type: "all",
      }),
      qc.refetchQueries({
        queryKey: financeKeys.daily(baseDate),
        type: "all",
      }),
    );
    if (cycleType !== "HOURLY") {
      tasks.push(
        qc.refetchQueries({
          queryKey: financeKeys.varPeriod(cycleType, baseDate),
          type: "all",
        }),
      );
    }
  }

  if ("yearMonth" in input) {
    tasks.push(
      qc.refetchQueries({
        queryKey: financeKeys.fixed(input.yearMonth),
        type: "all",
      }),
    );
  }

  tasks.push(qc.refetchQueries({ queryKey: ["sm-daily"], type: "all" }));

  await Promise.all(tasks);
}

export const useCalendar = (yearMonth: string, enabled = true) =>
  useQuery({
    queryKey: financeKeys.cal(yearMonth),
    queryFn: () => getCalendar(yearMonth),
    enabled: !!yearMonth && enabled,
    ...queryDefaults,
    refetchOnMount: "always",
  });

export const useDaily = (date: string, enabled = true) =>
  useQuery({
    queryKey: financeKeys.daily(date),
    queryFn: () => getDaily(date),
    enabled: !!date && enabled,
    ...queryDefaults,
    refetchOnMount: "always",
  });

export const useAiInsight = (yearMonth: string, enabled = true) =>
  useQuery({
    queryKey: financeKeys.ai(yearMonth),
    queryFn: () => getAiInsight(yearMonth),
    enabled: !!yearMonth && enabled,
    ...queryDefaults,
    refetchOnMount: "always",
  });

export const useSalesPeriod = (cycle: SalesCycle, baseDate: string) => {
  const cycleType = toBackendCycle(cycle);
  return useQuery({
    queryKey: financeKeys.salesPeriod(cycleType, baseDate),
    queryFn: () => getSalesPeriod(cycleType, baseDate),
    enabled: !!baseDate,
    ...queryDefaults,
    refetchOnMount: "always",
  });
};

export const useVariablePeriod = (cycle: ExpenseCycle, baseDate: string) => {
  const cycleType = toBackendCycle(cycle);
  return useQuery({
    queryKey: financeKeys.varPeriod(cycleType, baseDate),
    queryFn: () => getVariablePeriod(cycleType, baseDate),
    enabled: !!baseDate,
    ...queryDefaults,
    refetchOnMount: "always",
  });
};

export const useFixedCost = (yearMonth: string) =>
  useQuery({
    queryKey: financeKeys.fixed(yearMonth),
    queryFn: () => getFixedCost(yearMonth),
    enabled: !!yearMonth,
    ...queryDefaults,
    refetchOnMount: "always",
  });

export const usePostSales = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postSales,
    onSuccess: async (_, v) => {
      await refreshFinanceAfterChange(qc, {
        baseDate: v.saleDate,
        cycleType: v.cycleType,
      });
    },
  });
};

export const usePostVariable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postVariable,
    onSuccess: async (_, v) => {
      await refreshFinanceAfterChange(qc, {
        baseDate: v.costDate,
        cycleType: v.cycleType,
      });
    },
  });
};

export const usePostFixed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postFixed,
    onSuccess: async (_, v) => {
      await refreshFinanceAfterChange(qc, { yearMonth: v.targetYearMonth });
    },
  });
};
