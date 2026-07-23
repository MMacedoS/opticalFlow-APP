import { useQuery } from "@tanstack/react-query";
import { getProductsList } from "../api/getProductsList";

const DEFAULT_PRODUCTS_LIST = {
  search: "",
  limit: 10,
};

export type ProductListFilters = typeof DEFAULT_PRODUCTS_LIST;

export function useProductsList(args?: ProductListFilters) {
  const queryParams = { ...DEFAULT_PRODUCTS_LIST, ...args };

  return useQuery({
    queryKey: ["ProductsListAll", queryParams],
    queryFn: () => getProductsList(queryParams),
  });
}
