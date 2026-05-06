import { useState } from "react";
import type { FormEvent } from "react";
import styled from "styled-components";
import { ButtonSelected, Checkbox, TextField } from "../components/Common";
import { useLoginMutation } from "../api/login_api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Page = styled.main`
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7f9;
`;

const Card = styled.section`
  width: min(100%, 420px);
  padding: 50px 32px;
  border-radius: 8px;
  outline: 3px #7ea0b7 solid;
  outline-offset: -3px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const Title = styled.h1`
  margin: 0;
  color: black;
  font-size: 32px;
  font-family: "ONE Mobile Title", sans-serif;
  font-weight: 400;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginTextField = styled(TextField)`
  height: 48px;
`;

const AutoLoginRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const CheckboxButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const AutoLoginText = styled.span`
  color: black;
  font-size: 14px;
  line-height: 24px;
`;

const LoginButton = styled(ButtonSelected)`
  height: 40px;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FooterButton = styled.button`
  border: none;
  background: transparent;
  color: black;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  padding: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #c43d3d;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
`;

const SuccessMessage = styled.p`
  margin: 0;
  color: #2d6a4f;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
`;

function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const loginMutation = useLoginMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (studentId.length < 6) {
      alert("아이디는 6자 이상 입력해야 합니다.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 6자 이상 입력해야 합니다.");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        studentId,
        password,
        rememberMe,
      });

      // TODO: 백엔드 연동 시 여기서는 로그인 API 응답값만 넘기고,
      // 실제 세션 저장은 AuthContext에서 처리하도록 유지하면 됩니다.
      login(studentId);

      navigate("/");
    } catch {
      // 에러 메시지는 loginMutation.isError 쪽에서 이미 보여줌
    }
  };

  return (
    <Page>
      <Card>
        <Title>{"로그인"}</Title>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <LoginTextField
              type="text"
              value={studentId}
              placeholder={"아이디"}
              onChange={(event) => setStudentId(event.target.value)}
            />

            <LoginTextField
              type="password"
              value={password}
              placeholder={"비밀번호"}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FieldGroup>

          <AutoLoginRow>
            <CheckboxButton
              type="button"
              aria-label={"자동 로그인"}
              aria-pressed={rememberMe}
              onClick={() => setRememberMe((prev) => !prev)}
            >
              <Checkbox checked={rememberMe} />
            </CheckboxButton>
            <AutoLoginText>{"자동 로그인"}</AutoLoginText>
          </AutoLoginRow>

          <LoginButton
            type="submit"
            disabled={loginMutation.isPending}
            aria-busy={loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </LoginButton>

          {loginMutation.isError && (
            <ErrorMessage>{loginMutation.error.message}</ErrorMessage>
          )}

          {loginMutation.isSuccess && !loginMutation.isError && (
            <SuccessMessage>{"완료(추후 로그인 구현)"}</SuccessMessage>
          )}

          <FooterLinks>
            <FooterButton type="button" onClick={() => navigate("/register")}>
              {"회원가입"}
            </FooterButton>
            <FooterButton type="button">{"아이디 찾기"}</FooterButton>
            <FooterButton
              type="button"
              onClick={() => navigate("/password-find")}
            >
              비밀번호 찾기
            </FooterButton>
          </FooterLinks>
        </Form>
      </Card>
    </Page>
  );
}

export default Login;
