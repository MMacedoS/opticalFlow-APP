import { httpClient } from "@/utils/axios";

export async function deleteUser(userId: string): Promise<void> {
  try {
    await httpClient.delete(`/usuarios/${userId}`);
  } catch (error) {
    console.error("Erro ao deletar a usuario:", error);
    throw error;
  }
}
