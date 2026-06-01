export interface ApiResponse<T> {
  status: "SUCCESS" | "ERROR";
  message: string;
  data: T;
}

export interface RowError {
  rowNumber: number;
  reason: string;
}

export interface UploadResult {
  totalRows: number;
  savedCount: number;
  skippedCount: number;
  errors: RowError[];
}

export interface DailyStats {
  date: string;
  amount: number;
  count: number;
}

export const csvApi = {
  uploadCsv: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/payments/upload", {
      method: "POST",
      body: formData,
    });

    const json: ApiResponse<UploadResult> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },

  getDailyStats: async (from?: string, to?: string): Promise<DailyStats[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const res = await fetch(`/api/payments/stats/daily?${params}`);
    const json: ApiResponse<DailyStats[]> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },
};
