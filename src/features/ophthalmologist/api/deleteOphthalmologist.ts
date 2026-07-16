import { httpClient } from "@/utils/axios";

export async function DeleteOphthalmologist(
  ophthalmologistId: string,
): Promise<void> {
  try {
    await httpClient.delete(`/ophthalmologists/${ophthalmologistId}`);
  } catch (error) {
    console.error("Erro ao deletar o oftalmologista:", error);
  }
}
