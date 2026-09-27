import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAuditOptions, getAudits } from "../api/auditApi";
import type { AuditFilters } from "../types/audit.type";

export function useAudits(filters: AuditFilters) {
  return useQuery({
    queryKey: ["audits", filters],
    queryFn: () => getAudits(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAuditOptions() {
  return useQuery({ queryKey: ["auditOptions"], queryFn: getAuditOptions });
}
