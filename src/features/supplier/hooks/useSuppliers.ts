import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../api/supplierApi";
import type {
  SupplierFilters,
  SupplierPayload,
  SupplierResponse,
} from "../types/supplier.type";

export const SUPPLIERS_QUERY_KEY = "suppliersList";

const DEFAULT_FILTERS: SupplierFilters = { page: 1, limit: 12, search: "" };

export function useSuppliers(filters?: Partial<SupplierFilters>) {
  const params = { ...DEFAULT_FILTERS, ...filters };

  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY, params],
    queryFn: () => getSuppliers(params),
  });
}

export function useActiveSupplierOptions() {
  const query = useSuppliers({ limit: 100, ativo: true });

  return {
    ...query,
    options:
      query.data?.data.fornecedores.map((fornecedor) => ({
        value: fornecedor.id,
        label: fornecedor.nome_fantasia ?? fornecedor.razao_social,
      })) ?? [],
  };
}

function useSupplierMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<SupplierResponse>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSupplierCreate() {
  return useSupplierMutation((payload: SupplierPayload) =>
    createSupplier(payload),
  );
}

export function useSupplierUpdate() {
  return useSupplierMutation(
    ({ id, payload }: { id: string; payload: Partial<SupplierPayload> }) =>
      updateSupplier(id, payload),
  );
}

export function useSupplierDelete() {
  return useSupplierMutation((id: string) => deleteSupplier(id));
}
