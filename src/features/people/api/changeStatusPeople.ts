import { httpClient } from "@/utils/axios";

export async function ChangeStatusPeople(
  peopleId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/peoples/${peopleId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do people:", error);
    throw error;
  }
}
