import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../api/getBranches";

const DEFAULT_BRANCH_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type BranchListFilters = typeof DEFAULT_BRANCH_LIST;

export function useBranchList(args?: BranchListFilters) {
  const queryParams = { ...DEFAULT_BRANCH_LIST, ...args };

  return useQuery({
    queryKey: ["branchList", queryParams],
    queryFn: () => getBranches(queryParams),
  });
}
