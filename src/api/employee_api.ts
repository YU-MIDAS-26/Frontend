import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ApiResponse } from "./auth";

// 백엔드 통신 규격 데이터 타입
export type BackendEmployee = {
  id: number;
  name: string;
  birthDate: string;
  phoneNumber: string;
  employeeNumber: string;
  payType: "DAILY" | "HOURLY";
  payAmount: number;
  weeklyHolidayPayApplied: boolean;
  status: "ACTIVE" | "DELETED";
  createdAt: string;
  updatedAt: string;
};

// 직원 생성/수정용 데이터 요청 규격
export type EmployeeSavePayload = {
  name: string;
  birthDate: string;
  phoneNumber: string;
  employeeNumber: string;
  payType: "DAILY" | "HOURLY";
  payAmount: number;
  weeklyHolidayPayApplied: boolean;
};

// 1. 직원 목록 조회
export const getEmployees = async (): Promise<
  ApiResponse<BackendEmployee[]>
> => {
  const response =
    await apiClient.get<ApiResponse<BackendEmployee[]>>("/api/employees");
  return response.data;
};

// 2. 직원 등록
export const createEmployee = async (
  payload: EmployeeSavePayload,
): Promise<ApiResponse<BackendEmployee>> => {
  const response = await apiClient.post<ApiResponse<BackendEmployee>>(
    "/api/employees",
    payload,
  );
  return response.data;
};

// 3. 직원 수정
export const updateEmployee = async (
  id: number,
  payload: EmployeeSavePayload,
): Promise<ApiResponse<BackendEmployee>> => {
  const response = await apiClient.patch<ApiResponse<BackendEmployee>>(
    `/api/employees/${id}`,
    payload,
  );
  return response.data;
};

// 4. 직원 삭제
export const deleteEmployee = async (
  id: number,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.delete<
    ApiResponse<{ success: boolean; message: string }>
  >(`/api/employees/${id}`);
  return response.data;
};

// --- React Query Hooks 세팅 ---

export const useEmployeesQuery = () =>
  useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    select: (res) => res.data,
  });

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: EmployeeSavePayload;
    }) => updateEmployee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
