import { httpClient } from "@/utils/axios";
import type { UserRequest, UserResponse } from "../types/user.types";

export async function getUser(payload: UserRequest): Promise<UserResponse> {
  const response = await httpClient.get<UserResponse>("/usuario", {
    params: payload,
  });
  return response.data;
}
