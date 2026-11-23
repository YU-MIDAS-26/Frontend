import styled from "styled-components";

export {
  Page,
  Layout,
  Sidebar,
  SideTitle,
  MenuButton,
  Content,
} from "./EmployeeManage.Style";

export const Section = styled.section`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  padding: 24px 28px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 16px;
  color: #0f172a;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
`;

export const CalendarTitle = styled.h4`
  margin: 0 0 10px;
  color: #1e293b;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  min-height: 36px;
  background-color: #ffffff;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 8px;
`;

export const WeekDay = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
`;

export const CalendarGrid = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

export const DayCard = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-width: 0;
  min-height: 98px;
  box-sizing: border-box;
  border: ${(p) => (p.$selected ? "1.5px solid #7ea0b7" : "1px solid #e2e8f0")};
  background-color: ${(p) => (p.$selected ? "#f0f5f8" : "#ffffff")};
  border-radius: 10px;
  padding: 8px 7px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #7ea0b7;
  }
`;

export const DayText = styled.div`
  margin-top: 4px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
  font-size: 11px;
  color: #334155;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;

  span:first-child {
    color: #64748b;
    flex-shrink: 0;
  }

  span:last-child {
    font-weight: 600;
    color: #1e293b;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
`;

export const PanelTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  &:last-of-type {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-size: 14px;
  color: #334155;
  font-weight: 500;
`;

export const Value = styled.span`
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const AccordionTitle = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 11px 16px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

export const SubAccordionTitle = styled.button<{ $open: boolean }>`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid ${(p) => (p.$open ? "#7ea0b7" : "#e2e8f0")};
  border-radius: 0;
  padding: 8px 4px;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  margin-top: 6px;
  margin-bottom: 12px;
  cursor: pointer;
`;

export const Input = styled.input`
  width: 220px;
  min-height: 44px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  font-variant-numeric: tabular-nums;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: #7ea0b7;
    box-shadow: 0 0 0 3px rgba(126, 160, 183, 0.2);
  }
`;

export const Select = styled.select`
  width: 220px;
  min-height: 44px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: #7ea0b7;
    box-shadow: 0 0 0 3px rgba(126, 160, 183, 0.2);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
`;

export const SaveButton = styled.button`
  min-height: 40px;
  background-color: #7ea0b7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #6b8ea6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const DeleteButton = styled.button`
  min-height: 40px;
  background-color: #ffffff;
  color: #b94a48;
  border: 1px solid #d98282;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #fdf2f2;
    border-color: #b94a48;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  padding: 22px 24px;
`;

export const CardTitle = styled.h3`
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;

  &:not(:first-child) {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }
`;

export const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #334155;
  font-size: 14px;
  line-height: 1.65;

  li {
    margin-bottom: 10px;
    padding-left: 2px;

    &::marker {
      color: #4f738e;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Highlight = styled.div`
  margin-top: 16px;
  background-color: #f0f5f8;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 14px 16px;
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.65;

  ${CardTitle} + & {
    margin-top: 0;
  }
`;

export const SubTitle = styled.p`
  margin: 0;
  color: #475569;
  font-size: 15px;
  line-height: 1.5;
`;

export const PickerHint = styled.p`
  margin: 0 0 10px;
  color: #64748b;
  font-size: 13px;
`;

export const CompactDayCard = styled.button<{
  $selected: boolean;
  $inRange?: boolean;
}>`
  min-height: 44px;
  border: ${(p) => (p.$selected ? "1.5px solid #7ea0b7" : "1px solid #cbd5e1")};
  background-color: ${(p) =>
    p.$selected ? "#f0f5f8" : p.$inRange ? "#f8fafc" : "#ffffff"};
  border-radius: 10px;
  padding: 6px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  max-width: 420px;
`;

export const MonthButton = styled.button<{ $selected: boolean }>`
  border: 1px solid ${(p) => (p.$selected ? "#7ea0b7" : "#cbd5e1")};
  background: ${(p) => (p.$selected ? "#f0f5f8" : "#ffffff")};
  border-radius: 10px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => (p.$selected ? "#4f738e" : "#1e293b")};
  transition: all 0.15s ease;

  &:hover {
    border-color: #7ea0b7;
  }
`;
