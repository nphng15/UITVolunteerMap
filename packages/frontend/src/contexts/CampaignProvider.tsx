import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  campaignApi,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from "@/api";
import { CampaignContext } from "./CampaignContext";

const campaignKeys = {
  all: ["campaigns"] as const,
  detail: (id: number) => ["campaigns", id] as const,
};

export default function CampaignProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  // Queries
  const campaigns = useQuery({
    queryKey: campaignKeys.all,
    queryFn: campaignApi.getAll,
  });

  const getCampaign = (id: number) =>
    useQuery({
      queryKey: campaignKeys.detail(id),
      queryFn: () => campaignApi.getOne(id),
      enabled: !!id,
    });

  // Mutations
  const createCampaign = useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCampaignInput }) =>
      campaignApi.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: (id: number) => campaignApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        getCampaign,
        createCampaign,
        updateCampaign,
        deleteCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}
