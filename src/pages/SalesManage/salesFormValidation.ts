/** 저장 전 금액 검증 (음수만 거부, UI 변경 없이 메시지 문자열만 반환) */
export function validateNonNegativeAmounts(
  amounts: number[],
  fieldLabel: string,
): string | null {
  if (amounts.some((v) => v < 0)) {
    return `${fieldLabel}은(는) 0 이상이어야 합니다.`;
  }
  return null;
}

export function validateSalesSave(
  total: number,
  hourlyTotals?: number[],
): string | null {
  if (hourlyTotals) {
    return validateNonNegativeAmounts(hourlyTotals, "시간대별 매출");
  }
  return validateNonNegativeAmounts([total], "매출 금액");
}

export function validateVariableSave(
  staffSalary: number,
  ingredientCost: number,
): string | null {
  return validateNonNegativeAmounts(
    [staffSalary, ingredientCost],
    "변동비",
  );
}

export function validateFixedSave(rent: number, utilities: number): string | null {
  return validateNonNegativeAmounts([rent, utilities], "고정비");
}
