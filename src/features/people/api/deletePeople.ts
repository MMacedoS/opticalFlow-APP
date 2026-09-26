import { httpClient } from "@/utils/axios";

export async function DeletePeople(peopleId: string): Promise<void> {
  try {
    await httpClient.delete(`/pessoa/${peopleId}`);
  } catch (error) {
    console.error("Erro ao deletar o pessoa:", error);
  }
}
