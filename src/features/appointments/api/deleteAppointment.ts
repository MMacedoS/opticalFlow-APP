import { httpClient } from "@/utils/axios";

export async function DeleteAppointment(appointmentId: string): Promise<void> {
  try {
    await httpClient.delete(`/appointments/${appointmentId}`);
  } catch (error) {
    console.error("Erro ao deletar o atendimento:", error);
  }
}
