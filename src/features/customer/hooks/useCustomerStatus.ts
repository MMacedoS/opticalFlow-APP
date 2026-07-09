import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusCustomer } from "../api/changeStatusCustomer";

export function useCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusCustomer(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da cliente:", error);
    },
  });
}
