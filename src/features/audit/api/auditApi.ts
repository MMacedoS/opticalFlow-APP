import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  AuditFilters,
  AuditListData,
  AuditOptions,
} from "../types/audit.type";

const BASE = "/auditoria";

export async function getAudits(
  filters: AuditFilters,
): Promise<ApiResponse<AuditListData>> {
  const response = await httpClient.get<ApiResponse<AuditListData>>(BASE, {
    params: filters,
  });
  return response.data;
}

export async function getAuditOptions(): Promise<ApiResponse<AuditOptions>> {
  const response = await httpClient.get<ApiResponse<AuditOptions>>(
    `${BASE}/opcoes`,
  );
  return response.data;
}
