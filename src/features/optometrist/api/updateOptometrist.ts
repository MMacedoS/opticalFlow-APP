import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  OptometristFormValues,
  OptometristResponse,
} from "../types/optometrist.interface";

export function UpdateOptometrist(
  payload: OptometristFormValues,
): Promise<OptometristResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do Optometrista não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID do Optometrista não fornecido."));
  }
  return httpClient
    .put<OptometristResponse>(`/optometrists/${id}`, payload)
    .then((response) => response.data);
}
