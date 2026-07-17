import { httpClient } from "@/utils/axios";

export async function ChangeStatusOptometrist(
  optometristId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/optometrists/${optometristId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do Optometrista:", error);
    throw error;
  }
}
