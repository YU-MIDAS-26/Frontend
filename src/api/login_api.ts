import { useMutation } from "@tanstack/react-query";
import { login } from "./auth";
import type { LoginRequest } from "./auth";

export type LoginFormValues = {
  studentId: string;
  password: string;
  rememberMe: boolean;
};

const validateLoginForm = ({
  studentId,
  password,
}: LoginFormValues): string | null => {
  if (!studentId.trim()) {
    return "아이디를 입력해 주세요.";
  }
  if (!password.trim()) {
    return "비밀번호를 입력해 주세요.";
  }
  return null;
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: LoginFormValues) => {
      const validationError = validateLoginForm(payload);

      if (validationError) {
        throw new Error(validationError);
      }

      // 실제 백엔드 API 호출 실행
      const requestPayload: LoginRequest = {
        studentId: payload.studentId,
        password: payload.password,
      };

      return await login(requestPayload);
    },
  });
