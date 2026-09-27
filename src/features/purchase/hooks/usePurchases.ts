import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  cancelPurchase,
  createPurchase,
  deletePurchase,
  getPurchases,
  receivePurchase,
  updatePurchase,
} from "../api/purchaseApi";
import type { PurchaseFilters, PurchasePayload } from "../types/purchase.type";

const LIST_KEY = "purchases";

export function usePurchases(filters: PurchaseFilters) {
  return useQuery({
    queryKey: [LIST_KEY, filters],
    queryFn: () => getPurchases(filters),
  });
}

function usePurchaseMutation<TVariables>(
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
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSavePurchase() {
  return usePurchaseMutation(
    ({ id, payload }: { id?: string; payload: PurchasePayload }) =>
      id ? updatePurchase(id, payload) : createPurchase(payload),
  );
}

export function useReceivePurchase() {
  return usePurchaseMutation(
    ({ id, vencimento }: { id: string; vencimento?: string }) =>
      receivePurchase(id, vencimento),
  );
}

export function useCancelPurchase() {
  return usePurchaseMutation((id: string) => cancelPurchase(id));
}

export function useDeletePurchase() {
  return usePurchaseMutation((id: string) => deletePurchase(id));
}
