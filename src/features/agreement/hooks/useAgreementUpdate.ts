import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AgreementFormValues } from "../types/agreement.type";
import { UpdateAgreement } from "../api/updateAgreement";

export function useAgreementUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AgreementFormValues) => UpdateAgreement(payload),
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
      toast.error(error.message, {
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
