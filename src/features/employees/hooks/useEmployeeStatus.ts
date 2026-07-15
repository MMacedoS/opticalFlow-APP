import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusEmployee } from "../api/changeStatusEmployee";

export function useEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      ChangeStatusEmployee(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeesList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do funcionario:", error);
    },
  });
}
