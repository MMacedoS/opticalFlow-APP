import { httpClient } from "@/utils/axios";

export async function DeleteAgreement(agreementId: string): Promise<void> {
  try {
    await httpClient.delete(`/agreements/${agreementId}`);
  } catch (error) {
    console.error("Erro ao deletar o convenio:", error);
  }
}
