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

export interface HourlyHeatmap {
  dayOfWeek: number;
  hour: number;
  amount: number;
  count: number;
}

export interface ChannelBreakdown {
  channel: "OFFLINE" | "DELIVERY";
  label: string;
  amount: number;
  count: number;
  ratio: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const csvApi = {
  uploadCsv: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/payments/upload`, {
      method: "POST",
      headers: authHeaders(),
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

    const res = await fetch(`${API_BASE}/api/payments/stats/daily?${params}`, {
      headers: authHeaders(),
    });
    const json: ApiResponse<DailyStats[]> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },

  getHourlyHeatmap: async (
    from?: string,
    to?: string,
  ): Promise<HourlyHeatmap[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const res = await fetch(`${API_BASE}/api/payments/stats/hourly-heatmap?${params}`, {
      headers: authHeaders(),
    });
    const json: ApiResponse<HourlyHeatmap[]> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },

  getChannelStats: async (
    from?: string,
    to?: string,
  ): Promise<ChannelBreakdown[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const res = await fetch(`${API_BASE}/api/payments/stats/channel-breakdown?${params}`, {
      headers: authHeaders(),
    });
    const json: ApiResponse<ChannelBreakdown[]> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },
};
