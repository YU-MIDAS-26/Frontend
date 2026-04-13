import styled from "styled-components";
import { ButtonSelected, SubmitButton, TextField } from "../components/Common";

export const Page = styled.main`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7f9;
`;

export const Card = styled.section`
  width: 540px;
  max-width: min(100%, 540px);
  padding: 50px 60px;
  border-radius: 8px;
  outline: 3px #7ea0b7 solid;
  outline-offset: -3px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 62px;
  box-sizing: border-box;

  @media (max-width: 640px) {
    width: 100%;
    padding: 40px 24px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  color: black;
  font-size: 32px;
  font-family: "ONE Mobile Title", sans-serif;
  font-weight: 400;
  line-height: 1;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const StepTitle = styled.h2`
  margin: 0;
  color: black;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

export const Row = styled.div`
  display: flex;
  gap: 25px;
  align-items: flex-start;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const HalfRow = styled(Row)`
  @media (min-width: 641px) {
    & > * {
      width: calc(50% - 12.5px);
      flex: 0 0 calc(50% - 12.5px);
    }
  }
`;

export const FormTextField = styled(TextField)`
  flex: 1;
  height: 48px;
`;

const FieldBase = `
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #c8d7e1;
  color: black;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  box-sizing: border-box;
  outline: none;
`;

export const SelectField = styled.select`
  ${FieldBase}
  appearance: none;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, #4f6270 50%),
    linear-gradient(135deg, #4f6270 50%, transparent 50%);
  background-position: calc(100% - 22px) calc(50% - 2px),
    calc(100% - 16px) calc(50% - 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;

  &:invalid {
    color: #4f6270;
  }
`;

export const AddressButton = styled(ButtonSelected)`
  width: 95px;
  height: 48px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const NextButton = styled(SubmitButton)`
  height: 40px;
  margin-top: 37px;

  &:disabled {
    cursor: not-allowed;
  }
`;

export const DateWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #c8d7e1;
`;

export const RadioGroupLabel = styled.span`
  color: #4f6270;
  font-size: 14px;
  line-height: 24px;
`;

export const RadioOptions = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: black;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const RadioMark = styled.span<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  box-sizing: border-box;
  border: 2px solid ${({ $checked }) => ($checked ? "#7ea0b7" : "#4f6270")};
  background: ${({ $checked }) => ($checked ? "#7ea0b7" : "transparent")};
  box-shadow: inset 0 0 0 3px #c8d7e1;
`;

export const FileUploadField = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #c8d7e1;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileUploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 95px;
  height: 40px;
  padding: 8px 16px;
  border-radius: 12px;
  background: #7ea0b7;
  color: black;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const FileUploadText = styled.span<{ $hasFile: boolean }>`
  flex: 1;
  color: ${({ $hasFile }) => ($hasFile ? "black" : "#4f6270")};
  font-size: 14px;
  line-height: 24px;
  word-break: break-word;
`;

export const Message = styled.p<{ $tone: "default" | "error" | "success" }>`
  margin: -13px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: ${({ $tone }) => {
    if ($tone === "error") {
      return "#c43d3d";
    }

    if ($tone === "success") {
      return "#2d6a4f";
    }

    return "#4f6270";
  }};
`;
