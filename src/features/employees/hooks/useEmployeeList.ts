import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api/employee";

const DEFAULT_EMPLOYEE_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type employeeListFilters = typeof DEFAULT_EMPLOYEE_LIST;

export function useEmployeesList(args?: employeeListFilters) {
  const queryParams = { ...DEFAULT_EMPLOYEE_LIST, ...args };

  return useQuery({
    queryKey: ["employeesList", queryParams],
    queryFn: () => getEmployees(queryParams),
  });
}
