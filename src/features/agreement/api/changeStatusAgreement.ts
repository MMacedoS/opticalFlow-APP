export async function getCustomers() {}
import { httpClient } from "@/utils/axios";

export async function ChangeStatusAgreement(
  agreementId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/agreements/${agreementId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do convenio:", error);
    throw error;
  }
}
