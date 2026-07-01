import { httpClient } from "@/utils/axios";

import type { LoginRequest, LoginResponse } from "../types/login.types";

export async function createLogin(
  payload: LoginRequest,
): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}
