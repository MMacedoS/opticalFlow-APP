import { httpClient } from "@/utils/axios";

export async function DeleteBranch(branchId: string): Promise<void> {
  try {
    await httpClient.delete(`/filial/${branchId}`);
  } catch (error) {
    console.error("Erro ao deletar a filial:", error);
  }
}
