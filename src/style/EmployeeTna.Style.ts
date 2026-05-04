import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 48px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const CalendarSection = styled.section`
  min-width: 0;
`;

export const CalendarTitle = styled.h2`
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 700;
`;

export const CalendarBox = styled.div`
  width: 320px;

  .react-calendar {
    width: 100%;
    border: 1px solid #dddddd;
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
  }

  .react-calendar__tile--active {
    background: #7ea0b7;
    color: #ffffff;
  }

  .react-calendar__tile--now {
    background: #e8f0f5;
  }

  .react-calendar__month-view__weekdays {
    font-size: 13px;
    font-weight: 700;
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
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`;

export const AddButton = styled.button`
  border: none;
  background: transparent;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const RecordCard = styled.div`
  width: 520px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const RecordTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

export const RecordName = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
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

export const RecordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.label`
  display: grid;
  grid-template-columns: 90px 1fr;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

export const Input = styled.input`
  height: 36px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
`;

export const Select = styled.select`
  height: 36px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  background: #ffffff;
`;

export const BreakField = styled.label`
  display: grid;
  grid-template-columns: 18px 72px 1fr;
  align-items: center;
  gap: 10px;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeInput = styled.input`
  width: 100px;
  height: 36px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  padding: 0 8px;
  box-sizing: border-box;

  &:disabled {
    background: #eeeeee;
    color: #999999;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  font-size: 15px;

  span {
    font-weight: 700;
  }

  strong {
    font-weight: 500;
  }
`;

export const EmptyText = styled.p`
  font-size: 15px;
  font-weight: 700;
`;
