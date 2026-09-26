import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  createLaboratory,
  deleteLaboratory,
  getLaboratories,
  updateLaboratory,
} from "../api/laboratoryApi";
import type {
  LaboratoryFilters,
  LaboratoryPayload,
  LaboratoryResponse,
} from "../types/laboratory.type";

export const LABORATORIES_QUERY_KEY = "laboratoriesList";

const DEFAULT_FILTERS: LaboratoryFilters = { page: 1, limit: 12, search: "" };

export function useLaboratories(filters?: Partial<LaboratoryFilters>) {
  const params = { ...DEFAULT_FILTERS, ...filters };

  return useQuery({
    queryKey: [LABORATORIES_QUERY_KEY, params],
    queryFn: () => getLaboratories(params),
  });
}

export function useActiveLaboratoryOptions() {
  const query = useLaboratories({ limit: 100, ativo: true });

  return {
    ...query,
    options:
      query.data?.data.laboratorios.map((laboratorio) => ({
        value: laboratorio.id,
        label: laboratorio.nome,
      })) ?? [],
  };
}

function useLaboratoryMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<LaboratoryResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [LABORATORIES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useLaboratoryCreate() {
  return useLaboratoryMutation((payload: LaboratoryPayload) =>
    createLaboratory(payload),
  );
}

export function useLaboratoryUpdate() {
  return useLaboratoryMutation(
    ({ id, payload }: { id: string; payload: Partial<LaboratoryPayload> }) =>
      updateLaboratory(id, payload),
  );
}

export function useLaboratoryDelete() {
  return useLaboratoryMutation((id: string) => deleteLaboratory(id));
}
