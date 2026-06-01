// salescsv.style.ts
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

  h4 {
    margin-bottom: 16px;
    color: #1e293b;
  }
`;
