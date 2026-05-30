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
    "/api/auth/email/request",
    payload,
  );
  return response.data;
};

export const verifyEmailVerificationCode = async (
  payload: EmailVerificationConfirmRequest,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/api/auth/email/verify",
    {
      email: payload.email,
      code: payload.code,
    },
  );
  return response.data;
};

export const checkStudentIdDuplicate = async (
  payload: StudentIdCheckRequest,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/api/auth/student-id/check",
    payload,
  );
  return response.data;
};

export const submitRegisterStepOne = async (
  payload: RegisterStepOnePayload,
): Promise<RegisterApiMessage> => {
  const response = await apiClient.post<RegisterApiMessage>(
    "/api/auth/register/step-one",
    payload,
  );
  return response.data;
};

export const useRequestEmailVerificationMutation = () =>
  useMutation({
    mutationFn: async ({ email }: EmailVerificationRequest) => {
      if (!email.trim()) throw new Error("이메일을 입력해 주세요.");
      return requestEmailVerificationCode({ email });
    },
  });

export const useVerifyEmailVerificationMutation = () =>
  useMutation({
    mutationFn: async ({ email, code }: EmailVerificationConfirmRequest) => {
      if (!email.trim()) throw new Error("이메일을 먼저 입력해 주세요.");
      if (!code.trim()) throw new Error("인증번호를 입력해 주세요.");
      return verifyEmailVerificationCode({ email, code });
    },
  });

export const useCheckStudentIdMutation = () =>
  useMutation({
    mutationFn: async ({ studentId }: StudentIdCheckRequest) => {
      if (!studentId.trim()) throw new Error("아이디를 입력해 주세요.");
      return checkStudentIdDuplicate({ studentId });
    },
  });

export const useRegisterStepOneMutation = () =>
  useMutation({
    mutationFn: async (payload: RegisterStepOnePayload) => {
      if (!payload.name.trim()) throw new Error("이름을 입력해 주세요.");
      if (!payload.birthDate.trim())
        throw new Error("생년월일을 입력해 주세요.");
      if (!payload.email.trim() || !payload.emailVerificationCode.trim())
        throw new Error("이메일 인증을 완료해 주세요.");
      if (!payload.phoneNumber.trim())
        throw new Error("전화번호를 입력해 주세요.");
      if (!payload.studentId.trim()) throw new Error("아이디를 입력해 주세요.");
      if (!payload.password.trim() || !payload.passwordConfirm.trim())
        throw new Error("비밀번호를 입력해 주세요.");
      if (payload.password !== payload.passwordConfirm)
        throw new Error("비밀번호가 일치하지 않습니다.");
      if (!payload.agreedToTerms1 || !payload.agreedToTerms2)
        throw new Error("약관 동의를 완료해 주세요.");

      return submitRegisterStepOne(payload);
    },
  });

//회원가입 2단계
export type RegisterStepTwoPayload = {
  studentId: string; // 1단계에서 가입한 혹은 들고있던 유저 식별값 필요
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

export type StepTwoResponseData = {
  userId: number;
  businessProfileId: number;
  status: string;
  message: string;
};

export type StepTwoApiResponse = {
  status: string;
  message: string;
  data: StepTwoResponseData;
};

export const submitRegisterStepTwo = async (
  payload: RegisterStepTwoPayload,
): Promise<StepTwoApiResponse> => {
  const formData = new FormData();

  formData.append("studentId", payload.studentId);
  formData.append("businessRegistrationNumber", payload.businessNumber);
  formData.append("companyName", payload.companyName);
  formData.append("representativeName", payload.ceoName);
  formData.append("representativePhone", payload.representativeNumber);
  formData.append("companyAddress", payload.address);
  formData.append("businessType", payload.businessType);
  formData.append("openingDate", payload.openingDate);
  formData.append("taxType", payload.taxType);
  formData.append("businessCategory", payload.businessCategory);
  formData.append("businessItem", payload.businessItem);

  if (payload.businessLicenseFile) {
    formData.append("businessLicenseFile", payload.businessLicenseFile);
  }

  const response = await apiClient.post<StepTwoApiResponse>(
    "/api/auth/register/step-two",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const useRegisterStepTwoMutation = () =>
  useMutation({
    mutationFn: async (payload: RegisterStepTwoPayload) => {
      if (
        !payload.businessNumber.trim() ||
        payload.businessNumber.trim().length !== 10
      ) {
        throw new Error("사업자 등록 번호는 하이픈 없이 10자리여야 합니다.");
      }
      if (!payload.companyName.trim())
        throw new Error("회사명을 입력해 주세요.");
      if (!payload.ceoName.trim()) throw new Error("대표자명을 입력해 주세요.");
      if (!payload.representativeNumber.trim())
        throw new Error("대표번호를 입력해 주세요.");
      if (!payload.address.trim())
        throw new Error("회사 주소를 입력해 주세요.");
      if (!payload.businessType) throw new Error("기업구분을 선택해 주세요.");
      if (!payload.openingDate.trim())
        throw new Error("개업일을 입력해 주세요.");
      if (!payload.taxType) throw new Error("과세 구분을 선택해 주세요.");
      if (!payload.businessCategory.trim())
        throw new Error("업태명을 입력해 주세요.");
      if (!payload.businessItem.trim())
        throw new Error("종목명을 입력해 주세요.");
      if (!payload.businessLicenseFile)
        throw new Error("사업자등록증 사본을 첨부해 주세요.");

      return submitRegisterStepTwo(payload);
    },
  });
