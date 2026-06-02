import { apiClient } from "./client";

export interface CommonResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponseData {
  answer: string;
  usedContext: string[];
}

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponseData> => {
    const response = await apiClient.post<CommonResponse<ChatResponseData>>(
      "/api/chat",
      { message } satisfies ChatRequest,
      { timeout: 60000 },
    );

    const body = response.data;
    if (body.status === "ERROR") {
      throw new Error(body.message || "챗봇 요청에 실패했습니다.");
    }

    return body.data;
  },
};
