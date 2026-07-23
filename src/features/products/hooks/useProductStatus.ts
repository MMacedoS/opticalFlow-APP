import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusProduct } from "../api/changeStatusProduct";

export function useProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusProduct(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do produto:", error);
    },
  });
}
