import { httpClient } from "@/utils/axios";

export async function DeleteOptometrist(optometristId: string): Promise<void> {
  try {
    await httpClient.delete(`/optometrists/${optometristId}`);
  } catch (error) {
    console.error("Erro ao deletar o Optometrista:", error);
  }
}
