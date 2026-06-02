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
