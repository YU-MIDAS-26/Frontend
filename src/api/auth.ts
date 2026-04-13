import { apiClient } from "./client";

export type LoginRequest = {
  studentId: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id: string;
    name: string;
  };
};

export const login = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export type RegisterRequest = {
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

export type RegisterResponse = {
  success: boolean;
  message: string;
};

export const register = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
};
