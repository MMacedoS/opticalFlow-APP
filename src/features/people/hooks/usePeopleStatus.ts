import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusPeople } from "../api/changeStatusPeople";

export function usePeopleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusPeople(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da pessoa:", error);
    },
  });
}
