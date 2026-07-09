import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusAgreement } from "../api/changeStatusAgreement";

export function useAgreementStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusAgreement(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreementsList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do convenio:", error);
    },
  });
}
