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
  color: black;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  word-wrap: break-word;
`;

const Label14White = styled(Label14)`
  color: white;
`;

const Label14Medium = styled(Label14)`
  font-weight: 500;
`;

const Title16 = styled.span`
  color: black;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  word-wrap: break-word;
`;

const ButtonMainRoot = styled.button`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ButtonMain = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonMainRoot type="button" {...rest}>
      <Label14>{children}</Label14>
    </ButtonMainRoot>
  );
};

const ButtonSelectedRoot = styled.button`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: #7ea0b7;
  border: none;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ButtonSelected = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSelectedRoot type="button" {...rest}>
      <Label14>{children}</Label14>
    </ButtonSelectedRoot>
  );
};

const ButtonSubRoot = styled.button`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 12px;
  outline: 1px #7ea0b7 solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ButtonSub = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSubRoot type="button" {...rest}>
      <Label14>{children}</Label14>
    </ButtonSubRoot>
  );
};

const ButtonSub2Root = styled.button`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: #c8d7e1;
  border: none;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ButtonSub2 = ({ children, ...rest }: ButtonProps) => {
  return (
    <ButtonSub2Root type="button" {...rest}>
      <Label14White>{children}</Label14White>
    </ButtonSub2Root>
  );
};

const ChipRoot = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: ${({ $isActive }) => ($isActive ? "#7ea0b7" : "white")};
  border-radius: 20px;
  outline: ${({ $isActive }) => ($isActive ? "none" : "1px #dedede solid")};
  outline-offset: ${({ $isActive }) => ($isActive ? "0" : "-1px")};
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const Chip = ({ children, isActive = false, ...rest }: ChipProps) => {
  return (
    <ChipRoot $isActive={isActive} {...rest}>
      <Label14Medium>{children}</Label14Medium>
    </ChipRoot>
  );
};

const TextFieldRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 16px;
  background: #c8d7e1;
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
`;

const TextFieldInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: black;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  outline: none;

  &::placeholder {
    color: #4f6270;
  }
`;

export const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <TextFieldRoot className={className}>
      <TextFieldInput {...props} />
    </TextFieldRoot>
  );
};

const AlertMessage = styled.div`
  align-self: stretch;
  min-height: 89px;
  padding: 12px 24px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  display: flex;
`;

const OneButtonAlertAction = styled.button`
  align-self: stretch;
  height: 40px;
  padding: 8px 16px;
  background: #7ea0b7;
  border: none;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

const OneButtonAlertRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  background: white;
  border-radius: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  display: inline-flex;
`;

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
    <OneButtonAlertRoot {...rest}>
      <AlertMessage>
        <Title16>{title}</Title16>
        <Label14>{description}</Label14>
      </AlertMessage>
      <OneButtonAlertAction type="button" onClick={onButtonClick}>
        <Label14>{buttonText}</Label14>
      </OneButtonAlertAction>
    </OneButtonAlertRoot>
  );
};

const TwoButtonAlertCancel = styled.button`
  flex: 1 1 0;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 12px;
  outline: 1px #7ea0b7 solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;
`;

const TwoButtonAlertConfirm = styled.button`
  flex: 1 1 0;
  height: 40px;
  padding: 8px 16px;
  background: #7ea0b7;
  border: none;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;
`;

const TwoButtonAlertRow = styled.div`
  align-self: stretch;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  display: inline-flex;
`;

const TwoButtonAlertRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  background: white;
  border-radius: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  display: inline-flex;
`;

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
    <TwoButtonAlertRoot {...rest}>
      <AlertMessage>
        <Title16>{title}</Title16>
        <Label14>{description}</Label14>
      </AlertMessage>
      <TwoButtonAlertRow>
        <TwoButtonAlertCancel type="button" onClick={onCancelClick}>
          <Label14>{cancelText}</Label14>
        </TwoButtonAlertCancel>
        <TwoButtonAlertConfirm type="button" onClick={onConfirmClick}>
          <Label14>{confirmText}</Label14>
        </TwoButtonAlertConfirm>
      </TwoButtonAlertRow>
    </TwoButtonAlertRoot>
  );
};

const SquareRoot = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  overflow: hidden;
`;

const SquareBox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  left: 4px;
  top: 4px;
  position: absolute;
  background: ${({ $checked }) => ($checked ? "#7ea0b7" : "transparent")};
  overflow: hidden;
  border-radius: 4px;
  border: ${({ $checked }) => ($checked ? "none" : "1px #dedede solid")};
  box-sizing: border-box;
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

export const Checkbox = ({ checked = false, ...props }: CheckboxProps) => {
  return (
    <SquareRoot {...props}>
      <SquareBox $checked={checked}>
        {checked && <CheckVector />}
      </SquareBox>
    </SquareRoot>
  );
};
