import { httpClient } from "@/utils/axios";

export async function DeleteSchedule(scheduleId: string): Promise<void> {
  try {
    await httpClient.delete(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error("Erro ao deletar o evento na agenda:", error);
  }
}
