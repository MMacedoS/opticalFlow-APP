import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  cancelFinancialEntry,
  deleteFinancialEntry,
  getFinancialEntries,
  reverseFinancialEntry,
  saveFinancialEntry,
  settleFinancialEntry,
} from "../api/financialApi";
import type {
  FinancialEntryPayload,
  FinancialFilters,
  PaymentMethod,
} from "../types/financial.type";

const LIST_KEY = "financialEntries";

export function useFinancialEntries(filters: FinancialFilters) {
  return useQuery({
    queryKey: [LIST_KEY, filters],
    queryFn: () => getFinancialEntries(filters),
  });
}

function useFinancialMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [LIST_KEY] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSaveFinancialEntry() {
  return useFinancialMutation(
    ({ id, payload }: { id?: string; payload: FinancialEntryPayload }) =>
      saveFinancialEntry(payload, id),
  );
}

export function useSettleFinancialEntry() {
  return useFinancialMutation(
    ({
      id,
      pagoEm,
      forma_pagamento,
    }: {
      id: string;
      pagoEm?: string;
      forma_pagamento: PaymentMethod;
    }) => settleFinancialEntry(id, { pagoEm, forma_pagamento }),
  );
}

export function useReverseFinancialEntry() {
  return useFinancialMutation((id: string) => reverseFinancialEntry(id));
}

export function useCancelFinancialEntry() {
  return useFinancialMutation((id: string) => cancelFinancialEntry(id));
}

export function useDeleteFinancialEntry() {
  return useFinancialMutation((id: string) => deleteFinancialEntry(id));
}
