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
  dayOfWeek: number; // 1=월, 2=화, 3=수, 4=목, 5=금, 6=토, 7=일
  hour: number; // 0 ~ 23
  amount: number; // 해당 셀의 매출 합계 (원)
  count: number; // 해당 셀의 거래 건수
}

export interface ChannelBreakdown {
  channel: "OFFLINE" | "DELIVERY";
  label: string;
  amount: number;
  count: number;
  ratio: number;
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

  getHourlyHeatmap: async (
    from?: string,
    to?: string,
  ): Promise<HourlyHeatmap[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const res = await fetch(`/api/payments/stats/hourly-heatmap?${params}`);
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

    const res = await fetch(`/api/payments/stats/channel-breakdown?${params}`);
    const json: ApiResponse<ChannelBreakdown[]> = await res.json();
    if (json.status === "ERROR") throw new Error(json.message);
    return json.data;
  },
};
