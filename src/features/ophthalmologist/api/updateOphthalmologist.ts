import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  OphthalmologistFormValues,
  OphthalmologistResponse,
} from "../types/ophthalmologist.interface";

export function UpdateOphthalmologist(
  payload: OphthalmologistFormValues,
): Promise<OphthalmologistResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do Oftalmologista não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID do Oftalmologista não fornecido."));
  }
  return httpClient
    .put<OphthalmologistResponse>(`/ophthalmologists/${id}`, payload)
    .then((response) => response.data);
}
