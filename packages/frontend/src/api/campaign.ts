import type { ApiResponse, Campaign, CreateCampaignInput, UpdateCampaignInput } from "@uit-volunteer-map/shared";
import { API_ROUTES } from "@uit-volunteer-map/shared";
import apiClient from "./client";

export const campaignApi = {
  getAll: async (): Promise<Campaign[]> => {
    const { data } = await apiClient.get<ApiResponse<Campaign[]>>(
      API_ROUTES.CAMPAIGNS,
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch campaigns");
    }
    return data.data;
  },

  getOne: async (id: number): Promise<Campaign> => {
    const { data } = await apiClient.get<ApiResponse<Campaign>>(
      `${API_ROUTES.CAMPAIGNS}/${id}`,
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch campaign");
    }
    return data.data;
  },

  create: async (input: CreateCampaignInput): Promise<Campaign> => {
    const { data } = await apiClient.post<ApiResponse<Campaign>>(
      API_ROUTES.CAMPAIGNS,
      input,
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to create campaign");
    }
    return data.data;
  },

  update: async (id: number, input: UpdateCampaignInput): Promise<Campaign> => {
    const { data } = await apiClient.put<ApiResponse<Campaign>>(
      `${API_ROUTES.CAMPAIGNS}/${id}`,
      input,
    );
    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to update campaign");
    }
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `${API_ROUTES.CAMPAIGNS}/${id}`,
    );
    if (!data.success) {
      throw new Error(data.error || "Failed to delete campaign");
    }
  },
};
