import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api/customers";

const DEFAULT_CUSTOMER_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type customerListFilters = typeof DEFAULT_CUSTOMER_LIST;

export function useCustomerList(args?: customerListFilters) {
  const queryParams = { ...DEFAULT_CUSTOMER_LIST, ...args };

  return useQuery({
    queryKey: ["customerList", queryParams],
    queryFn: () => getCustomers(queryParams),
  });
}
