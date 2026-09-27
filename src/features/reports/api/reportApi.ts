import { httpClient } from "@/utils/axios";
import type { ApiResponse, Report, ReportFilters } from "../types/report.type";

export async function getReport(
  endpoint: string,
  filters: ReportFilters,
): Promise<ApiResponse<Report>> {
  const response = await httpClient.get<ApiResponse<Report>>(
    `/relatorio/${endpoint}`,
    { params: filters },
  );
  return response.data;
}
