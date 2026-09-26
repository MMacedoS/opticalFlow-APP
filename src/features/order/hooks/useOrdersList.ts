import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orders";

const DEFAULT_ORDERS_LIST = {
  search: "",
  limit: 10,
};

export type OrderListFilters = typeof DEFAULT_ORDERS_LIST;

export function useOrdersList(args?: OrderListFilters) {
  const queryParams = { ...DEFAULT_ORDERS_LIST, ...args };

  return useQuery({
    queryKey: ["ordersListAll", queryParams],
    queryFn: () => getOrders(queryParams),
  });
}
