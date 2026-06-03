import { apiClient } from "./client";

export interface CommonResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface IngredientData {
  id: number;
  name: string;
  unit: string;
}

export interface CreateIngredientPayload {
  name: string;
  unit: string;
}

export const ingredientApi = {
  getIngredients: async (): Promise<CommonResponse<IngredientData[]>> => {
    const response =
      await apiClient.get<CommonResponse<IngredientData[]>>("/api/ingredients");

    return response.data;
  },

  createIngredient: async (
    payload: CreateIngredientPayload,
  ): Promise<CommonResponse<IngredientData>> => {
    const response = await apiClient.post<CommonResponse<IngredientData>>(
      "/api/ingredients",
      payload,
    );

    return response.data;
  },

  updateIngredient: async (
    ingredientId: number,
    payload: CreateIngredientPayload,
  ): Promise<CommonResponse<IngredientData>> => {
    const response = await apiClient.put<CommonResponse<IngredientData>>(
      `/api/ingredients/${ingredientId}`,
      payload,
    );
    return response.data;
  },

  deleteIngredient: async (
    ingredientId: number,
  ): Promise<CommonResponse<null>> => {
    const response = await apiClient.delete<CommonResponse<null>>(
      `/api/ingredients/${ingredientId}`,
    );

    return response.data;
  },
};

export interface NaverShopItem {
  title: string;
  link: string;
  mallName: string;
  lowestPrice: number;
}

export interface NaverLowestPriceResponse {
  ingredientName: string;
  topN: number;
  items: NaverShopItem[];
}

export const naverApi = {
  getLowestPrice: async (
    ingredientName: string,
    topN = 5,
  ): Promise<CommonResponse<NaverLowestPriceResponse>> => {
    const response = await apiClient.get<
      CommonResponse<NaverLowestPriceResponse>
    >("/api/naver/lowest-price", {
      params: {
        ingredientName,
        topN,
      },
    });

    return response.data;
  },
};

export interface PriceRecord {
  id: number;
  itemName: string; // 품목명 (예: 배추)
  itemCode: string;
  kindName: string; // 품종/규격 (예: 봄(10kg))
  kindCode: string;
  rank: string; // 등급 (예: 상품)
  rankCode: string;
  unit: string; // 단위
  categoryCode: string;
  productClsCode: string;
  collectedDate: string; // 수집 일자 (YYYY-MM-DD)
  priceToday: number; // 오늘 가격
  price1dAgo: number; // 1일 전 가격
  price1wAgo: number; // 1주 전 가격
  price2wAgo: number; // 2주 전 가격
  price1mAgo: number; // 1달 전 가격
  price1yAgo: number; // 1년 전 가격
  priceAvgYear: number; // 평년 가격
}

export const priceApi = {
  getLatestPrice: async (
    itemName: string,
  ): Promise<CommonResponse<PriceRecord>> => {
    const response = await apiClient.get<CommonResponse<PriceRecord>>(
      "/api/prices/latest",
      {
        params: { itemName },
      },
    );
    return response.data;
  },

  getPriceList: async (
    itemName: string,
    categoryCode?: string,
  ): Promise<CommonResponse<PriceRecord[]>> => {
    const response = await apiClient.get<CommonResponse<PriceRecord[]>>(
      "/api/prices/list",
      {
        params: { itemName, categoryCode },
      },
    );
    return response.data;
  },
};
