import styled from "styled-components";

export const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: var(--app-page-bg, #f8fafc);
  padding: 32px 24px 48px;
  box-sizing: border-box;
`;

export const Layout = styled.section`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  padding-top: 8px;
`;

export const SideTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

export const MenuButton = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#4f738e" : "#111111")};
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;
  padding: 8px 4px;
  margin-bottom: 6px;
  transition: color 0.15s ease;

  &:hover {
    color: #4f738e;
  }
`;

export const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 20px 0 14px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

export const EmployeeButton = styled.button<{ $active: boolean }>`
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#4f738e" : "#111111")};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;
  padding: 6px 4px;
  transition: color 0.15s ease;

  &:hover {
    color: #4f738e;
  }
`;

export const AddButton = styled.button`
  width: 100%;
  border: 1px dashed #94a3b8;
  background: #ffffff;
  color: #4f738e;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 9px 12px;
  border-radius: 8px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #7ea0b7;
    background: #f0f5f8;
  }
`;

export const Content = styled.section`
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px 32px;
  box-sizing: border-box;
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const TextButton = styled.button`
  height: 34px;
  padding: 0 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;

export const Form = styled.div`
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Field = styled.label`
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;
  gap: 16px;
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
`;

export const Input = styled.input`
  height: 42px;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  padding: 0 14px;
  box-sizing: border-box;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: #7ea0b7;
    box-shadow: 0 0 0 3px rgba(126, 160, 183, 0.2);
  }

  /* 조회 모드: 테두리 빼고 연한 회색 칸으로만 구분 */
  &:disabled {
    border-color: transparent;
    background: #f1f5f9;
    color: #334155;
    opacity: 1;
    cursor: default;
  }
`;

export const PayTypeGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const PayTypeButton = styled.button<{ $active: boolean }>`
  width: 72px;
  height: 36px;
  border: 1px solid ${({ $active }) => ($active ? "#4f748d" : "#bbbbbb")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#7ea0b7" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111111")};
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 1;
    background: ${({ $active }) => ($active ? "#7ea0b7" : "#ffffff")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#111111")};
    border-color: ${({ $active }) => ($active ? "#4f748d" : "#bbbbbb")};
  }
`;

export const CheckField = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 126px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #7ea0b7;
`;

export const SaveButton = styled.button`
  width: 110px;
  height: 42px;
  margin-left: 126px;
  margin-top: 6px;
  border: none;
  border-radius: 10px;
  background: #7ea0b7;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background: #6b8ea6;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const EmptyText = styled.p`
  margin: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

export const RequiredNotice = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

export const RequiredMark = styled.span`
  color: #f87171;
  margin-left: 2px;
`;
