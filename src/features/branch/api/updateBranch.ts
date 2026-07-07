import { toast } from "sonner";
import type { BranchFormValues, BranchResponse } from "../types/branch.type";
import { httpClient } from "@/utils/axios";

export function UpdateBranch(
  payload: BranchFormValues,
): Promise<BranchResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID da filial não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da filial não fornecido."));
  }
  return httpClient
    .put<BranchResponse>(`/filiais/${id}`, payload)
    .then((response) => response.data);
}
