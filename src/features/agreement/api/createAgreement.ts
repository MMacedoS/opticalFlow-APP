import { httpClient } from "@/utils/axios";
import type {
  AgreementFormValues,
  AgreementResponse,
} from "../types/agreement.type";

export async function CreateAgreement(
  payload: AgreementFormValues,
): Promise<AgreementResponse> {
  const response = await httpClient.post<AgreementResponse>(
    "/convenio",
    payload,
  );
  return response.data;
}
