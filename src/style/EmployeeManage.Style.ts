import styled from "styled-components";

export const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: #ffffff;
  padding: 40px;
  box-sizing: border-box;
`;

export const Layout = styled.section`
  width: 100%;
  max-width: 1180px;
  min-height: calc(100vh - 150px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 48px;
`;

export const Sidebar = styled.aside`
  padding-top: 24px;
`;

export const SideTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 18px;
  font-weight: 700;
`;

export const MenuButton = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  border: none;
  background: ${({ $active }) => ($active ? "#e8f0f5" : "transparent")};
  color: #111111;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 24px 0;
`;

export const EmployeeButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(126, 160, 183, 0.25)" : "transparent"};
  color: #111111;
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
`;

export const AddButton = styled.button`
  border: none;
  background: transparent;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

export const Content = styled.section`
  min-width: 0;
  padding: 24px 0;
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const TextButton = styled.button`
  border: none;
  background: transparent;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

export const Form = styled.div`
  width: 460px;
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
  font-size: 15px;
  font-weight: 700;
`;

export const Input = styled.input`
  height: 40px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 14px;
  background: #ffffff;

  &:disabled {
    border-color: transparent;
    background: transparent;
    color: #111111;
    opacity: 1;
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
  }
`;

export const CheckField = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const SaveButton = styled.button`
  width: 96px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #7ea0b7;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #c7c7c7;
    cursor: not-allowed;
  }
`;

export const EmptyText = styled.p`
  font-size: 15px;
  font-weight: 700;
`;
