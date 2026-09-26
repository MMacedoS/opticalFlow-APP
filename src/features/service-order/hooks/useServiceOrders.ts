import { useQuery } from "@tanstack/react-query";
import { getServiceOrders } from "../api/getServiceOrders";
import type { ServiceOrderFilters } from "../types/service-order.type";

const DEFAULT_SERVICE_ORDER_FILTERS: ServiceOrderFilters = {
  page: 1,
  limit: 10,
  search: "",
};

export function useServiceOrders(args?: ServiceOrderFilters) {
  const queryParams = {
    ...DEFAULT_SERVICE_ORDER_FILTERS,
    ...args,
  };

  return useQuery({
    queryKey: ["serviceOrdersList", queryParams],
    queryFn: () => getServiceOrders(queryParams),
  });
}
