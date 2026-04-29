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
  gap: 16px;
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

const Message = styled.p`
  margin: 16px 0 0;
  color: #7ea0b7;
  font-size: 13px;
`;

const isValidId = (id: string) => id.trim().length >= 6;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

function PasswardFind() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = isValidId(studentId) && isValidEmail(email);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidId(studentId)) {
      alert("아이디는 6자 이상 입력해야 합니다.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("올바른 이메일을 입력해 주세요.");
      return;
    }

    // TODO: 백엔드 연결 후 재설정 링크 이메일 발송 API로 교체
    await new Promise((resolve) => setTimeout(resolve, 300));

    setMessage("재설정 링크가 이메일로 발송되었습니다.");

    // 더미 확인용. 실제로는 이메일 링크 타고 /password-reset 진입
    setTimeout(() => {
      navigate("/password-reset");
    }, 700);
  };

  return (
    <Page>
      <Card onSubmit={handleSubmit}>
        <Title>비밀번호 재설정</Title>

        <FieldGroup>
          <FieldBox>
            <TextField
              value={studentId}
              placeholder="아이디"
              onChange={(event) => setStudentId(event.target.value)}
            />
          </FieldBox>

          <FieldBox>
            <TextField
              value={email}
              placeholder="가입한 이메일"
              onChange={(event) => setEmail(event.target.value)}
            />
          </FieldBox>
        </FieldGroup>

        <ButtonBox>
          <SubmitButton type="submit" isActive={isFormValid}>
            재설정 링크 보내기
          </SubmitButton>
        </ButtonBox>

        {message && <Message>{message}</Message>}
      </Card>
    </Page>
  );
}

export default PasswardFind;
