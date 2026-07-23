import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProduct";

const DEFAULT_PRODUCTS_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type ProductListFilters = typeof DEFAULT_PRODUCTS_LIST;

export function useProducts(args?: ProductListFilters) {
  const queryParams = { ...DEFAULT_PRODUCTS_LIST, ...args };

  return useQuery({
    queryKey: ["productsList", queryParams],
    queryFn: () => getProducts(queryParams),
  });
}
