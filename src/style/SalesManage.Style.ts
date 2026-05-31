import styled from "styled-components";

export { Page, Layout, Sidebar, SideTitle, MenuButton, Content } from "./EmployeeManage.Style";

export const Section = styled.section`
  background: #fff;
  border: 1px solid #e0e3e7;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 12px;
  color: #111;
  font-size: 18px;
  font-weight: 700;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
`;

export const CalendarTitle = styled.h4`
  margin: 0;
  color: #1d1d1d;
  font-size: 16px;
  font-weight: 700;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  border: 1px solid #c2ccd5;
  background: #f0f4f7;
  color: #111;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
`;

export const WeekDay = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #333;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

export const DayCard = styled.button<{ $selected: boolean }>`
  min-height: 106px;
  border: 1px solid ${(p) => (p.$selected ? "#5d839f" : "#d0d4d9")};
  background: ${(p) => (p.$selected ? "#dcebf5" : "#f8f9fb")};
  border-radius: 10px;
  padding: 8px;
  text-align: left;
  cursor: pointer;
`;

export const DayText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #202020;
  line-height: 1.35;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  border: 1px solid #d0d4d9;
  border-radius: 10px;
  padding: 12px;
  background: #fafbfd;
`;

export const PanelTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: #111;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7eb;
  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-size: 14px;
  color: #222;
`;

export const Value = styled.span`
  font-size: 14px;
  color: #111;
  font-weight: 700;
`;

export const AccordionTitle = styled.button<{ $open: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid ${(p) => (p.$open ? "#7e9db3" : "#d0d4d9")};
  background: ${(p) => (p.$open ? "#d7e5ef" : "#f4f7fa")};
  color: #111;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
  cursor: pointer;
`;

export const Input = styled.input`
  width: 180px;
  border: 1px solid #cdd3d9;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 14px;
  color: #111;
  background: #fff;
`;

export const Select = styled.select`
  width: 180px;
  border: 1px solid #cdd3d9;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 14px;
  color: #111;
  background: #fff;
`;

export const SaveButton = styled.button`
  border: 1px solid #7ea0b7;
  background: #7ea0b7;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background: #fff;
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 16px;
`;

export const CardTitle = styled.h3`
  margin: 0 0 10px;
  color: #111;
  font-size: 18px;
  font-weight: 700;
`;

export const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #202020;
  font-size: 15px;
  line-height: 1.7;
`;

export const Highlight = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #e9f2f8;
  border: 1px solid #c3d8e7;
  color: #17212b;
  font-size: 14px;
  line-height: 1.5;
`;

export const SubTitle = styled.p`
  margin: 0;
  color: #2a2a2a;
  font-size: 15px;
  line-height: 1.5;
`;

export const PickerHint = styled.p`
  margin: 0 0 10px;
  color: #444;
  font-size: 13px;
`;

export const CompactDayCard = styled.button<{ $selected: boolean; $inRange?: boolean }>`
  min-height: 44px;
  border: 1px solid
    ${(p) => (p.$selected ? "#5d839f" : p.$inRange ? "#9cb5c7" : "#d0d4d9")};
  background: ${(p) =>
    p.$selected ? "#dcebf5" : p.$inRange ? "#edf4f8" : "#f8f9fb"};
  border-radius: 8px;
  padding: 6px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: #111;
`;

export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  max-width: 420px;
`;

export const MonthButton = styled.button<{ $selected: boolean }>`
  border: 1px solid ${(p) => (p.$selected ? "#5d839f" : "#d0d4d9")};
  background: ${(p) => (p.$selected ? "#dcebf5" : "#f8f9fb")};
  border-radius: 8px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: #111;
`;
