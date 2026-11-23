import type {
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import styled from "styled-components";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children?: ReactNode;
};

type DivProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
};

type ChipProps = DivProps & {
  isActive?: boolean;
};

type CheckboxProps = ComponentPropsWithoutRef<"div"> & {
  checked?: boolean;
};

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Label14 = styled.span`
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  word-wrap: break-word;
`;

const Label14White = styled(Label14)`
  color: #ffffff;
  font-weight: 600;
`;

const Label14Sub = styled(Label14)`
  color: #4f738e;
  font-weight: 600;
`;

const Label14Muted = styled(Label14)`
  color: #64748b;
  font-weight: 500;
`;

const Title16 = styled.span`
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  word-wrap: break-word;
`;

const BaseButton = styled.button`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  border-radius: 10px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    transform 0.1s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ButtonMainRoot = styled(BaseButton)`
  background: #ffffff;
  border: 1px solid #cbd5e1;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;

/* 1번 버튼 */
export const ButtonMain = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonMainRoot type="button" {...rest}>
      <Label14>{children}</Label14>
    </ButtonMainRoot>
  );
};

const ButtonSelectedRoot = styled(BaseButton)`
  background: #7ea0b7;
  border: none;

  &:hover:not(:disabled) {
    background: #6b8ea6;
  }
`;

/* 2번 버튼 (메인 포인트 버튼 - 흰 글씨로 가독성 개선) */
export const ButtonSelected = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSelectedRoot type="button" {...rest}>
      <Label14White>{children}</Label14White>
    </ButtonSelectedRoot>
  );
};

const ButtonSubRoot = styled(BaseButton)`
  background: #ffffff;
  border: 1px solid #7ea0b7;

  &:hover:not(:disabled) {
    background: #f0f5f8;
  }
`;

/* 3번 버튼 (테두리 강조 버튼) */
export const ButtonSub = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSubRoot type="button" {...rest}>
      <Label14Sub>{children}</Label14Sub>
    </ButtonSubRoot>
  );
};

const ButtonSub2Root = styled(BaseButton)`
  background: #e2e8f0;
  border: none;

  &:hover:not(:disabled) {
    background: #cbd5e1;
  }
`;

/* 4번 버튼 (비활성/보조 버튼) */
export const ButtonSub2 = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSub2Root type="button" {...rest}>
      <Label14Muted>{children}</Label14Muted>
    </ButtonSub2Root>
  );
};

/* 1,4 버튼 */
type SubmitButtonProps = ButtonProps & {
  isActive?: boolean;
};

export const SubmitButton = ({
  children,
  isActive = false,
  ...rest
}: SubmitButtonProps) => {
  if (isActive) {
    return (
      <ButtonSelectedRoot type="button" {...rest}>
        <Label14White>{children}</Label14White>
      </ButtonSelectedRoot>
    );
  }

  return (
    <ButtonSub2Root type="button" {...rest}>
      <Label14Muted>{children}</Label14Muted>
    </ButtonSub2Root>
  );
};

const ChipRoot = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  box-sizing: border-box;
  background: ${({ $isActive }) => ($isActive ? "#7ea0b7" : "#ffffff")};
  border-radius: 20px;
  border: ${({ $isActive }) =>
    $isActive ? "1px solid #7ea0b7" : "1px solid #cbd5e1"};
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: inline-flex;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#6b8ea6" : "#f8fafc")};
  }
`;

/* 5, 6번 칩 */
export const Chip = ({ children, isActive = false, ...rest }: ChipProps) => {
  return (
    <ChipRoot $isActive={isActive} {...rest}>
      {$isActiveText(isActive, children)}
    </ChipRoot>
  );
};

const $isActiveText = (isActive: boolean, children: ReactNode) =>
  isActive ? (
    <Label14White>{children}</Label14White>
  ) : (
    <Label14>{children}</Label14>
  );

const TextFieldRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 44px;
  padding: 10px 14px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-within {
    border-color: #7ea0b7;
    box-shadow: 0 0 0 3px rgba(126, 160, 183, 0.2);
  }
`;

const TextFieldInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  outline: none;

  &::placeholder {
    color: #94a3b8;
  }
`;

/* 7번 텍스트필드 */
export const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <TextFieldRoot className={className}>
      <TextFieldInput {...props} />
    </TextFieldRoot>
  );
};

const AlertMessage = styled.div`
  align-self: stretch;
  min-height: 80px;
  padding: 8px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 10px;
  display: flex;
`;

const OneButtonAlertAction = styled(ButtonSelectedRoot)`
  align-self: stretch;
  height: 42px;
`;

const AlertCardBase = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  display: inline-flex;
`;

/* 8번 팝업창 */
type OneButtonAlertProps = ComponentPropsWithoutRef<"div"> & {
  title: ReactNode;
  description: ReactNode;
  buttonText: ReactNode;
  onButtonClick?: () => void;
};

export const OneButtonAlert = ({
  title,
  description,
  buttonText,
  onButtonClick,
  ...rest
}: OneButtonAlertProps) => {
  return (
    <AlertCardBase {...rest}>
      <AlertMessage>
        <Title16>{title}</Title16>
        <Label14Muted>{description}</Label14Muted>
      </AlertMessage>
      <OneButtonAlertAction type="button" onClick={onButtonClick}>
        <Label14White>{buttonText}</Label14White>
      </OneButtonAlertAction>
    </AlertCardBase>
  );
};

const TwoButtonAlertCancel = styled(ButtonSubRoot)`
  flex: 1 1 0;
  height: 42px;
`;

const TwoButtonAlertConfirm = styled(ButtonSelectedRoot)`
  flex: 1 1 0;
  height: 42px;
`;

const TwoButtonAlertRow = styled.div`
  align-self: stretch;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  display: inline-flex;
`;

/* 9번 팝업창 */
type TwoButtonAlertProps = ComponentPropsWithoutRef<"div"> & {
  title: ReactNode;
  description: ReactNode;
  cancelText: ReactNode;
  confirmText: ReactNode;
  onCancelClick?: () => void;
  onConfirmClick?: () => void;
};

export const TwoButtonAlert = ({
  title,
  description,
  cancelText,
  confirmText,
  onCancelClick,
  onConfirmClick,
  ...rest
}: TwoButtonAlertProps) => {
  return (
    <AlertCardBase {...rest}>
      <AlertMessage>
        <Title16>{title}</Title16>
        <Label14Muted>{description}</Label14Muted>
      </AlertMessage>
      <TwoButtonAlertRow>
        <TwoButtonAlertCancel type="button" onClick={onCancelClick}>
          <Label14Sub>{cancelText}</Label14Sub>
        </TwoButtonAlertCancel>
        <TwoButtonAlertConfirm type="button" onClick={onConfirmClick}>
          <Label14White>{confirmText}</Label14White>
        </TwoButtonAlertConfirm>
      </TwoButtonAlertRow>
    </AlertCardBase>
  );
};

const SquareRoot = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const SquareBox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  left: 4px;
  top: 4px;
  position: absolute;
  background: ${({ $checked }) => ($checked ? "#7ea0b7" : "#ffffff")};
  overflow: hidden;
  border-radius: 4px;
  border: ${({ $checked }) => ($checked ? "none" : "1px solid #cbd5e1")};
  box-sizing: border-box;
  transition: background-color 0.15s ease;
`;

const CheckVector = styled.div`
  width: 9px;
  height: 6.5px;
  left: 4px;
  top: 5.5px;
  position: absolute;
  border-left: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(-45deg);
  box-sizing: border-box;
`;

/* 10, 11 체크박스 */
export const Checkbox = ({ checked = false, ...props }: CheckboxProps) => {
  return (
    <SquareRoot {...props}>
      <SquareBox $checked={checked}>{checked && <CheckVector />}</SquareBox>
    </SquareRoot>
  );
};
