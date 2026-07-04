import { httpClient } from "@/utils/axios";

export async function changeStatusCompany(
  companyId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/empresas/${companyId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao mudar o status da empresa:", error);
    throw error;
  }
}
