import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusOphthalmologist } from "../api/changeStatusOphthalmologist";

export function useOphthalmologistStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusOphthalmologist(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ophthalmologistsList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do oftalmologista:", error);
    },
  });
}
