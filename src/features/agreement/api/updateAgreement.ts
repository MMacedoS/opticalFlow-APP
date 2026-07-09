import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  AgreementFormValues,
  AgreementResponse,
} from "../types/agreement.type";

export function UpdateAgreement(
  payload: AgreementFormValues,
): Promise<AgreementResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do convenio não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da convenio não fornecido."));
  }
  return httpClient
    .put<AgreementResponse>(`/agreements/${id}`, payload)
    .then((response) => response.data);
}
