import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
`;

export const UploadBox = styled.div`
  border: 2px dashed #cbd5e1;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  input[type="file"] {
    display: none;
  }
`;

export const FileLabel = styled.label`
  background: #7ea0b7;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s ease;

  &:hover {
    background: #6689a1;
  }
`;

export const FileName = styled.p`
  font-size: 14px;
  color: #64748b;
`;

export const StatusBadge = styled.div<{
  $status: "idle" | "loading" | "success" | "error";
}>`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;

  ${({ $status }) =>
    $status === "loading" &&
    css`
      background: #fef9e7;
      color: #9a6700;
      border: 1px solid #f5e2a8;
    `}

  ${({ $status }) =>
    $status === "success" &&
    css`
      background: #eef6f2;
      color: #2c6e52;
      border: 1px solid #cce5d9;
    `}

  ${({ $status }) =>
    $status === "error" &&
    css`
      background: #fdf2f2;
      color: #a63a3a;
      border: 1px solid #f3d2d2;
    `}
`;

export const ResultSummary = styled.div`
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
`;

export const ChartWrapper = styled.div`
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  border-radius: 8px;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const CalendarTitle = styled.h4`
  margin: 0;
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
`;

export const SectionTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 15px;
  color: #1e293b;
  font-weight: 600;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const ButtonWrapper = styled.div`
  width: 90px;
  height: 34px;
`;

export const EmptyDataBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 220px;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  border: 1px dashed #cbd5e1;
`;

export const FlexRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ChartPane = styled.div`
  flex: 1.3;
  width: 100%;
  min-width: 0;
`;

export const InsightPane = styled.div`
  flex: 0.7;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SidebarTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
`;

export const PresetGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const PresetButton = styled.button`
  flex: 1;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

export const InsightCard = styled.button<{
  $type: "peak" | "idle";
  $active?: boolean;
}>`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  background: ${({ $type, $active }) =>
    $type === "peak"
      ? $active
        ? "#f7eedc"
        : "#fbf6eb"
      : $active
        ? "#f0f5f8"
        : "#ffffff"};
  border: 1px solid
    ${({ $type, $active }) =>
      $type === "peak"
        ? $active
          ? "#dfc496"
          : "#eadbc0"
        : $active
          ? "#7ea0b7"
          : "#e2e8f0"};
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ $type }) => ($type === "peak" ? "#f9f2e3" : "#f8fafc")};
    border-color: ${({ $type }) => ($type === "peak" ? "#dfc496" : "#94a3b8")};
  }

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    margin-bottom: 4px;
    color: ${({ $type }) => ($type === "peak" ? "#4f738e" : "#475569")};

    &::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ $type }) => ($type === "peak" ? "#4f738e" : "#94a3b8")};
      flex-shrink: 0;
    }
  }

  .value {
    color: #334155;
    font-weight: 500;
    padding-left: 12px;
  }
`;

export const HeatmapContainer = styled.div`
  width: 100%;
  padding: 10px 0;
`;

export const DonutContainer = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 320px;
`;

export const DonutCenterText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
  padding: 0 12px;

  .total-amount {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
  }
  .label {
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin-top: 3px;
  }
`;
