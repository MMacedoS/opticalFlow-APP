import { httpClient } from "@/utils/axios";

export async function DeleteCompany(companyId: string): Promise<void> {
  try {
    await httpClient.delete(`/empresas/${companyId}`);
  } catch (error) {
    console.error("Erro ao deletar a empresa:", error);
    throw error;
  }
}
