import { httpClient } from "@/utils/axios";

export async function ChangeStatusOphthalmologist(
  ophthalmologistId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/ophthalmologists/${ophthalmologistId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do Oftalmologista:", error);
    throw error;
  }
}
