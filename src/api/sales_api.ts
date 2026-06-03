import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "./client";
import type { ExpenseCycle, SalesCycle } from "../pages/SalesManage/salesData";
import {
  HOUR_SLOTS,
  yearMonthsForBaseDate,
} from "../pages/SalesManage/salesData";

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type BackendCycleType = "MONTHLY" | "WEEKLY" | "DAILY" | "HOURLY";

export type CalendarDaily = {
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

export type ForecastDaily = {
  date: string;
  expectedSales: number;
  expectedExpense: number;
  expectedProfit: number;
  past: boolean;
};

export type PeriodSales = {
  cycleType: BackendCycleType;
  baseDate: string;
  periodStartDate: string;
  periodEndDate: string;
  totalAmount: number;
  hourlySales: { hour: string; amount: number }[];
};

export type PeriodVariable = {
  cycleType: BackendCycleType;
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

export type CreateSalesPayload = {
  saleDate: string;
  cycleType: BackendCycleType;
  totalAmount: number;
  hourlySales?: { saleHour: string; amount: number }[];
};

export type CreateVariableCostPayload = {
  costDate: string;
  cycleType: BackendCycleType;
  ingredientCost: number;
  salaryCost: number;
};

export type SaveFixedCostPayload = {
  targetYearMonth: string;
  rent: number;
  utilityCost: number;
};

/** React Query 캐시를 계정별로 분리하기 위한 키 (AuthContext·localStorage의 userId) */
export function getFinanceQueryUserKey(): string {
  return localStorage.getItem("userId") ?? "";
}

function financeQueryKey(...parts: string[]) {
  return ["finance", getFinanceQueryUserKey(), ...parts] as const;
}

export const salesQueryKeys = {
  root: () => financeQueryKey(),
  calendar: (yearMonth: string) => financeQueryKey("calendar", yearMonth),
  daily: (date: string) => financeQueryKey("daily", date),
  aiInsight: (yearMonth: string) => financeQueryKey("ai-insight", yearMonth),
  forecast: (yearMonth: string) => financeQueryKey("forecast", yearMonth),
  salesPeriod: (cycle: BackendCycleType, base: string) =>
    financeQueryKey("sales-period", cycle, base),
  varPeriod: (cycle: BackendCycleType, base: string) =>
    financeQueryKey("var-period", cycle, base),
  fixed: (yearMonth: string) => financeQueryKey("fixed", yearMonth),
};

function useFinanceQueryEnabled(required = true) {
  const { userId } = useAuth();
  return !!userId && required;
}

export const toBackendCycle = (
  cycle: SalesCycle | ExpenseCycle,
): BackendCycleType => cycle.toUpperCase() as BackendCycleType;

export const toYearMonth = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

const queryDefaults = {
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  refetchOnMount: "always" as const,
};

export async function createSales(payload: CreateSalesPayload) {
  const response = await apiClient.post<ApiResponse<number>>(
    "/api/sales",
    payload,
  );
  return unwrap(response);
}

export async function createVariableCost(payload: CreateVariableCostPayload) {
  const response = await apiClient.post<ApiResponse<number>>(
    "/api/costs/variable",
    payload,
  );
  return unwrap(response);
}

export async function saveFixedCost(payload: SaveFixedCostPayload) {
  const response = await apiClient.post<ApiResponse<number>>(
    "/api/costs/fixed",
    payload,
  );
  return unwrap(response);
}

export async function getCalendarData(yearMonth: string) {
  const response = await apiClient.get<ApiResponse<CalendarDaily[]>>(
    "/api/finance/calendar",
    { params: { yearMonth } },
  );
  return unwrap(response);
}

export async function getDailyDetail(date: string) {
  const response = await apiClient.get<ApiResponse<DailyDetail>>(
    "/api/finance/daily",
    {
      params: { date },
    },
  );
  return unwrap(response);
}

export async function getAiInsight(yearMonth: string) {
  const response = await apiClient.get<ApiResponse<AiInsight>>(
    "/api/finance/ai-insight",
    { params: { yearMonth } },
  );
  return unwrap(response);
}

export async function getForecast(yearMonth: string) {
  const response = await apiClient.get<ApiResponse<ForecastDaily[]>>(
    "/api/finance/forecast",
    { params: { yearMonth } },
  );
  return unwrap(response);
}

export async function getSalesPeriod(
  cycleType: BackendCycleType,
  baseDate: string,
) {
  const response = await apiClient.get<ApiResponse<PeriodSales>>(
    "/api/sales/period",
    {
      params: { cycleType, baseDate },
    },
  );
  return unwrap(response);
}

export async function getVariablePeriod(
  cycleType: BackendCycleType,
  baseDate: string,
) {
  const response = await apiClient.get<ApiResponse<PeriodVariable>>(
    "/api/costs/variable/period",
    { params: { cycleType, baseDate } },
  );
  return unwrap(response);
}

export async function getFixedCost(yearMonth: string) {
  const response = await apiClient.get<ApiResponse<FixedCost>>(
    "/api/costs/fixed",
    {
      params: { yearMonth },
    },
  );
  return unwrap(response);
}

export function buildHourlySales(hourlyInputs: string[]) {
  return HOUR_SLOTS.map((saleHour, index) => ({
    saleHour,
    amount: Number(hourlyInputs[index]?.replace(/,/g, "").trim() || "0") || 0,
  }));
}

/** 저장 후 매출 확인·보고서·입력 폼이 즉시 반영되도록 관련 쿼리를 모두 다시 불러옵니다. */
export async function refreshFinanceAfterChange(
  qc: QueryClient,
  input:
    | { baseDate: string; cycleType: BackendCycleType }
    | { yearMonth: string },
) {
  const yearMonths =
    "yearMonth" in input
      ? [input.yearMonth]
      : yearMonthsForBaseDate(input.cycleType, input.baseDate);

  const tasks: Promise<unknown>[] = [];

  for (const ym of yearMonths) {
    tasks.push(
      qc.refetchQueries({ queryKey: salesQueryKeys.calendar(ym), type: "all" }),
      qc.refetchQueries({
        queryKey: salesQueryKeys.aiInsight(ym),
        type: "all",
      }),
      qc.refetchQueries({ queryKey: salesQueryKeys.forecast(ym), type: "all" }),
    );
  }

  if ("baseDate" in input) {
    const { baseDate, cycleType } = input;
    tasks.push(
      qc.refetchQueries({
        queryKey: salesQueryKeys.salesPeriod(cycleType, baseDate),
        type: "all",
      }),
      qc.refetchQueries({
        queryKey: salesQueryKeys.daily(baseDate),
        type: "all",
      }),
    );
    if (cycleType !== "HOURLY") {
      tasks.push(
        qc.refetchQueries({
          queryKey: salesQueryKeys.varPeriod(cycleType, baseDate),
          type: "all",
        }),
      );
    }
  }

  if ("yearMonth" in input) {
    tasks.push(
      qc.refetchQueries({
        queryKey: salesQueryKeys.fixed(input.yearMonth),
        type: "all",
      }),
    );
  }

  tasks.push(
    qc.refetchQueries({ queryKey: salesQueryKeys.root(), type: "all" }),
  );

  await Promise.all(tasks);
}

export function useCalendar(yearMonth: string, enabled = true) {
  const queryEnabled = useFinanceQueryEnabled(!!yearMonth && enabled);
  return useQuery({
    queryKey: salesQueryKeys.calendar(yearMonth),
    queryFn: () => getCalendarData(yearMonth),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useDaily(date: string, enabled = true) {
  const queryEnabled = useFinanceQueryEnabled(!!date && enabled);
  return useQuery({
    queryKey: salesQueryKeys.daily(date),
    queryFn: () => getDailyDetail(date),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useAiInsight(yearMonth: string, enabled = true) {
  const queryEnabled = useFinanceQueryEnabled(!!yearMonth && enabled);
  return useQuery({
    queryKey: salesQueryKeys.aiInsight(yearMonth),
    queryFn: () => getAiInsight(yearMonth),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useForecast(yearMonth: string) {
  const queryEnabled = useFinanceQueryEnabled(!!yearMonth);
  return useQuery({
    queryKey: salesQueryKeys.forecast(yearMonth),
    queryFn: () => getForecast(yearMonth),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useSalesPeriod(cycle: SalesCycle, baseDate: string) {
  const cycleType = toBackendCycle(cycle);
  const queryEnabled = useFinanceQueryEnabled(!!baseDate);
  return useQuery({
    queryKey: salesQueryKeys.salesPeriod(cycleType, baseDate),
    queryFn: () => getSalesPeriod(cycleType, baseDate),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useVariablePeriod(cycle: ExpenseCycle, baseDate: string) {
  const cycleType = toBackendCycle(cycle);
  const queryEnabled = useFinanceQueryEnabled(!!baseDate);
  return useQuery({
    queryKey: salesQueryKeys.varPeriod(cycleType, baseDate),
    queryFn: () => getVariablePeriod(cycleType, baseDate),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function useFixedCost(yearMonth: string) {
  const queryEnabled = useFinanceQueryEnabled(!!yearMonth);
  return useQuery({
    queryKey: salesQueryKeys.fixed(yearMonth),
    queryFn: () => getFixedCost(yearMonth),
    enabled: queryEnabled,
    ...queryDefaults,
  });
}

export function usePostSales() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSales,
    onSuccess: async (_data, variables) => {
      await refreshFinanceAfterChange(qc, {
        baseDate: variables.saleDate,
        cycleType: variables.cycleType,
      });
    },
  });
}

export function useDeleteSales() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      cycleType,
      baseDate,
    }: {
      cycleType: BackendCycleType;
      baseDate: string;
    }) => deleteSales(cycleType, baseDate),

    onSuccess: async (_, variables) => {
      await refreshFinanceAfterChange(qc, {
        baseDate: variables.baseDate,
        cycleType: variables.cycleType,
      });
    },
  });
}

export function usePostVariable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createVariableCost,
    onSuccess: async (_data, variables) => {
      await refreshFinanceAfterChange(qc, {
        baseDate: variables.costDate,
        cycleType: variables.cycleType,
      });
    },
  });
}

export function usePostFixed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveFixedCost,
    onSuccess: async (_data, variables) => {
      await refreshFinanceAfterChange(qc, {
        yearMonth: variables.targetYearMonth,
      });
    },
  });
}

export async function deleteSales(
  cycleType: BackendCycleType,
  baseDate: string,
) {
  const response = await apiClient.delete<ApiResponse<object>>(
    "/api/sales/period",
    {
      params: {
        cycleType,
        baseDate,
      },
    },
  );

  return unwrap(response);
}
