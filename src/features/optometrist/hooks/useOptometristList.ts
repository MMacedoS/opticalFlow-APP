import { useQuery } from "@tanstack/react-query";
import { getOptometrists } from "../api/optometrist";

const DEFAULT_OPTOMETRIST_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type OptometristListFilters = typeof DEFAULT_OPTOMETRIST_LIST;

export function useOptometristsList(args?: OptometristListFilters) {
  const queryParams = { ...DEFAULT_OPTOMETRIST_LIST, ...args };

  return useQuery({
    queryKey: ["optometristsList", queryParams],
    queryFn: () => getOptometrists(queryParams),
  });
}
