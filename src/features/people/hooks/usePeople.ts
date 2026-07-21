import { useQuery } from "@tanstack/react-query";
import { getPeoples } from "../api/people";

const DEFAULT_PEOPLE_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type peopleListFilters = typeof DEFAULT_PEOPLE_LIST;

export function usePeople(args?: peopleListFilters) {
  const queryParams = { ...DEFAULT_PEOPLE_LIST, ...args };

  return useQuery({
    queryKey: ["peoples", queryParams],
    queryFn: () => getPeoples(queryParams),
  });
}
