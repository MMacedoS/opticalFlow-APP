import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getReport } from "../api/reportApi";
import type { ReportFilters } from "../types/report.type";

export function useReport(endpoint: string, filters: ReportFilters) {
  return useQuery({
    queryKey: ["report", endpoint, filters],
    queryFn: () => getReport(endpoint, filters),
    placeholderData: keepPreviousData,
  });
}
