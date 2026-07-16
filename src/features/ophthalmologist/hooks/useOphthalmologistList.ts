import { useQuery } from "@tanstack/react-query";
import { getOphthalmologists } from "../api/ophthalmologist";

const DEFAULT_OPHTHALMOLOGIST_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type ophthalmologistListFilters = typeof DEFAULT_OPHTHALMOLOGIST_LIST;

export function useOphthalmologistsList(args?: ophthalmologistListFilters) {
  const queryParams = { ...DEFAULT_OPHTHALMOLOGIST_LIST, ...args };

  return useQuery({
    queryKey: ["ophthalmologistsList", queryParams],
    queryFn: () => getOphthalmologists(queryParams),
  });
}
