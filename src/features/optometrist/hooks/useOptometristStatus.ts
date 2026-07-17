import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusOptometrist } from "../api/changeStatusOptometrist";

export function useOptometristStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusOptometrist(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["optometristsList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do Optometrista:", error);
    },
  });
}
