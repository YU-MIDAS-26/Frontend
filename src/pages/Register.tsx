import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Checkbox } from "../components/Common";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "../components/terms";

import {
  Page,
  Card,
  Header,
  Title,
  Form,
  Fields,
  StepText,
  Row,
  FieldWrapper,
  HalfFieldWrapper,
  FormTextField,
  //CalendarButton,
  //CalendarIcon,
  ActionButton,
  CheckboxRow,
  CheckboxButton,
  CheckboxLabel,
  SubmitAction,
  Message,
  FooterMessage,
} from "../style/Register.Style";
import {
  useCheckStudentIdMutation,
  useRegisterStepOneMutation,
  useRequestEmailVerificationMutation,
  useVerifyEmailVerificationMutation,
} from "../api/register_api";

const TermsBox = styled.div`
  max-height: 110px;
  overflow-y: auto;
  padding: 10px 12px;
  margin-bottom: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-line;
`;

function Register() {
  const navigate = useNavigate();
  const passwordRule = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreedToTerms1, setAgreedToTerms1] = useState(false);
  const [agreedToTerms2, setAgreedToTerms2] = useState(false);
  const [isEmailCodeVisible, setIsEmailCodeVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isStudentIdChecked, setIsStudentIdChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailMessageTone, setEmailMessageTone] = useState<
    "default" | "error" | "success"
  >("default");
  const [studentIdMessage, setStudentIdMessage] = useState("");
  const [studentIdMessageTone, setStudentIdMessageTone] = useState<
    "default" | "error" | "success"
  >("default");

  const requestEmailMutation = useRequestEmailVerificationMutation();
  const verifyEmailMutation = useVerifyEmailVerificationMutation();
  const checkStudentIdMutation = useCheckStudentIdMutation();
  const registerStepOneMutation = useRegisterStepOneMutation();

  const isPasswordMatched =
    password.trim().length > 0 &&
    passwordConfirm.trim().length > 0 &&
    password === passwordConfirm;

  const isStudentIdValid = studentId.trim().length >= 6;
  const isPhoneNumberValid = phoneNumber.trim().length === 11;
  const isPasswordValid = passwordRule.test(password);

  const isFormComplete =
    name.trim().length > 0 &&
    birthDate.trim().length > 0 &&
    email.trim().length > 0 &&
    isPhoneNumberValid &&
    isStudentIdValid &&
    isPasswordValid &&
    passwordConfirm.trim().length > 0 &&
    isPasswordMatched &&
    isEmailVerified &&
    isStudentIdChecked &&
    agreedToTerms1 &&
    agreedToTerms2;

  const handleToggleTerms1 = () => {
    setAgreedToTerms1((prev) => !prev);
  };

  const handleToggleTerms2 = () => {
    setAgreedToTerms2((prev) => !prev);
  };

  const handleRequestEmailCode = async () => {
    try {
      const response = await requestEmailMutation.mutateAsync({ email });

      setIsEmailCodeVisible(true);
      setIsEmailVerified(false);
      setEmailVerificationCode("");
      setEmailMessage(response.message);
      setEmailMessageTone("default");
    } catch (error) {
      setEmailMessage(
        error instanceof Error ? error.message : "인증코드를 보내지 못했어요.",
      );
      setEmailMessageTone("error");
    }
  };

  const handleVerifyEmailCode = async (value: string) => {
    try {
      const response = await verifyEmailMutation.mutateAsync({
        email,
        code: value,
      });

      setIsEmailVerified(true);
      setEmailMessage(response.message);
      setEmailMessageTone("success");
    } catch (error) {
      setIsEmailVerified(false);
      setEmailMessage(
        error instanceof Error ? error.message : "이메일 인증에 실패했어요.",
      );
      setEmailMessageTone("error");
    }
  };

  const handleEmailCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setEmailVerificationCode(value);
    setIsEmailVerified(false);
    setEmailMessage("");
    setEmailMessageTone("default");
  };

  const handleStudentIdCheck = async () => {
    try {
      const response = await checkStudentIdMutation.mutateAsync({ studentId });

      setIsStudentIdChecked(true);
      setStudentIdMessage(response.message);
      setStudentIdMessageTone("success");
    } catch (error) {
      setIsStudentIdChecked(false);
      setStudentIdMessage(
        error instanceof Error ? error.message : "아이디 확인에 실패했어요.",
      );
      setStudentIdMessageTone("error");
    }
  };

  const handleVerifyEmailButtonClick = async () => {
    await handleVerifyEmailCode(emailVerificationCode.trim());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormComplete) {
      return;
    }

    const payload = {
      name,
      birthDate,
      email,
      emailVerificationCode,
      phoneNumber,
      studentId,
      password,
      passwordConfirm,
      agreedToTerms1,
      agreedToTerms2,
    };

    try {
      const response = await registerStepOneMutation.mutateAsync(payload);
      if (response.success) {
        localStorage.setItem("pendingStudentId", studentId);
        navigate("/register2");
      }
    } catch (error) {
      // 컴포넌트 내부 FooterMessage 바인딩으로 자동 처리됨
    }
  };

  return (
    <Page>
      <Card>
        <Header>
          <Title>회원가입</Title>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Fields>
            <StepText>1. 개인정보 입력하기</StepText>

            <FieldWrapper>
              <FormTextField
                value={name}
                placeholder="이름"
                onChange={(event) => setName(event.target.value)}
              />
            </FieldWrapper>

            <FieldWrapper>
              <FormTextField
                type="text" // 처음엔 텍스트로!
                placeholder="생년월일"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </FieldWrapper>

            <Row>
              <HalfFieldWrapper $disabled={isEmailVerified}>
                <FormTextField
                  type="email"
                  value={email}
                  placeholder="이메일"
                  disabled={isEmailVerified}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsEmailVerified(false);
                    setIsEmailCodeVisible(false);
                    setEmailVerificationCode("");
                    setEmailMessage("");
                    setEmailMessageTone("default");
                  }}
                />
              </HalfFieldWrapper>

              <ActionButton
                type="button"
                disabled={isEmailVerified || requestEmailMutation.isPending}
                onClick={handleRequestEmailCode}
              >
                인증코드 받기
              </ActionButton>
            </Row>

            {emailMessage ? (
              <Message $tone={emailMessageTone}>{emailMessage}</Message>
            ) : null}

            {isEmailCodeVisible ? (
              <Row>
                <HalfFieldWrapper $disabled={isEmailVerified}>
                  <FormTextField
                    value={emailVerificationCode}
                    placeholder="인증번호 확인"
                    disabled={isEmailVerified}
                    maxLength={6}
                    onChange={handleEmailCodeChange}
                  />
                </HalfFieldWrapper>

                <ActionButton
                  type="button"
                  disabled={
                    isEmailVerified ||
                    verifyEmailMutation.isPending ||
                    emailVerificationCode.trim().length === 0
                  }
                  onClick={handleVerifyEmailButtonClick}
                >
                  승인
                </ActionButton>
              </Row>
            ) : null}

            <FieldWrapper>
              <FormTextField
                value={phoneNumber}
                placeholder="전화번호(하이픈 없이 입력해주세요.)"
                inputMode="numeric"
                maxLength={11}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value.replace(/\D/g, "").slice(0, 11),
                  )
                }
              />
            </FieldWrapper>

            {phoneNumber.trim().length > 0 && !isPhoneNumberValid ? (
              <Message $tone="error">
                전화번호는 11자리로 입력해 주세요.
              </Message>
            ) : null}

            <Row>
              <HalfFieldWrapper>
                <FormTextField
                  value={studentId}
                  placeholder="아이디"
                  onChange={(event) => {
                    setStudentId(event.target.value);
                    setIsStudentIdChecked(false);
                    setStudentIdMessage("");
                    setStudentIdMessageTone("default");
                  }}
                />
              </HalfFieldWrapper>

              <ActionButton
                type="button"
                disabled={checkStudentIdMutation.isPending}
                onClick={handleStudentIdCheck}
              >
                중복확인
              </ActionButton>
            </Row>

            {studentId.trim().length > 0 && !isStudentIdValid ? (
              <Message $tone="error">아이디는 6자 이상이어야 합니다.</Message>
            ) : null}

            {studentIdMessage ? (
              <Message $tone={studentIdMessageTone}>{studentIdMessage}</Message>
            ) : null}

            <FieldWrapper>
              <FormTextField
                type="password"
                value={password}
                placeholder="비밀번호"
                onChange={(event) => setPassword(event.target.value)}
              />
            </FieldWrapper>

            {password.trim().length > 0 && !isPasswordValid ? (
              <Message $tone="error">
                비밀번호는 대소문자를 포함해 6자 이상이어야 합니다.
              </Message>
            ) : null}

            <FieldWrapper>
              <FormTextField
                type="password"
                value={passwordConfirm}
                placeholder="비밀번호 확인"
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
            </FieldWrapper>

            {passwordConfirm.trim().length > 0 && !isPasswordMatched ? (
              <Message $tone="error">비밀번호가 일치하지 않습니다.</Message>
            ) : null}

            <TermsBox>{TERMS_OF_SERVICE}</TermsBox>
            <CheckboxRow>
              <CheckboxButton
                type="button"
                aria-label="서비스 이용약관 동의"
                aria-pressed={agreedToTerms1}
                onClick={handleToggleTerms1}
              >
                <Checkbox checked={agreedToTerms1} />
              </CheckboxButton>
              <CheckboxLabel
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleTerms1();
                }}
              >
                [필수] 서비스 이용약관 동의
              </CheckboxLabel>
            </CheckboxRow>

            <TermsBox>{PRIVACY_POLICY}</TermsBox>
            <CheckboxRow>
              <CheckboxButton
                type="button"
                aria-label="개인정보 수집 및 이용 동의"
                aria-pressed={agreedToTerms2}
                onClick={handleToggleTerms2}
              >
                <Checkbox checked={agreedToTerms2} />
              </CheckboxButton>
              <CheckboxLabel
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleTerms2();
                }}
              >
                [필수] 개인정보 수집 및 이용 동의
              </CheckboxLabel>
            </CheckboxRow>
          </Fields>

          {registerStepOneMutation.isError ? (
            <FooterMessage $tone="error">
              {registerStepOneMutation.error.message}
            </FooterMessage>
          ) : null}

          {registerStepOneMutation.isSuccess ? (
            <FooterMessage $tone="success">
              {registerStepOneMutation.data.message}
            </FooterMessage>
          ) : null}

          <SubmitAction
            type="submit"
            isActive={isFormComplete}
            disabled={!isFormComplete || registerStepOneMutation.isPending}
            aria-busy={registerStepOneMutation.isPending}
          >
            {registerStepOneMutation.isPending ? "저장 중..." : "다음"}
          </SubmitAction>
        </Form>
      </Card>
    </Page>
  );
}

export default Register;
