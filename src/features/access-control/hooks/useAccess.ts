import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  deleteProfile,
  getAccessUsers,
  getCatalog,
  getProfiles,
  saveProfile,
  setUserProfiles,
} from "../api/accessApi";
import type { ProfilePayload } from "../types/access.type";

const PROFILES_KEY = "accessProfiles";
const USERS_KEY = "accessUsers";

export function useCatalog() {
  return useQuery({
    queryKey: ["accessCatalog"],
    queryFn: getCatalog,
    staleTime: Infinity,
  });
}

export function useProfiles() {
  return useQuery({ queryKey: [PROFILES_KEY], queryFn: getProfiles });
}

export function useAccessUsers() {
  return useQuery({ queryKey: [USERS_KEY], queryFn: getAccessUsers });
}

function useAccessMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [PROFILES_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSaveProfile() {
  return useAccessMutation(
    ({ id, payload }: { id?: string; payload: ProfilePayload }) =>
      saveProfile(payload, id),
  );
}

export function useDeleteProfile() {
  return useAccessMutation((id: string) => deleteProfile(id));
}

export function useSetUserProfiles() {
  return useAccessMutation(
    ({ usuarioId, acessoIds }: { usuarioId: string; acessoIds: string[] }) =>
      setUserProfiles(usuarioId, acessoIds),
  );
}
