import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import type { ExpenseCycle, SalesCycle } from "./salesData";
import { HOUR_SLOTS } from "./salesData";

type ApiResponse<T> = { status: string; message: string; data: T };
type BackendCycle = "MONTHLY" | "WEEKLY" | "DAILY" | "HOURLY";

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

const keys = {
  cal: (ym: string) => ["sm-cal", ym] as const,
  daily: (d: string) => ["sm-daily", d] as const,
  ai: (ym: string) => ["sm-ai", ym] as const,
};

export const useCalendar = (yearMonth: string) =>
  useQuery({ queryKey: keys.cal(yearMonth), queryFn: () => getCalendar(yearMonth) });

export const useDaily = (date: string) =>
  useQuery({ queryKey: keys.daily(date), queryFn: () => getDaily(date), enabled: !!date });

export const useAiInsight = (yearMonth: string) =>
  useQuery({ queryKey: keys.ai(yearMonth), queryFn: () => getAiInsight(yearMonth) });

export const usePostSales = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postSales,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: keys.cal(v.saleDate.slice(0, 7)) });
      qc.invalidateQueries({ queryKey: keys.daily(v.saleDate) });
      qc.invalidateQueries({ queryKey: keys.ai(v.saleDate.slice(0, 7)) });
    },
  });
};

export const usePostVariable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postVariable,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: keys.cal(v.costDate.slice(0, 7)) });
      qc.invalidateQueries({ queryKey: keys.daily(v.costDate) });
      qc.invalidateQueries({ queryKey: keys.ai(v.costDate.slice(0, 7)) });
    },
  });
};

export const usePostFixed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postFixed,
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: keys.cal(v.targetYearMonth) });
      qc.invalidateQueries({ queryKey: keys.ai(v.targetYearMonth) });
      qc.invalidateQueries({ queryKey: ["sm-daily"] });
    },
  });
};
