import { httpClient } from "@/utils/axios";
import type {
  OphthalmologistRequest,
  OphthalmologistResponse,
} from "../types/ophthalmologist.interface";

export async function getOphthalmologists(
  payload: OphthalmologistRequest,
): Promise<OphthalmologistResponse> {
  const response = await httpClient.get<OphthalmologistResponse>(
    "/oftalmologista",
    {
      params: payload,
    },
  );

  return response.data;
}
