import styled from "styled-components";

export const MonthSummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MonthStatCard = styled.div<{
  $tone: "sales" | "expense" | "profit";
}>`
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid
    ${(p) =>
      p.$tone === "sales"
        ? "#b8d4e8"
        : p.$tone === "expense"
          ? "#e8c9b8"
          : "#b8e0c6"};
  background: ${(p) =>
    p.$tone === "sales"
      ? "#eef6fc"
      : p.$tone === "expense"
        ? "#fdf4ef"
        : "#effaf3"};
`;

export const MonthStatLabel = styled.div`
  font-size: 12px;
  color: #444;
  margin-bottom: 4px;
`;

export const MonthStatValue = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #111;
`;

export const WeekRowWrap = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 10px;
  margin-bottom: 10px;
  align-items: start;
`;

export const WeekSidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const WeekToggleBtn = styled.button<{ $expanded: boolean }>`
  width: 100%;
  background: transparent;
  border: none;
  color: ${(p) => (p.$expanded ? "#2563eb" : "#94a3b8")};
  border-radius: 0;
  padding: 4px 0;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  line-height: 1.4;
`;

export const WeekSummaryBox = styled.div`
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 8px;
  background: #fafbfd;
  font-size: 11px;
  line-height: 1.5;
  color: #202020;
`;

export const SyncBanner = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #e9f5ec;
  border: 1px solid #b8dcc4;
  color: #1a3d28;
  font-size: 13px;
  line-height: 1.45;
`;

export const TabPanel = styled.div<{ $hidden: boolean }>`
  display: ${(p) => (p.$hidden ? "none" : "block")};
`;

export const ScopeNotice = styled.div<{ $variant?: "info" | "warn" }>`
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: ${(p) => (p.$variant === "warn" ? "#5c3d12" : "#1a3d4d")};
  background: ${(p) => (p.$variant === "warn" ? "#fff8e6" : "#eef6fc")};
  border: 1px solid
    ${(p) => (p.$variant === "warn" ? "#e8d4a8" : "#b8d4e8")};
`;
