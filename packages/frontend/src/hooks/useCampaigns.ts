import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignApi } from "@/api";
import { campaignKeys } from "@/api/queryKeys";
import type {
  CreateCampaignInput,
  UpdateCampaignInput,
} from "@uit-volunteer-map/shared";

/**
 * Hook to fetch all campaigns
 */
export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.all,
    queryFn: campaignApi.getAll,
  });
}

/**
 * Hook to fetch a single campaign by ID
 */
export function useCampaign(id: number) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => campaignApi.getOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new campaign
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

/**
 * Hook to update an existing campaign
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCampaignInput }) =>
      campaignApi.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
    },
  });
}

/**
 * Hook to delete a campaign
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => campaignApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}
