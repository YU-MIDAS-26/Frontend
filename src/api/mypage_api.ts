import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ApiResponse } from "./auth";

export type UserProfileData = {
  id: number;
  studentId: string;
  name: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  role: string;
  status: string;
};

export const getMyProfile = async (): Promise<ApiResponse<UserProfileData>> => {
  const response =
    await apiClient.get<ApiResponse<UserProfileData>>("/api/users/me");
  return response.data;
};

export const updateMyPhone = async (payload: {
  phoneNumber: string;
}): Promise<ApiResponse<{ success: boolean; message: string }>> => {
  const response = await apiClient.patch<
    ApiResponse<{ success: boolean; message: string }>
  >("/api/users/me/phone", payload);
  return response.data;
};

export const deleteMyAccount = async (): Promise<
  ApiResponse<{ success: boolean; message: string }>
> => {
  const response =
    await apiClient.delete<ApiResponse<{ success: boolean; message: string }>>(
      "/api/users/me",
    );
  return response.data;
};

export const useMyProfileQuery = () =>
  useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    select: (res) => res.data,
  });

export const useUpdatePhoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyPhone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
};

export const useDeleteAccountMutation = () =>
  useMutation({ mutationFn: deleteMyAccount });

export type PendingUser = {
  userId: number;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
  businessProfileId: number;
  businessRegistrationNumber: string;
  companyName: string;
  representativeName: string;
  representativePhone: string;
  companyAddress: string;
  businessType: string;
  openingDate: string;
  taxType: string;
  businessCategory: string;
  businessItem: string;
  licenseOriginalFileName: string;
  licenseFileSize: number;
  submittedAt: string;
};

export type RejectPayload = {
  rejectionReason: string;
};

export type AdminUserActionResponse = {
  userId: number;
  studentId: string;
  status: string;
  message: string;
};

export const getPendingUsers = async (): Promise<
  ApiResponse<PendingUser[]>
> => {
  const response = await apiClient.get<ApiResponse<PendingUser[]>>(
    "/api/admin/users/pending",
  );
  return response.data;
};

export const approveUser = async (
  userId: number,
): Promise<ApiResponse<AdminUserActionResponse>> => {
  const response = await apiClient.patch<ApiResponse<AdminUserActionResponse>>(
    `/api/admin/users/${userId}/approve`,
  );
  return response.data;
};
export const rejectUser = async ({
  userId,
  payload,
}: {
  userId: number;
  payload: RejectPayload;
}): Promise<ApiResponse<AdminUserActionResponse>> => {
  const response = await apiClient.patch<ApiResponse<AdminUserActionResponse>>(
    `/api/admin/users/${userId}/reject`,
    payload,
  );
  return response.data;
};

export const usePendingUsersQuery = () =>
  useQuery({
    queryKey: ["admin", "pendingUsers"],
    queryFn: getPendingUsers,
    select: (res) => res.data,
  });

export const useApproveUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pendingUsers"] });
    },
  });
};

export const useRejectUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pendingUsers"] });
    },
  });
};
