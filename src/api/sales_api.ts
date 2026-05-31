import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ExpenseCycle, SalesCycle } from "../pages/SalesManage/salesData";
import { HOUR_SLOTS } from "../pages/SalesManage/salesData";

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

export const salesQueryKeys = {
  calendar: (yearMonth: string) => ["finance", "calendar", yearMonth] as const,
  daily: (date: string) => ["finance", "daily", date] as const,
  aiInsight: (yearMonth: string) => ["finance", "ai-insight", yearMonth] as const,
  forecast: (yearMonth: string) => ["finance", "forecast", yearMonth] as const,
};

export const toBackendCycle = (cycle: SalesCycle | ExpenseCycle): BackendCycleType =>
  cycle.toUpperCase() as BackendCycleType;

export const toYearMonth = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

const unwrap = <T,>(response: { data: ApiResponse<T> }) => response.data.data;

export async function createSales(payload: CreateSalesPayload) {
  const response = await apiClient.post<ApiResponse<number>>("/api/sales", payload);
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
  const response = await apiClient.get<ApiResponse<DailyDetail>>("/api/finance/daily", {
    params: { date },
  });
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

export function buildHourlySales(hourlyInputs: string[]) {
  return HOUR_SLOTS.map((saleHour, index) => ({
    saleHour,
    amount: Number(hourlyInputs[index]?.replace(/,/g, "").trim() || "0") || 0,
  }));
}

export function useCalendarData(yearMonth: string) {
  return useQuery({
    queryKey: salesQueryKeys.calendar(yearMonth),
    queryFn: () => getCalendarData(yearMonth),
  });
}

export function useDailyDetail(date: string) {
  return useQuery({
    queryKey: salesQueryKeys.daily(date),
    queryFn: () => getDailyDetail(date),
    enabled: Boolean(date),
  });
}

export function useAiInsight(yearMonth: string, enabled = true) {
  return useQuery({
    queryKey: salesQueryKeys.aiInsight(yearMonth),
    queryFn: () => getAiInsight(yearMonth),
    enabled,
  });
}

export function useForecast(yearMonth: string) {
  return useQuery({
    queryKey: salesQueryKeys.forecast(yearMonth),
    queryFn: () => getForecast(yearMonth),
  });
}

export function useCreateSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSales,
    onSuccess: (_data, variables) => {
      const yearMonth = variables.saleDate.slice(0, 7);
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.calendar(yearMonth) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.daily(variables.saleDate) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.aiInsight(yearMonth) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.forecast(yearMonth) });
    },
  });
}

export function useCreateVariableCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVariableCost,
    onSuccess: (_data, variables) => {
      const yearMonth = variables.costDate.slice(0, 7);
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.calendar(yearMonth) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.daily(variables.costDate) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.aiInsight(yearMonth) });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.forecast(yearMonth) });
    },
  });
}

export function useSaveFixedCost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveFixedCost,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: salesQueryKeys.calendar(variables.targetYearMonth),
      });
      queryClient.invalidateQueries({
        queryKey: salesQueryKeys.aiInsight(variables.targetYearMonth),
      });
      queryClient.invalidateQueries({
        queryKey: salesQueryKeys.forecast(variables.targetYearMonth),
      });
      queryClient.invalidateQueries({ queryKey: ["finance", "daily"] });
    },
  });
}
