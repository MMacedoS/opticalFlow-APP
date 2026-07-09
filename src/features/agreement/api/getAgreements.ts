import { httpClient } from "@/utils/axios";
import type {
  AgreementRequest,
  AgreementResponse,
} from "../types/agreement.type";

export async function getAgreements(
  payload: AgreementRequest,
): Promise<AgreementResponse> {
  const response = await httpClient.get<AgreementResponse>("/agreements", {
    params: payload,
  });

  return response.data;
}
