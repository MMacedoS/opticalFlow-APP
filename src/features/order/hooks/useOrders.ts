import { useQuery } from "@tanstack/react-query";
import type { OrderFilter } from "../types/Order.type";
import { getOrders } from "../api/orders";

export function useOrder(args?: OrderFilter) {
  const queryParams = { ...args };

  return useQuery({
    queryKey: ["ordersList", queryParams],
    queryFn: () => getOrders(queryParams),
  });
}
