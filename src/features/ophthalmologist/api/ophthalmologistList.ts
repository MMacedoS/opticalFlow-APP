import { httpClient } from "@/utils/axios";
import type {
  OphthalmologistRequest,
  OphthalmologistResponse,
} from "../types/ophthalmologist.interface";

export async function getOphthalmologistList(
  payload: OphthalmologistRequest,
): Promise<OphthalmologistResponse> {
  const response = await httpClient.get<OphthalmologistResponse>(
    "/ophthalmologists/list",
    {
      params: payload,
    },
  );

  return response.data;
}
