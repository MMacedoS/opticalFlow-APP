import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  addStockItem,
  createMovement,
  getMovements,
  getStockItems,
  getStocks,
  updateStockLimits,
} from "../api/stockApi";
import type {
  LimitsPayload,
  MovementPayload,
  StockItemFilters,
} from "../types/stock.type";

const STOCKS_KEY = "stocks";
const ITEMS_KEY = "stockItems";
const MOVEMENTS_KEY = "stockMovements";

export function useStocks() {
  return useQuery({ queryKey: [STOCKS_KEY], queryFn: getStocks });
}

export function useStockItems(filters: StockItemFilters, enabled: boolean) {
  return useQuery({
    queryKey: [ITEMS_KEY, filters],
    queryFn: () => getStockItems(filters),
    enabled,
  });
}

export function useStockMovements(estoqueId: string, produtoId: string) {
  return useQuery({
    queryKey: [MOVEMENTS_KEY, estoqueId, produtoId],
    queryFn: () => getMovements({ estoqueId, produtoId, limit: 50 }),
  });
}

function useStockMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
      queryClient.invalidateQueries({ queryKey: [MOVEMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useCreateMovement() {
  return useStockMutation((payload: MovementPayload) =>
    createMovement(payload),
  );
}

export function useUpdateStockLimits() {
  return useStockMutation(
    ({ id, payload }: { id: string; payload: LimitsPayload }) =>
      updateStockLimits(id, payload),
  );
}

export function useAddStockItem() {
  return useStockMutation(
    (payload: { estoqueId: string; produtoId: string } & LimitsPayload) =>
      addStockItem(payload),
  );
}
