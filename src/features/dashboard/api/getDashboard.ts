import { httpClient } from "@/utils/axios";

import type { DashboardSummary } from "../types/dashboard.types";

export async function getDashboard(): Promise<{ data: DashboardSummary }> {
  const response = await httpClient.get<{ data: DashboardSummary }>(
    "/dashboard",
  );
  return response.data;
}
