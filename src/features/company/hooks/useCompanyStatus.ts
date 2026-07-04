import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatusCompany } from "../api/changeStatusCompany";

export function useCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      changeStatusCompany(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da empresa:", error);
    },
  });
}
