import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAgreement } from "../api/deleteAgreement";

export function useAgreementDelete() {
  const queryClient = useQueryClient();
  const deleteAgreement = useMutation({
    mutationFn: async (agreementId: string) => {
      await DeleteAgreement(agreementId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreementsList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o convenio. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteAgreement;
}
