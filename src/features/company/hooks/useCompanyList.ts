import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../api/getCompany";

const DEFAULT_PARAMS = {
  search: "",
  limit: 10,
  page: 1,
};

export type CompanyParams = Partial<typeof DEFAULT_PARAMS>;

export function useCompanyList(args?: CompanyParams) {
  const queryParams = { ...DEFAULT_PARAMS, ...args };

  return useQuery({
    queryKey: ["companyList", queryParams],
    queryFn: () => getCompany(queryParams),
  });
}
