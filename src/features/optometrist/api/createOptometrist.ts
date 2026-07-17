import { httpClient } from "@/utils/axios";
import type {
  OptometristFormValues,
  OptometristResponse,
} from "../types/optometrist.interface";

export async function CreateOptometrist(
  payload: OptometristFormValues,
): Promise<OptometristResponse> {
  const response = await httpClient.post<OptometristResponse>(
    "/optometrists",
    payload,
  );
  return response.data;
}
