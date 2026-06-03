import { useMutation } from "@tanstack/react-query";
import { login } from "./auth";
import { apiClient } from "./client";
import type { LoginRequest, ApiResponse } from "./auth";

export type LoginFormValues = {
  studentId: string;
  password: string;
};

export type PasswordResetRequestPayload = {
  studentId: string;
  email: string;
};

export type PasswordResetConfirmPayload = {
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
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

      const requestPayload: LoginRequest = {
        studentId: payload.studentId,
        password: payload.password,
      };

      return await login(requestPayload);
    },
  });

export const requestPasswordResetLink = async (
  payload: PasswordResetRequestPayload,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ success: boolean; message: string }>
  >("/api/auth/password-reset/request", payload);
  return response.data;
};

export const usePasswordResetLinkMutation = () =>
  useMutation({
    mutationFn: requestPasswordResetLink,
  });

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ success: boolean; message: string }>
  >("/api/auth/password-reset/confirm", payload);
  return response.data;
};

export const usePasswordResetConfirmMutation = () =>
  useMutation({
    mutationFn: confirmPasswordReset,
  });
