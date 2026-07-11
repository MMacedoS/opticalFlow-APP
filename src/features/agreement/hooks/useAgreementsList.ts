import { useQuery } from "@tanstack/react-query";
import { getAgreementsList } from "../api/getAgreementsList";

const DEFAULT_AGREEMENTS_LIST = {
  search: "",
  limit: 10,
};

export type AgreementListFilters = typeof DEFAULT_AGREEMENTS_LIST;

export function useAgreementsList(args?: AgreementListFilters) {
  const queryParams = { ...DEFAULT_AGREEMENTS_LIST, ...args };

  return useQuery({
    queryKey: ["agreementsListAll", queryParams],
    queryFn: () => getAgreementsList(queryParams),
  });
}
