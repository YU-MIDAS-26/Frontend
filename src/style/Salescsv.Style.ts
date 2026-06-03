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
  background: #3b82f6;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
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
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  text-align: center;

  ${({ $status }) =>
    $status === "loading" &&
    css`
      background: #fef3c7;
      color: #d97706;
    `}

  ${({ $status }) =>
    $status === "success" &&
    css`
      background: #dcfce7;
      color: #15803d;
    `}

  ${({ $status }) =>
    $status === "error" &&
    css`
      background: #fee2e2;
      color: #b91c1c;
    `}
`;

export const ResultSummary = styled.div`
  background: #f1f5f9;
  padding: 16px;
  border-radius: 6px;
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
  min-width: 0; /* Recharts/Echarts 내부 찌그러짐 방지용 꿀팁 */
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
  border: 1px solid #f1f5f9;
`;

export const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SidebarTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
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

export const InsightCard = styled.div<{ $type: "peak" | "idle" }>`
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  background: ${({ $type }) => ($type === "peak" ? "#fff5f5" : "#f0fdf4")};
  border-left: 4px solid
    ${({ $type }) => ($type === "peak" ? "#ef4444" : "#22c55e")};

  .label {
    font-weight: 700;
    margin-bottom: 4px;
    color: ${({ $type }) => ($type === "peak" ? "#991b1b" : "#166534")};
  }
  .value {
    color: #475569;
    font-weight: 500;
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
  inset: 0;
  display: flex;
  flex-direction: column;
  items-center: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;

  .total-amount {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }
  .label {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }
`;
