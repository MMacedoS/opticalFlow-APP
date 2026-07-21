import { httpClient } from "@/utils/axios";
import type {
  OptometristRequest,
  OptometristResponse,
} from "../types/optometrist.interface";

export async function getOptometristList(
  payload: OptometristRequest,
): Promise<OptometristResponse> {
  const response = await httpClient.get<OptometristResponse>(
    "/optometrists/list",
    {
      params: payload,
    },
  );

  return response.data;
}
