import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ApiResponse } from "./auth";

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

export type EmployeeSavePayload = {
  name: string;
  birthDate: string;
  phoneNumber: string;
  employeeNumber: string;
  payType: "DAILY" | "HOURLY";
  payAmount: number;
  weeklyHolidayPayApplied: boolean;
};

export const getEmployees = async (): Promise<
  ApiResponse<BackendEmployee[]>
> => {
  const response =
    await apiClient.get<ApiResponse<BackendEmployee[]>>("/api/employees");
  return response.data;
};

export const createEmployee = async (
  payload: EmployeeSavePayload,
): Promise<ApiResponse<BackendEmployee>> => {
  const response = await apiClient.post<ApiResponse<BackendEmployee>>(
    "/api/employees",
    payload,
  );
  return response.data;
};

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

export const deleteEmployee = async (
  id: number,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.delete<
    ApiResponse<{ success: boolean; message: string }>
  >(`/api/employees/${id}`);
  return response.data;
};

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

//근태 관리

export type TimeObject = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  employeeName: string;
  workDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  breakTimeApplied: boolean;
  breakStartTime: string | null;
  breakEndTime: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendancePayload = {
  employeeId: number;
  workDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  breakTimeApplied: boolean;
  breakStartTime: string | null;
  breakEndTime: string | null;
};

export const getEmployeeAttendances = async (
  workDate: string,
): Promise<ApiResponse<AttendanceRecord[]>> => {
  const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
    "/api/employee-attendances",
    {
      params: { workDate },
    },
  );
  return response.data;
};

export const createEmployeeAttendance = async (
  payload: AttendancePayload,
): Promise<ApiResponse<AttendanceRecord>> => {
  const response = await apiClient.post<ApiResponse<AttendanceRecord>>(
    "/api/employee-attendances",
    payload,
  );
  return response.data;
};

export const updateEmployeeAttendance = async (
  attendanceId: number,
  payload: AttendancePayload,
): Promise<ApiResponse<AttendanceRecord>> => {
  const response = await apiClient.patch<ApiResponse<AttendanceRecord>>(
    `/api/employee-attendances/${attendanceId}`,
    payload,
  );
  return response.data;
};

export const deleteEmployeeAttendance = async (
  attendanceId: number,
): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.delete<
    ApiResponse<{ success: boolean; message: string }>
  >(`/api/employee-attendances/${attendanceId}`);
  return response.data;
};

export const useAttendancesQuery = (workDate: string) =>
  useQuery({
    queryKey: ["attendances", workDate],
    queryFn: () => getEmployeeAttendances(workDate),
    select: (res) => res.data,
  });

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployeeAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", variables.workDate],
      });
    },
  });
};

export const useUpdateAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attendanceId,
      payload,
    }: {
      attendanceId: number;
      payload: AttendancePayload;
    }) => updateEmployeeAttendance(attendanceId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", variables.payload.workDate],
      });
    },
  });
};

export const useDeleteAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      attendanceId,
    }: {
      attendanceId: number;
      workDate: string;
    }) => deleteEmployeeAttendance(attendanceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", variables.workDate],
      });
    },
  });
};
