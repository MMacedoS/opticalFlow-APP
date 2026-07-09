import { useQuery } from "@tanstack/react-query";
import { getAgreements } from "../api/getAgreements";

const DEFAULT_AGREEMENTS_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type AgreementListFilters = typeof DEFAULT_AGREEMENTS_LIST;

export function useAgreements(args?: AgreementListFilters) {
  const queryParams = { ...DEFAULT_AGREEMENTS_LIST, ...args };

  return useQuery({
    queryKey: ["agreementsList", queryParams],
    queryFn: () => getAgreements(queryParams),
  });
}
