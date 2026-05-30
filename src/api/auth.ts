import { apiClient } from "./client";

export type LoginRequest = {
  studentId: string;
  password: string;
};

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type LoginResponseData = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    studentId: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
};

export type LogoutResponseData = {
  success: boolean;
  message: string;
};

export const login = async (
  payload: LoginRequest,
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await apiClient.post<ApiResponse<LoginResponseData>>(
    "/api/auth/login",
    payload,
  );
  return response.data;
};

export const logout = async (): Promise<ApiResponse<LogoutResponseData>> => {
  const response =
    await apiClient.post<ApiResponse<LogoutResponseData>>("/api/auth/logout");
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
    "/api/auth/register/step-one",
    payload,
  );
  return response.data;
};
