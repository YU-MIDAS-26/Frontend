/** 고정비 월 합계 — BACK3 GET 없이 프론트 localStorage (일할 표시용) */

export type StoredFixedCost = {
  targetYearMonth: string;
  rent: number;
  utilityCost: number;
  totalCost: number;
};

const KEY_PREFIX = "bsight_fixed_cost";

function storageKey(yearMonth: string) {
  const userId = localStorage.getItem("userId") ?? "guest";
  return `${KEY_PREFIX}_${userId}_${yearMonth}`;
}

export function getStoredFixedCost(yearMonth: string): StoredFixedCost | null {
  try {
    const raw = localStorage.getItem(storageKey(yearMonth));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredFixedCost;
    if (!parsed?.targetYearMonth) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredFixedCost(data: StoredFixedCost) {
  localStorage.setItem(storageKey(data.targetYearMonth), JSON.stringify(data));
}
