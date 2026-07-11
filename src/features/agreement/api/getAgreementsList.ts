import { httpClient } from "@/utils/axios";
import type {
  AgreementRequest,
  AgreementResponse,
} from "../types/agreement.type";

export async function getAgreementsList(
  payload: AgreementRequest,
): Promise<AgreementResponse> {
  const response = await httpClient.get<AgreementResponse>("/agreements/all", {
    params: payload,
  });

  return response.data;
}
