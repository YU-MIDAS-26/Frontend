/*공통 디자인 모음*/

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children?: ReactNode;
};

type DivProps = ComponentPropsWithoutRef<"div"> & {
  children?: ReactNode;
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

/*1.버튼(기본)*/
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

/*2.버튼 색 들어간거*/
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

/*3번 버튼(테두리선)*/
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

/*4번 버튼(연한 색)*/
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

/*5번 칩*/
const ChipMainRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  outline: 1px #dedede solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ChipMain = ({ children, ...rest }: DivProps) => {
  return (
    <ChipMainRoot {...rest}>
      <Label14Medium>{children}</Label14Medium>
    </ChipMainRoot>
  );
};

/*6번 칩(활성화)*/
const ChipSelectedRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background: #7ea0b7;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const ChipSelected = ({ children, ...rest }: DivProps) => {
  return (
    <ChipSelectedRoot {...rest}>
      <Label14Medium>{children}</Label14Medium>
    </ChipSelectedRoot>
  );
};

/*7번 텍스트 필드*/
const TextFieldText = styled.p`
  flex: 1 1 0;
  margin: 0;
`;

const TextFieldRoot = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px 77px 12px 16px;
  background: #c8d7e1;
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

export const TextField = ({ children, ...rest }: DivProps) => {
  return (
    <TextFieldRoot {...rest}>
      <TextFieldText>
        <Label14>{children}</Label14>
      </TextFieldText>
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

/*8번 팝업알림(버튼 하나)*/
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

/*9번 팝업알림(버튼 둘)*/
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

/*10번 체크박스*/
const SquareBox = styled.div`
  width: 16px;
  height: 16px;
  left: 4px;
  top: 4px;
  position: absolute;
  border-radius: 4px;
  border: 1px #dedede solid;
`;

const SquareRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

export const Square = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <SquareRoot {...props}>
      <SquareBox />
    </SquareRoot>
  );
};

/*11번 체크박스(활성화)*/
const CheckVector = styled.div`
  width: 9px;
  height: 6.5px;
  left: 4px;
  top: 5.5px;
  position: absolute;
  outline: 2px white solid;
  outline-offset: -1px;
`;

const CheckSquareBox = styled.div`
  width: 16px;
  height: 16px;
  left: 4px;
  top: 4px;
  position: absolute;
  background: #7ea0b7;
  overflow: hidden;
  border-radius: 4px;
`;

const CheckSquareRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

export const CheckSquare = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <CheckSquareRoot {...props}>
      <CheckSquareBox>
        <CheckVector />
      </CheckSquareBox>
    </CheckSquareRoot>
  );
};
