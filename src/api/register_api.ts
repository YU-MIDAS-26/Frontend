import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";

export type RegisterStepOnePayload = {
  name: string;
  birthDate: string;
  email: string;
  emailVerificationCode: string;
  phoneNumber: string;
  studentId: string;
  password: string;
  passwordConfirm: string;
  agreedToTerms1: boolean;
  agreedToTerms2: boolean;
};

export type EmailVerificationRequest = {
  email: string;
};

export type EmailVerificationConfirmRequest = {
  email: string;
  code: string;
};

export type StudentIdCheckRequest = {
  studentId: string;
};

export type RegisterApiMessage = {
  success: boolean;
  message: string;
};

export const requestEmailVerificationCode = async (
  payload: EmailVerificationRequest,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/auth/email/request",
    payload,
  );

  return response.data;
};

export const verifyEmailVerificationCode = async (
  payload: EmailVerificationConfirmRequest,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/auth/email/verify",
    payload,
  );

  return response.data;
};

export const checkStudentIdDuplicate = async (
  payload: StudentIdCheckRequest,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/auth/student-id/check",
    payload,
  );

  return response.data;
};

export const submitRegisterStepOne = async (
  payload: RegisterStepOnePayload,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/auth/register/step-one",
    payload,
  );

  return response.data;
};

const mockDelay = async () =>
  new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

export const useRequestEmailVerificationMutation = () =>
  useMutation({
    mutationFn: async ({ email }: EmailVerificationRequest) => {
      if (!email.trim()) {
        throw new Error("이메일을 입력해 주세요.");
      }

      // API 실제 연동 코드
      // return requestEmailVerificationCode({ email });
      void requestEmailVerificationCode;
      await mockDelay();

      return {
        success: true,
        message: "인증코드를 전송했어요. 테스트 코드는 123456입니다.",
      };
    },
  });

export const useVerifyEmailVerificationMutation = () =>
  useMutation({
    mutationFn: async ({ email, code }: EmailVerificationConfirmRequest) => {
      if (!email.trim()) {
        throw new Error("이메일을 먼저 입력해 주세요.");
      }

      if (!code.trim()) {
        throw new Error("인증번호를 입력해 주세요.");
      }

      // API 실제 연동 코드
      // return verifyEmailVerificationCode({ email, code });
      void verifyEmailVerificationCode;
      await mockDelay();

      if (code !== "123456") {
        throw new Error("인증번호가 일치하지 않습니다.");
      }

      return {
        success: true,
        message: "이메일 인증이 완료되었습니다.",
      };
    },
  });

export const useCheckStudentIdMutation = () =>
  useMutation({
    mutationFn: async ({ studentId }: StudentIdCheckRequest) => {
      if (!studentId.trim()) {
        throw new Error("아이디를 입력해 주세요.");
      }

      // API 실제 연동 코드
      // return checkStudentIdDuplicate({ studentId });
      void checkStudentIdDuplicate;
      await mockDelay();

      if (studentId.trim().toLowerCase() === "admin") {
        throw new Error("이미 사용 중인 아이디입니다.");
      }

      return {
        success: true,
        message: "사용 가능한 아이디입니다.",
      };
    },
  });

export const useRegisterStepOneMutation = () =>
  useMutation({
    mutationFn: async (payload: RegisterStepOnePayload) => {
      console.log("전달받은 데이터(payload):", payload);

      if (!payload.name.trim()) {
        throw new Error("이름을 입력해 주세요.");
      }

      if (!payload.birthDate.trim()) {
        throw new Error("생년월일을 입력해 주세요.");
      }

      if (!payload.email.trim() || !payload.emailVerificationCode.trim()) {
        throw new Error("이메일 인증을 완료해 주세요.");
      }

      if (!payload.phoneNumber.trim()) {
        throw new Error("전화번호를 입력해 주세요.");
      }

      if (!payload.studentId.trim()) {
        throw new Error("아이디를 입력해 주세요.");
      }

      if (!payload.password.trim() || !payload.passwordConfirm.trim()) {
        throw new Error("비밀번호를 입력해 주세요.");
      }

      if (payload.password !== payload.passwordConfirm) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      if (!payload.agreedToTerms1 || !payload.agreedToTerms2) {
        throw new Error("약관 동의를 완료해 주세요.");
      }

      // API 실제 연동 코드
      // return submitRegisterStepOne(payload);
      void submitRegisterStepOne;
      await mockDelay();

      return {
        success: true,
        message: "1단계 정보가 저장되었습니다.",
      };
    },
  });

export type RegisterStepTwoPayload = {
  businessNumber: string;
  companyName: string;
  ceoName: string;
  representativeNumber: string;
  address: string;
  businessType: "대기업" | "중견기업" | "중소기업" | "중소상공인" | "";
  openingDate: string;
  taxType: "과세" | "비과세" | "";
  businessCategory: string;
  businessItem: string;
  businessLicenseFile: File | null;
};

export const submitRegisterStepTwo = async (
  payload: RegisterStepTwoPayload,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/auth/register/step-two",
    payload,
  );
  return response.data;
};

export const useRegisterStepTwoMutation = () =>
  useMutation({
    mutationFn: async (payload: RegisterStepTwoPayload) => {
      console.log("2단계 전송 데이터", payload);

      if (!payload.businessNumber.trim()) {
        throw new Error("사업자 등록 번호를 입력해 주세요.");
      }

      if (payload.businessNumber.trim().length !== 10) {
        throw new Error("사업자 등록 번호는 하이픈 없이 10자리여야 합니다.");
      }

      if (!payload.companyName.trim()) {
        throw new Error("회사명을 입력해 주세요.");
      }

      if (!payload.ceoName.trim()) {
        throw new Error("대표자명을 입력해 주세요.");
      }

      if (!payload.representativeNumber.trim()) {
        throw new Error("대표번호를 입력해 주세요.");
      }

      if (!payload.address.trim()) {
        throw new Error("회사 주소를 입력해 주세요.");
      }

      if (!payload.businessType) {
        throw new Error("기업구분을 선택해 주세요.");
      }

      if (!payload.openingDate.trim()) {
        throw new Error("개업일을 입력해 주세요.");
      }

      if (!payload.taxType) {
        throw new Error("과세 구분을 선택해 주세요.");
      }

      if (!payload.businessCategory.trim()) {
        throw new Error("업태명을 입력해 주세요.");
      }

      if (!payload.businessItem.trim()) {
        throw new Error("종목명을 입력해 주세요.");
      }

      if (!payload.businessLicenseFile) {
        throw new Error("사업자등록증 사본을 첨부해 주세요.");
      }

      await mockDelay();
      return {
        success: true,
        message: "사업자 정보가 저장되었습니다.",
      };
    },
  });
