import { httpClient } from "@/utils/axios";

export async function changeStatusBranch(
  branchId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/filiais/${branchId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status da filial:", error);
    throw error;
  }
}
