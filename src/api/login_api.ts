import { useMutation } from "@tanstack/react-query";
import type { LoginResponse } from "./auth";
import { login } from "./auth";

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

const mockLogin = async (payload: LoginFormValues): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    user: {
      id: payload.studentId,
      name: "테스트 사용자",
    },
  };
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: LoginFormValues) => {
      const validationError = validateLoginForm(payload);

      if (validationError) {
        throw new Error(validationError);
      }

      // API 실제 연동 코드
      // return login(payload);
      void login;
      return mockLogin(payload);
    },
  });
