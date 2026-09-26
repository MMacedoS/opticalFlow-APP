import { httpClient } from "@/utils/axios";

export async function changeStatusUser(
  userId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/usuario/${userId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao mudar o status da usuario:", error);
    throw error;
  }
}
