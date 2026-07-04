import { httpClient } from "@/utils/axios";
import type { UserFormValues, UserResponse } from "../types/user.types";

export async function createUser(
  payload: UserFormValues,
): Promise<UserResponse> {
  const response = await httpClient.post<UserResponse>("/usuarios", payload);
  return response.data;
}
