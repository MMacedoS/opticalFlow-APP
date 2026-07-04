import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatusUser } from "../api/changeStatusUser";

export function useUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      changeStatusUser(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da usuário:", error);
    },
  });
}
