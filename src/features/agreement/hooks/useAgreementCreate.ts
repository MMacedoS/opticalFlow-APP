import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AgreementFormValues } from "../types/agreement.type";
import { CreateAgreement } from "../api/createAgreement";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function useAgreementCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AgreementFormValues) =>
      CreateAgreement(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["agreementsList"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error), {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
}
