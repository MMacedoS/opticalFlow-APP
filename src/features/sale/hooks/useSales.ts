import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  cancelSale,
  createSale,
  createSaleFromServiceOrder,
  deleteSale,
  finalizeSale,
  getSales,
  updateSale,
} from "../api/saleApi";
import type { SaleFilters, SalePayload } from "../types/sale.type";

const LIST_KEY = "sales";

export function useSales(filters: SaleFilters) {
  return useQuery({
    queryKey: [LIST_KEY, filters],
    queryFn: () => getSales(filters),
  });
}

function useSaleMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [LIST_KEY] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stockItems"] });
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      queryClient.invalidateQueries({ queryKey: ["serviceOrdersList"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSaveSale() {
  return useSaleMutation(
    ({ id, payload }: { id?: string; payload: SalePayload }) =>
      id ? updateSale(id, payload) : createSale(payload),
  );
}

export function useCreateSaleFromServiceOrder() {
  return useSaleMutation((ordemServicoId: string) =>
    createSaleFromServiceOrder(ordemServicoId),
  );
}

export function useFinalizeSale() {
  return useSaleMutation(
    ({
      id,
      pago,
      vencimento,
    }: {
      id: string;
      pago?: boolean;
      vencimento?: string;
    }) => finalizeSale(id, { pago, vencimento }),
  );
}

export function useCancelSale() {
  return useSaleMutation((id: string) => cancelSale(id));
}

export function useDeleteSale() {
  return useSaleMutation((id: string) => deleteSale(id));
}
