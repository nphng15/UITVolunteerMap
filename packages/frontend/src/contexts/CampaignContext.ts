import { createContext } from "react";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import type { Campaign } from "@uit-volunteer-map/shared";
import type { CreateCampaignInput, UpdateCampaignInput } from "@/api";

export interface CampaignContextType {
  // Queries
  campaigns: UseQueryResult<Campaign[], Error>;
  getCampaign: (id: number) => UseQueryResult<Campaign, Error>;

  // Mutations
  createCampaign: UseMutationResult<Campaign, Error, CreateCampaignInput>;
  updateCampaign: UseMutationResult<
    Campaign,
    Error,
    { id: number; input: UpdateCampaignInput }
  >;
  deleteCampaign: UseMutationResult<void, Error, number>;
}

export const CampaignContext = createContext<CampaignContextType | null>(null);
