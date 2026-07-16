import { httpClient } from "@/utils/axios";
import type {
  OphthalmologistFormValues,
  OphthalmologistResponse,
} from "../types/ophthalmologist.interface";

export async function CreateOphthalmologist(
  payload: OphthalmologistFormValues,
): Promise<OphthalmologistResponse> {
  const response = await httpClient.post<OphthalmologistResponse>(
    "/ophthalmologists",
    payload,
  );
  return response.data;
}
