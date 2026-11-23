import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 36px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarSection = styled.section`
  min-width: 0;
`;

export const CalendarTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

export const CalendarBox = styled.div`
  width: 100%;

  .react-calendar {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px;
    font-family: "Segoe UI", "Noto Sans KR", sans-serif;
  }

  .react-calendar__navigation button {
    border-radius: 8px;
    font-weight: 700;
  }

  .react-calendar__tile {
    border-radius: 8px;
    height: 42px;
    font-size: 14px;
    transition: background-color 0.15s ease;
  }

  .react-calendar__tile--now {
    background: #eef4f8;
    color: #3b5970;
    font-weight: 700;
  }

  .react-calendar__tile--active,
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #7ea0b7 !important;
    color: #ffffff !important;
    font-weight: 700;
  }

  .react-calendar__month-view__weekdays {
    font-size: 13px;
    font-weight: 700;
    color: #475569;
  }

  abbr {
    text-decoration: none;
  }
`;

export const WorkSection = styled.section`
  min-width: 0;
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

export const AddButton = styled.button`
  height: 34px;
  padding: 0 14px;
  border: 1px solid #7ea0b7;
  border-radius: 8px;
  background: #ffffff;
  color: #4f738e;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f0f5f8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RecordCard = styled.div`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: #f8fafc;
  box-sizing: border-box;
`;

export const RecordTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid #e2e8f0;
`;

export const RecordName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const TextButton = styled.button`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

export const RecordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Field = styled.label`
  display: grid;
  grid-template-columns: 84px 1fr;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

export const Input = styled.input`
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  background: #ffffff;
  outline: none;

  &:focus {
    border-color: #7ea0b7;
  }
`;

export const Select = styled.select`
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  background: #ffffff;
  outline: none;

  &:focus {
    border-color: #7ea0b7;
  }
`;

export const BreakField = styled.label`
  display: grid;
  grid-template-columns: 18px 66px 1fr;
  align-items: center;
  gap: 10px;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #7ea0b7;
`;

export const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeInput = styled.input`
  width: 110px;
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 8px;
  box-sizing: border-box;
  background: #ffffff;

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  font-size: 14px;

  span {
    font-weight: 600;
    color: #64748b;
  }

  strong {
    font-weight: 600;
    color: #0f172a;
  }
`;

export const EmptyText = styled.p`
  margin: 0;
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
`;
