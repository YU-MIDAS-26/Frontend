import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { SubmitButton, TextField } from "../components/Common";
import { usePasswordResetConfirmMutation } from "../api/login_api";

const Page = styled.main`
  min-height: calc(1024px - 70px);
  background: var(--app-page-bg);
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
  const [searchParams] = useSearchParams();

  // 🔗 이메일 재설정 링크로 넘어온 ?token=abc 값 추출 (없으면 기본 임시 껍데기 값)
  const resetToken = searchParams.get("token") || "mock_temporary_reset_token";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 백엔드 컨펌 API 뮤테이션 가동
  const resetConfirmMutation = usePasswordResetConfirmMutation();

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

    // 🚀 백엔드로 변경된 최종 새 패스워드 전송
    resetConfirmMutation.mutate(
      {
        token: resetToken,
        newPassword: password,
        newPasswordConfirm: passwordConfirm,
      },
      {
        onSuccess: (res) => {
          if (res.status === "SUCCESS") {
            alert("비밀번호가 안전하게 변경되었습니다. 다시 로그인해 주세요.");
            navigate("/login");
          }
        },
        onError: (err) => {
          alert(
            err.message ||
              "비밀번호 변경 처리 중 오류가 발생했습니다. 링크 만료 여부를 확인하세요.",
          );
        },
      },
    );
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
          <SubmitButton
            type="submit"
            isActive={isFormValid && !resetConfirmMutation.isPending}
          >
            {resetConfirmMutation.isPending ? "변경 중..." : "변경하기"}
          </SubmitButton>
        </ButtonBox>
      </Card>
    </Page>
  );
}

export default PasswardReset;
