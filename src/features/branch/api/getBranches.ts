import { httpClient } from "@/utils/axios";
import type { BranchRequest, BranchResponse } from "../types/branch.type";

export async function getBranches(
  payload: BranchRequest,
): Promise<BranchResponse> {
  const response = await httpClient.get<BranchResponse>("/filial", {
    params: payload,
  });

  return response.data;
}
