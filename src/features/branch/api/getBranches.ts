import { httpClient } from "@/utils/axios";
import type { BranchRequest, BranchResponse } from "../types/branch.type";

export async function getBranches(
  payload: BranchRequest,
): Promise<BranchResponse> {
  const response = await httpClient.get<BranchResponse>("/filiais", {
    params: payload,
  });

  return response.data;
}
