import { httpClient } from "@/utils/axios";
import type { BranchFormValues, BranchResponse } from "../types/branch.type";

export async function createBranch(
  payload: BranchFormValues,
): Promise<BranchResponse> {
  const response = await httpClient.post<BranchResponse>("/filiais", payload);
  return response.data;
}
