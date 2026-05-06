import styled, { css } from "styled-components";
import { ButtonSelected, SubmitButton, TextField } from "../components/Common";

export const Page = styled.main`
  min-height: calc(100vh - 70px);
  padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 24px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7f9;
`;

export const Card = styled.section`
  width: min(100%, 36rem);
  padding: clamp(32px, 4vw, 50px) clamp(20px, 4.5vw, 60px);
  border-radius: 8px;
  outline: 3px #7ea0b7 solid;
  outline-offset: -3px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 5vw, 62px);
  box-sizing: border-box;

  @media (max-width: 640px) {
    width: 100%;
    padding: 32px 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
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
  gap: clamp(36px, 5vw, 62px);
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.4vw, 25px);
`;

export const StepText = styled.p`
  margin: 0;
  color: black;
  font-size: 16px;
  line-height: 24px;
`;

export const Row = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 25px);
  align-items: flex-start;
  width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const FieldWrapper = styled.div<{ $disabled?: boolean }>`
  width: 100%;
  height: 48px;
  position: relative;
  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.72;
    `}
`;

export const HalfFieldWrapper = styled(FieldWrapper)`
  flex: 1 1 0;
  width: auto;
  min-width: 0;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const FormTextField = styled(TextField)`
  height: 100%;
`;

export const CalendarButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const CalendarIcon = styled.span`
  width: 18px;
  height: 18px;
  display: block;
  position: relative;
  border: 2px solid #111;
  border-radius: 4px;
  box-sizing: border-box;

  &::before,
  &::after {
    content: "";
    width: 2px;
    height: 6px;
    background: #111;
    position: absolute;
    top: -4px;
    border-radius: 999px;
  }

  &::before {
    left: 3px;
  }

  &::after {
    right: 3px;
  }
`;

export const ActionButton = styled(ButtonSelected)`
  width: clamp(96px, 18vw, 112px);
  min-height: 40px;
  height: auto;
  padding: 8px 12px;
  flex-shrink: 0;
  white-space: normal;
  word-break: keep-all;
  text-align: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
`;

export const CheckboxButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const CheckboxLabel = styled.span`
  color: black;
  font-size: 14px;
  line-height: 24px;
`;

export const SubmitAction = styled(SubmitButton)`
  height: 40px;

  &:disabled {
    cursor: not-allowed;
  }
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

export const FooterMessage = styled(Message)`
  margin: -32px 0 0;
  text-align: center;
`;
