import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SubmitButton, TextField } from "../components/Common";

const Page = styled.main`
  min-height: calc(1024px - 70px);
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.form`
  width: 560px;
  height: 360px;
  border: 3px solid #7ea0b7;
  border-radius: 8px;
  padding: 64px 72px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0 0 56px;
  color: black;
  font-size: 28px;
  font-weight: 700;
`;

const FieldGroup = styled.div`
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FieldBox = styled.div`
  width: 100%;
  height: 40px;
`;

const ButtonBox = styled.div`
  width: 360px;
  height: 40px;
  margin-top: 20px;
`;

const ErrorText = styled.p`
  margin: 4px 0 0;
  color: #d32f2f;
  font-size: 12px;
  line-height: 16px;
  align-self: flex-start;
`;

const isValidPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

function PasswardReset() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const isPasswordTouched = password.length > 0;
  const isPasswordConfirmTouched = passwordConfirm.length > 0;

  const passwordError =
    isPasswordTouched && !isValidPassword(password)
      ? "비밀번호는 대소문자와 숫자를 포함해 6자 이상이어야 합니다."
      : "";

  const passwordConfirmError =
    isPasswordConfirmTouched && password !== passwordConfirm
      ? "비밀번호가 일치하지 않습니다."
      : "";
  const isFormValid =
    isValidPassword(password) &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordError || passwordConfirmError || !isFormValid) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    alert("비밀번호가 변경되었습니다.");
    navigate("/login");
  };

  return (
    <Page>
      <Card onSubmit={handleSubmit}>
        <Title>비밀번호 재설정</Title>

        <FieldGroup>
          <FieldBox>
            <TextField
              type="password"
              value={password}
              placeholder="새로운 비밀번호"
              onChange={(event) => setPassword(event.target.value)}
            />
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
          </FieldBox>

          <FieldBox>
            <TextField
              type="password"
              value={passwordConfirm}
              placeholder="새로운 비밀번호 확인"
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
            {passwordConfirmError && (
              <ErrorText>{passwordConfirmError}</ErrorText>
            )}
          </FieldBox>
        </FieldGroup>

        <ButtonBox>
          <SubmitButton type="submit" isActive={isFormValid}>
            변경하기
          </SubmitButton>
        </ButtonBox>
      </Card>
    </Page>
  );
}

export default PasswardReset;
