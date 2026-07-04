import { httpClient } from "@/utils/axios";
import type { UserFormValues, UserResponse } from "../types/user.types";

export async function updateUser(
  payload: UserFormValues,
): Promise<UserResponse> {
  const id = payload.id;
  if (!id) {
    throw new Error("ID da usuarios não fornecido.");
  }
  return httpClient
    .put<UserResponse>(`/usuarios/${id}`, payload)
    .then((response) => response.data);
}
