import styled from "styled-components";
import { TwoButtonAlert } from "../components/Common";

export const Page = styled.section`
  width: 620px;
  min-height: 520px;
`;

export const Title = styled.h2`
  margin: 0 0 20px;
  color: #111111;
  font-size: 22px;
  font-weight: 700;
  line-height: 32px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #dedede;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 18px;
  color: #111111;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
`;

export const ToolRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

export const LeftTools = styled.div`
  display: flex;
  align-items: center;
`;

export const SearchBox = styled.div`
  width: 180px;
  height: 40px;
`;

export const RightTools = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RoleLabel = styled.span`
  margin-right: 4px;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  white-space: nowrap;
`;

export const SmallButtonBox = styled.div`
  width: 72px;
  height: 40px;

  button {
    width: 100%;
    height: 100%;
    padding: 8px 12px;
    border-radius: 10px;
    white-space: nowrap;
  }

  span {
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
  }
`;

export const DeleteButton = styled.button`
  width: 84px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #d32f2f;
  color: white;
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: default;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;

  thead {
    background: #c8d7e1;
  }

  th {
    height: 44px;
    padding: 0 12px;
    color: #111111;
    font-weight: 700;
    text-align: left;
    border-bottom: 1px solid #d0dbe3;
    vertical-align: middle;
  }

  td {
    height: 44px;
    padding: 0 12px;
    vertical-align: middle;
    border-bottom: 1px solid #eeeeee;
  }
`;

export const TableRow = styled.tr<{ $selected?: boolean }>`
  background: ${({ $selected }) => ($selected ? "#eef4f8" : "white")};
  cursor: pointer;

  &:hover {
    background: #f5f7f9;
  }
`;

export const EmptyCell = styled.td`
  height: 120px;
  text-align: center;
  color: #777777;
`;

export const SelectedInfo = styled.p`
  margin: 12px 0 0;
  color: #777777;
  font-size: 13px;
  line-height: 20px;
`;

export const Pagination = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const PageButton = styled.button`
  border: none;
  background: transparent;
  color: #7ea0b7;
  font-size: 22px;
  line-height: 24px;
  cursor: pointer;

  &:disabled {
    color: #c8d7e1;
    cursor: default;
  }
`;

export const PageNumber = styled.span`
  color: #333333;
  font-size: 14px;
  line-height: 24px;
`;

export const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const AdminAlertBox = styled.div`
  width: 400px;
  min-height: 180px;

  > div {
    box-sizing: border-box;
    width: 100%;
    min-height: 180px;
    gap: 36px;
  }

  span {
    word-break: keep-all;
  }

  button {
    height: 40px;
    white-space: nowrap;
  }

  > div > div:last-child {
    justify-content: center;
    gap: 24px;
    margin-top: 12px;
  }
`;

export const DeleteConfirmAlert = styled(TwoButtonAlert)`
  button:last-child {
    background: #d32f2f;
    color: white;
  }
`;
