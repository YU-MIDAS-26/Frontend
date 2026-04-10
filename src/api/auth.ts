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
